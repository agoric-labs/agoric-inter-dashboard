package models

// Config of the source.
type Config struct {
	RPCURL  string `json:"rpc_url"`
	Timeout int    `json:"timeout"`

	BatchSize   int `json:"batch_size"`
	ThreadCount int `json:"thread_count"`
	RetryCount  int `json:"retry_count"`

	// EarliestHeight uint64
	EarliestHeight string `json:"earliest_height"`
	// LatestHeight uint64
	LatestHeight string `json:"latest_height"`
}
