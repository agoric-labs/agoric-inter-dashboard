package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"p2p-coordinator/case/calculatemissingranges"
	environment "p2p-coordinator/env"
	"p2p-coordinator/model"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/rs/zerolog"
)

var log = zerolog.New(os.Stderr).With().Str("type", "LOG").Str("component", "coordinator").Logger()

var stopped int32

var state struct {
	sync.Mutex

	NewRanges    []*model.HeightRange
	SyncedRanges []*model.HeightRange
}

var (
	syncedRangesCount = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "coordinator_synced_ranges_size",
		Help: "The total count of synced ranges",
	})
	newRangesCount = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "coordinator_new_ranges_size",
		Help: "The total count of ranges in progress",
	})
	roundBlockCount = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "coordinator_round_block_size",
		Help: "The total count of processed blocks",
	})
	avgBlockTime = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "coordinator_avg_block_time",
		Help: "The average extract block time",
	})
)

func main() {
	var gracefulStop = make(chan os.Signal, 1)

	signal.Notify(gracefulStop, syscall.SIGTERM)
	signal.Notify(gracefulStop, syscall.SIGINT)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		for {
			sig := <-gracefulStop
			log.Warn().Str("sig", sig.String()).Msg("caught sig, waiting the iteration end...")
			atomic.AddInt32(&stopped, 1)

			cancel()
		}
	}()

	serverAddr := os.Getenv("COORDINATOR_ADDR")
	if serverAddr != "" {
		go runServer(serverAddr)
	}

	err := process(ctx, os.Args[1:])
	if err != nil {
		panic(err)
	}
}

//nolint:funlen
func process(ctx context.Context, subcommand []string) error {
	env, err := environment.New(subcommand)
	if err != nil {
		return fmt.Errorf("failed to make an env: %w", err)
	}

	syncedRanges, err := env.GetSyncedRanges()
	if err != nil {
		return fmt.Errorf("failed to GetSyncedRanges: %w", err)
	}

	input := calculatemissingranges.Input{
		SyncedRanges: syncedRanges,
		BatchSize:    100, // TODO: read from the env
		OutputLimit:  10,  // TODO: read from the env
	}

	roundDelay := 1 * time.Second

MainLoop:
	for {
		startedAt := time.Now()

		// wait new blocks
		time.Sleep(roundDelay)

		log.Info().Dur("delay", roundDelay).Msg("start a round")

		// calculate new ranges
		newRanges, err := calculatemissingranges.Resolve(ctx, env, input)
		if err != nil {
			return fmt.Errorf("failed to calculatemissingranges: %w", err)
		}

		// detect /status spam if all blocks have been downloaded.
		if len(newRanges) == 0 {
			// delay adaptation
			roundDelay += time.Second
		}

		blockCount := int64(0)

		for n, newRange := range newRanges {
			// with ctx WriteConfig breaks writing after stopping
			err := env.WriteConfig(*newRange)
			if err != nil {
				return fmt.Errorf("failed to WriteConfig: %w", err)
			}

			blockCount += newRange.Size()

			input.SyncedRanges = model.CompressHeightRanges(append(input.SyncedRanges, newRange))

			// update state for the monitoring page
			state.Lock()
			state.NewRanges = append([]*model.HeightRange{}, newRanges[n:]...)
			state.SyncedRanges = append([]*model.HeightRange{}, input.SyncedRanges...)
			state.Unlock()

			// calculate metrics
			newRangesCount.Set(float64(len(newRanges)))
			syncedRangesCount.Set(float64(len(input.SyncedRanges)))
			roundBlockCount.Set(float64(blockCount))
			avgBlockTime.Set(time.Since(startedAt).Seconds() / float64(blockCount))

			// graceful shutdown after each range
			if atomic.LoadInt32(&stopped) > 0 {
				break MainLoop
			}
		}
	}

	return nil
}
