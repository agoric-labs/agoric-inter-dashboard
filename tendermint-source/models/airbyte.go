package models

import (
	"github.com/mailru/easyjson"
)

// AirbyteRecord the record message contains the actual data that is being replicated.
//
//easyjson:json
type AirbyteRecord struct {
	Stream    string `json:"stream"`
	EmittedAt string `json:"emitted_at"`

	Data easyjson.RawMessage `json:"data"`
}

// AirbyteMessage the output of each method in the actor interface is wrapped in an AirbyteMessage.
//
//easyjson:json
type AirbyteMessage struct {
	Type   string         `json:"type"`
	Record *AirbyteRecord `json:"record"`
}
