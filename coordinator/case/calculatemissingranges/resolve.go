package calculatemissingranges

import (
	"context"
	"errors"
	"fmt"
	"p2p-coordinator/model"
	"sort"
)

// ErrSyncedRangesOverlaped throws if some ranges overlaped.
var ErrSyncedRangesOverlaped = errors.New("synced ranges overlaped")

// ErrSplitBrain too big difference between the status state and db state
var ErrSplitBrain = errors.New("split brain")

// Input ...
type Input struct {
	SyncedRanges []*model.HeightRange
	BatchSize    int64
	OutputLimit  int64
}

// Env contains all io deps.
type Env interface {
	GetTendermintRange(ctx context.Context) (*model.HeightRange, error)
}

// Resolve returns missing ranges.
//
//nolint:funlen
func Resolve(ctx context.Context, env Env, input Input) ([]*model.HeightRange, error) {
	status, err := env.GetTendermintRange(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to GetTendermintRange: %w", err)
	}

	syncedRanges := []*model.HeightRange{}

	if len(input.SyncedRanges) == 0 {
		return getBatchedRanges(*status, input.BatchSize, input.OutputLimit), nil
	}

	// skip unavailable ranges
	for _, rg := range input.SyncedRanges {
		if rg.Earliest <= status.Latest && rg.Latest >= status.Earliest {
			syncedRanges = append(syncedRanges, rg)
		}
	}

	if len(syncedRanges) == 0 {
		return nil, ErrSplitBrain
	}

	sort.Slice(syncedRanges, func(i, j int) bool {
		return syncedRanges[i].Earliest < syncedRanges[j].Earliest
	})

	res := []*model.HeightRange{}

	syncedEarliest := syncedRanges[0].Earliest
	syncedLatest := syncedRanges[len(syncedRanges)-1].Latest

	// first of all, add head ranges
	if syncedLatest < status.Latest {
		hole := model.HeightRange{
			Earliest: syncedLatest + 1,
			Latest:   status.Latest,
		}

		ranges := getBatchedRanges(hole, input.BatchSize, input.OutputLimit)
		res = append(res, ranges...)

		// maybe that's enough
		input.OutputLimit -= int64(len(ranges))
		if input.OutputLimit <= 0 {
			return res, nil
		}
	}

	// then find holes
	for i := 0; i < len(syncedRanges)-1; i++ {
		hole := model.HeightRange{
			Earliest: syncedRanges[i].Latest + 1,
			Latest:   syncedRanges[i+1].Earliest - 1,
		}

		holeSize := hole.Latest - hole.Earliest + 1

		// skip empty holes
		if holeSize == 0 {
			continue
		}

		if holeSize < 0 {
			return nil, ErrSyncedRangesOverlaped
		}

		ranges := getBatchedRanges(hole, input.BatchSize, input.OutputLimit)
		res = append(res, ranges...)

		// maybe that's enough (2)
		input.OutputLimit -= int64(len(ranges))
		if input.OutputLimit <= 0 {
			return res, nil
		}
	}

	// and finally add head holes
	if syncedEarliest > status.Earliest {
		hole := model.HeightRange{
			Earliest: status.Earliest,
			Latest:   syncedEarliest - 1,
		}

		res = append(res, getBatchedRanges(hole, input.BatchSize, input.OutputLimit)...)
	}

	return res, nil
}

func getBatchedRanges(hole model.HeightRange, batchSize, outputLimit int64) []*model.HeightRange {
	res := []*model.HeightRange{}

	for hole.Latest-hole.Earliest >= batchSize {
		batch := model.HeightRange{
			Earliest: hole.Latest - batchSize + 1,
			Latest:   hole.Latest,
		}

		res = append(res, &batch)

		outputLimit--
		if outputLimit == 0 {
			return res
		}

		hole.Latest = batch.Earliest - 1
	}

	if hole.Latest >= hole.Earliest {
		res = append(res, &hole)
	}

	return res
}
