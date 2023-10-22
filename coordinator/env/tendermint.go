package env

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"p2p-coordinator/model"
	"strconv"
)

// GetTendermintRange get an available height range from the /status endpoint.
func (e *Env) GetTendermintRange(ctx context.Context) (*model.HeightRange, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, e.tendermintURL+"/status", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to Get: %w", err)
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
		return nil, fmt.Errorf("failed to decode the resp: %w", err)
	}

	earlier, err := strconv.ParseInt(data.Result.SyncInfo.EarliestBlockHeight, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse earliest_block_height: %w", err)
	}

	latest, err := strconv.ParseInt(data.Result.SyncInfo.LatestBlockHeight, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse latest_block_height: %w", err)
	}

	res := model.HeightRange{Earliest: earlier, Latest: latest}

	return &res, nil
}
