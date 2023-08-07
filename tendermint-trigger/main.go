package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"os/signal"
	"sync/atomic"
	"syscall"
	"time"

	"p2p-tendermint-trigger/case/writeheadconfigs"
	"p2p-tendermint-trigger/case/writetailconfigs"
	"p2p-tendermint-trigger/model"

	environment "p2p-tendermint-trigger/env"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var stopped int32

func main() { //nolint:funlen,cyclop
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
		}
	}()

	defer func() {
		err := env.Close()
		if err != nil {
			log.Fatal().Err(err).Msg("failed to close the env")
		}
	}()

	mode := os.Args[1]
	addr := os.Getenv("TENDERMINT_TRIGGER_ADDR")

	log.Info().Str("mode", mode).Msg("starting")

	if addr != "" {
		go runServer(addr, env)
	}

MAIN_LOOP:
	for {
		switch mode {
		case "head":
			err = writeheadconfigs.Resolve(ctx, env)
		case "tail":
			err = writetailconfigs.Resolve(ctx, env)
		default:
			log.Error().Str("mode", mode).Msg("unknown mode")

			break MAIN_LOOP
		}

		if err != nil {
			log.Error().Err(err).Msg("failed to resolve")

			break
		}

		if atomic.LoadInt32(&stopped) > 0 {
			break
		}
	}
}

func runServer(addr string, env *environment.Env) {
	log := env.GetLogger()

	http.Handle("/metrics", promhttp.Handler())
	http.HandleFunc("/", func(writer http.ResponseWriter, req *http.Request) {
		if req.Method != http.MethodPost {
			http.NotFound(writer, req)

			return
		}

		var rang model.HeightRange

		err := json.NewDecoder(req.Body).Decode(&rang)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusBadRequest)

			return
		}

		// it is a manual operation, check potential duplicates to avoid problems
		count, err := env.GetBlockCountByHeightRange(req.Context(), rang)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)

			return
		}

		if count > 0 {
			http.Error(writer, "some heights already exists", http.StatusBadRequest)

			return
		}

		err = env.WriteConfig(rang) //nolint:contextcheck
		if err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)

			return
		}
	})

	server := &http.Server{
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}

	log.Info().Str("addr", addr).Msg("serve metrics")

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to ListenAndServe")
	}
}
