package env

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func (e *Env) getSyncStatus(ctx context.Context, latest bool) (int64, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, e.rpcURL+"/status", nil)
	if err != nil {
		return 0, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, fmt.Errorf("failed to Get: %w", err)
	}

	defer resp.Body.Close()

	var data struct {
		Result struct {
			SyncInfo struct {
				EarliestBlockHeight string `json:"earliest_block_height"`
				LatestBlockHeight   string `json:"latest_block_height"`
			} `json:"sync_info"`
		} `json:"result"`
	}

	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return 0, fmt.Errorf("failed to decode the resp: %w", err)
	}

	raw := data.Result.SyncInfo.EarliestBlockHeight
	if latest {
		raw = data.Result.SyncInfo.LatestBlockHeight
	}

	val, err := strconv.ParseInt(raw, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse earliest_block_height: %w", err)
	}

	return val, nil
}

// GetEarliestStatusHeight extracts .sync_info.earliest_block_height from /status
// https://docs.tendermint.com/v0.34/rpc/#/Info/status
func (e *Env) GetEarliestStatusHeight(ctx context.Context) (int64, error) {
	return e.getSyncStatus(ctx, false)
}

// GetLatestStatusHeight extracts .sync_info.latest_block_height from /status
// https://docs.tendermint.com/v0.34/rpc/#/Info/status
func (e *Env) GetLatestStatusHeight(ctx context.Context) (int64, error) {
	return e.getSyncStatus(ctx, true)
}

// WaitNextBlock listens websockets or something like that.
func (e *Env) WaitNextBlock() error {
	time.Sleep(2 * time.Second)
	return nil
}
