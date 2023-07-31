package models

import (
	"github.com/mailru/easyjson"
)

// JSONRPCRequest a Request object.
type JSONRPCRequest struct {
	Version string `json:"jsonrpc"`
	ID      string `json:"id"`

	Method string   `json:"method"`
	Params []string `json:"params"`
}

// JSONRPCResponse a Response object.
//
//easyjson:json
type JSONRPCResponse struct {
	JSONRPC string `json:"jsonrpc,intern"`
	ID      string `json:"id,intern"`

	Result easyjson.RawMessage `json:"result,omitempty,nocopy"`
	Error  easyjson.RawMessage `json:"error,omitempty,nocopy"`
}

// JSONRPCBatchResponse a slice of JSONRPCResponse for easyjson.
//
//easyjson:json
type JSONRPCBatchResponse []*JSONRPCResponse
