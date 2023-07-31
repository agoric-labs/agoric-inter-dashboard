package main

import (
	"encoding/json"
	"os"

	"bou.ke/monkey"
	"github.com/rs/zerolog"
)

var log = zerolog.New(os.Stderr).With().Str("type", "LOG").Str("component", "tendermint-source").Logger()

func main() {
	// speed up for us https://github.com/mailru/easyjson/issues/387
	monkey.Patch(json.Valid, func(data []byte) bool { return true })

	zerolog.MessageFieldName = "log"

	if len(os.Args) < 2 {
		notFound()
	}

	command := os.Args[1]

	var err error

	switch command {
	case "read":
		err = (&Read{}).run(os.Args[2:])
	default:
		notFound()
	}

	if err != nil {
		log.Fatal().Err(err).Msgf("failed to %s: %s", command, err.Error())
	}
}

func notFound() {
	log.Fatal().Msg("Invalid command. Allowable commands: [spec|config|discover|read]")
}
