package writetailconfigs

import (
	"context"
	"fmt"
	"p2p-tendermint-trigger/model"
)

// Env describes all IO deps for Resolve.
type Env interface {
	GetMaxWriteCount() int
	GetBatchSize() int64
	GetEarliestDBHeight(ctx context.Context) (*int64, error)
	GetEarliestStatusHeight(ctx context.Context) (int64, error)
	WriteConfig(rg model.HeightRange) error
}

// Resolve generates json line configs for batch uploads.
func Resolve(ctx context.Context, env Env) error {
	maxWriteCount := env.GetMaxWriteCount()
	batchSize := env.GetBatchSize()

	earliestDBHeightP, err := env.GetEarliestDBHeight(ctx)
	if err != nil {
		return fmt.Errorf("failed to GetEarliestDBHeight: %w", err)
	}

	if earliestDBHeightP == nil {
		return nil
	}

	earliestDBHeight := *earliestDBHeightP

	earliestStatusHeight, err := env.GetEarliestStatusHeight(ctx)
	if err != nil {
		return fmt.Errorf("failed to getEarliestStatusHeight: %w", err)
	}

	for idx := maxWriteCount; idx > 0; idx-- {
		if earliestStatusHeight >= earliestDBHeight {
			return nil
		}

		nextTail := earliestDBHeight - batchSize
		if nextTail < earliestStatusHeight {
			nextTail = earliestStatusHeight
		}

		rg := model.HeightRange{
			Earliest: nextTail,
			Latest:   earliestDBHeight - 1,
		}

		err := env.WriteConfig(rg)
		if err != nil {
			return fmt.Errorf("failed to WriteConfig: %w", err)
		}

		earliestDBHeight = nextTail
	}

	return nil
}
