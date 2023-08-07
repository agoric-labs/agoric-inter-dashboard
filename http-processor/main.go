package main

import (
	"net/http"
	"os"
	"time"

	"github.com/rs/zerolog"
)

var log = zerolog.New(os.Stderr).With().Str("type", "LOG").Logger()
var jsonCommonError = `{"error": "catch an error, see logs"}`
var defaultAddr = ":3344"

func main() {
	if len(os.Args) < 2 {
		log.Fatal().Msg("use ./http-processor cmd arg1 arg2")
	}

	token := os.Getenv("TOKEN")

	addr := os.Getenv("ADDR")
	if addr == "" {
		port := os.Getenv("PORT")
		if port != "" {
			addr = ":" + port
		} else {
			addr = defaultAddr
		}
	}

	proc := processor{
		token: token,
		cmd:   os.Args[1:],
	}

	http.HandleFunc("/healthz", healthz)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		err := proc.run(w, r)
		if err != nil {
			http.Error(w, jsonCommonError, http.StatusInternalServerError)
			log.Error().Err(err).Msg("failed to process")

			return
		}
	})

	server := &http.Server{
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}

	log.Info().Str("addr", server.Addr).Msg("start listening")

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to ListenAndServe")
	}
}

func healthz(http.ResponseWriter, *http.Request) {
	// empty 200
}
