package models

import "github.com/mailru/easyjson"

// SquashGroupData a map for easyjson
//
//easyjson:json
type SquashGroupData map[string][]easyjson.RawMessage

// SquashGroup SquashGroupData + height for easyjson
//
//easyjson:json
type SquashGroup struct {
	Height   string          `json:"height"`
	Entities SquashGroupData `json:"entities"`
}
