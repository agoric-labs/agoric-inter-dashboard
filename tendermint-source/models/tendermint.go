package models

// ValidatorsResponse contains fields for calculate page count.
//
//easyjson:json
type ValidatorsResponse struct {
	BlockHeight string `json:"block_height"`
	Count       string `json:"count"`
	Total       string `json:"total"`
}
