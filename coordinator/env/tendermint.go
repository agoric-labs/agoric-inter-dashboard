package env

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"p2p-coordinator/model"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	tendermintRetryCount = promauto.NewCounter(prometheus.CounterOpts{
		Name: "coordinator_tendermint_retry_count_total",
		Help: "The total count of status retries",
	})
)

// UnexpectedStatusNetworkError ...
type UnexpectedStatusNetworkError struct {
	Value string
}

func (e *UnexpectedStatusNetworkError) Error() string {
	return fmt.Sprintf("unexpected status network: %s", e.Value)
}

// UnexpectedStatusCodeError ...
type UnexpectedStatusCodeError struct {
	Code int
}

func (e *UnexpectedStatusCodeError) Error() string {
	return fmt.Sprintf("unexpected tendermint status code: %d", e.Code)
}

func doRequest(req *http.Request) (resp *http.Response, err error) {
	for i := 0; i < 3; i++ {
		resp, err = http.DefaultClient.Do(req)
		if err == nil && resp.StatusCode < 500 {
			break
		}

		delay := time.Second * 5 * time.Duration(i+1)

		log.Info().Dur("delay", delay).Str("url", req.URL.String()).Msg("retry")

		tendermintRetryCount.Inc()

		time.Sleep(delay)
	}

	return
}

// GetTendermintRange get an available height range from the /status endpoint.
func (e *Env) GetTendermintRange(ctx context.Context) (*model.HeightRange, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, e.tendermintURL+"/status", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := doRequest(req)
	if err != nil {
		return nil, fmt.Errorf("failed to Get: %w", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, &UnexpectedStatusCodeError{resp.StatusCode}
	}

	var data struct {
		Result struct {
			NodeInfo struct {
				Network string `json:"network"`
			} `json:"node_info"`
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

	if e.expectedNetwork == "" {
		e.expectedNetwork = data.Result.NodeInfo.Network
		log.Info().Str("COORDINATOR_EXPECTED_NETWORK", e.expectedNetwork).Msg("set a default value")
	}

	if e.expectedNetwork != data.Result.NodeInfo.Network {
		return nil, &UnexpectedStatusNetworkError{data.Result.NodeInfo.Network}
	}

	earlier, err := strconv.ParseInt(data.Result.SyncInfo.EarliestBlockHeight, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse earliest_block_height: %w", err)
	}

	latest, err := strconv.ParseInt(data.Result.SyncInfo.LatestBlockHeight, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse latest_block_height: %w", err)
	}

	// avoid "could not find results for height #x" errors for fresh blocks
	res := model.HeightRange{Earliest: earlier, Latest: latest - 1}

	return &res, nil
}
