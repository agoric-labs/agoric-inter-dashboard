package writeheadconfigs

import (
	"context"
	"fmt"
	"p2p-tendermint-trigger/model"
)

// Env describes all IO deps for Resolve.
type Env interface {
	GetMaxWriteCount() int
	GetBatchSize() int64
	GetLatestDBHeight(ctx context.Context) (*int64, error)
	GetLatestStatusHeight(ctx context.Context) (int64, error)
	WriteConfig(rg model.HeightRange) error
	WaitNextBlock() error
}

// Resolve generates json line configs for batch uploads.
func Resolve(ctx context.Context, env Env) error {
	lastStatusHeight, err := env.GetLatestStatusHeight(ctx)
	if err != nil {
		return fmt.Errorf("failed to getLastestStatusHeight: %w", err)
	}

	lastDBHeightR, err := env.GetLatestDBHeight(ctx)
	if err != nil {
		return fmt.Errorf("failed to GetLastestDBHeight: %w", err)
	}

	if lastDBHeightR == nil {
		// exit 0
		// target-bigquery must creates the blocks table
		return writeConfig(env, lastStatusHeight, lastStatusHeight)
	}

	lastDBHeight := *lastDBHeightR
	maxWriteCount := env.GetMaxWriteCount()
	batchSize := env.GetBatchSize()

	for idx := maxWriteCount; idx > 0; idx-- {
		lastDBHeight, lastStatusHeight, err = makeNextBatch(ctx, env, lastDBHeight, lastStatusHeight, batchSize)
		if err != nil {
			return err
		}
	}

	return nil
}

//nolint:lll
func makeNextBatch(ctx context.Context, env Env, lastDBHeight, lastStatusHeight, batchSize int64) (int64, int64, error) {
	if lastStatusHeight > lastDBHeight {
		nextHead := lastDBHeight + batchSize
		if nextHead > lastStatusHeight {
			nextHead = lastStatusHeight
		}

		err := writeConfig(env, lastDBHeight+1, nextHead)
		if err != nil {
			return 0, 0, fmt.Errorf("failed to WriteConfig: %w", err)
		}

		lastDBHeight = nextHead
	}

	if lastDBHeight+batchSize > lastStatusHeight {
		err := env.WaitNextBlock()
		if err != nil {
			return 0, 0, fmt.Errorf("failed to WaitNextBlock: %w", err)
		}

		lastStatusHeight, err = env.GetLatestStatusHeight(ctx)
		if err != nil {
			return 0, 0, fmt.Errorf("failed to getLastStatusHeight in the loop: %w", err)
		}
	}

	return lastDBHeight, lastStatusHeight, nil
}

func writeConfig(env Env, earliest, latest int64) error {
	rg := model.HeightRange{
		Earliest: earliest,
		Latest:   latest,
	}

	err := env.WriteConfig(rg)
	if err != nil {
		return fmt.Errorf("failed to WriteConfig for the single height: %w", err)
	}

	return nil
}
