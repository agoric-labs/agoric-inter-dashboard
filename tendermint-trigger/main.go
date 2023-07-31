package main

import (
	"context"
	"os"
	"os/signal"
	"sync/atomic"
	"syscall"

	"p2p-tendermint-trigger/case/writeheadconfigs"
	"p2p-tendermint-trigger/case/writetailconfigs"

	environment "p2p-tendermint-trigger/env"
)

var stopped int32

func main() {
	var gracefulStop = make(chan os.Signal, 1)

	signal.Notify(gracefulStop, syscall.SIGTERM)
	signal.Notify(gracefulStop, syscall.SIGINT)

	if len(os.Args) < 2 {
		panic("call ./tendermint-trigger head|tail]")
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	env, err := environment.New(ctx, os.Args[2:])
	if err != nil {
		panic(err)
	}

	log := env.GetLogger()

	go func() {
		for {
			sig := <-gracefulStop
			log.Warn().Str("sig", sig.String()).Msg("caught sig, waiting the iteration end...")
			atomic.AddInt32(&stopped, 1)

			cancel()

			err := env.Close()
			if err != nil {
				log.Fatal().Err(err).Msg("failed to close the env")
			}
		}
	}()

	defer func() {
		err := env.Close()
		if err != nil {
			log.Fatal().Err(err).Msg("failed to close the env")
		}
	}()

	mode := os.Args[1]

	log.Info().Str("mode", mode).Msg("starting")

	switch mode {
	case "head":
		err = writeheadconfigs.Resolve(ctx, env)
	case "tail":
		err = writetailconfigs.Resolve(ctx, env)
	default:
		log.Fatal().Str("mode", mode).Msg("unknown mode")
	}

	if err != nil {
		log.Fatal().Err(err).Msg("failed to resolve")
	}
}
