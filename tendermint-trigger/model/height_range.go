package model

// HeightRange is a struct that represents a closed range of heights.
type HeightRange struct {
	Earliest int64 `json:"earliest"`
	Latest   int64 `json:"latest"`
}
