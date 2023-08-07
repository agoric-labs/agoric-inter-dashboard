package env

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"syscall"
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"p2p-tendermint-trigger/model"
)

var (
	writeConfigCount = promauto.NewCounter(prometheus.CounterOpts{
		Name: "tendermint_trigger_write_config_total",
		Help: "The total number of generated configs",
	})

	writeConfigSuccessCount = promauto.NewCounter(prometheus.CounterOpts{
		Name: "tendermint_trigger_write_config_success_total",
		Help: "The total number of generated configs",
	})
)

// Env contains all internal deps.
type Env struct {
	logger *zerolog.Logger

	bqClient    *bigquery.Client
	bqDatasetID string

	rpcURL string

	batchSize int64

	maxWriteCount int

	baseConfig map[string]interface{}

	subcommand []string
	ctx        context.Context
}

// New is a constructor for Env.
func New(ctx context.Context, subcommand []string) (*Env, error) { //nolint:funlen,cyclop
	log := zerolog.New(os.Stderr).With().
		Str("type", "LOG").
		Str("component", "tendermint-trigger").
		Logger()

	projectID := os.Getenv("TENDERMINT_TRIGGER_PROJECT_ID")
	if projectID == "" {
		log.Fatal().Msg("TENDERMINT_TRIGGER_PROJECT_ID not set")
	}

	datasetID := os.Getenv("TENDERMINT_TRIGGER_DATASET_ID")
	if datasetID == "" {
		log.Fatal().Msg("TENDERMINT_TRIGGER_DATASET_ID not set")
	}

	bqClient, err := bigquery.NewClient(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to NewClient: %w", err)
	}

	rpcURL := os.Getenv("TENDERMINT_TRIGGER_RPC_URL")
	if rpcURL == "" {
		log.Fatal().Msg("TENDERMINT_TRIGGER_RPC_URL not set")
	}

	baseConfig := os.Getenv("TENDERMINT_TRIGGER_BASE_CONFIG")
	if baseConfig == "" {
		baseConfig = "{}"
	}

	batchSize := os.Getenv("TENDERMINT_TRIGGER_BATCH_SIZE")
	if batchSize == "" {
		batchSize = "100"
	}

	maxWriteCount := os.Getenv("TENDERMINT_TRIGGER_MAX_WRITE_COUNT")
	if maxWriteCount == "" {
		maxWriteCount = "10000"
	}

	env := Env{
		logger:      &log,
		bqClient:    bqClient,
		bqDatasetID: datasetID,
		subcommand:  subcommand,

		rpcURL: rpcURL,
		ctx:    ctx,
	}

	env.maxWriteCount, err = strconv.Atoi(maxWriteCount)
	if err != nil {
		return nil, fmt.Errorf("failed to parse TENDERMINT_TRIGGER_MAX_WRITE_COUNT: %w", err)
	}

	env.batchSize, err = strconv.ParseInt(batchSize, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse TENDERMINT_TRIGGER_BATCH_SIZE: %w", err)
	}

	log.Info().
		Str("TENDERMINT_TRIGGER_PROJECT_ID", projectID).
		Str("TENDERMINT_TRIGGER_DATASET_ID", datasetID).
		Str("TENDERMINT_TRIGGER_RPC_URL", rpcURL).
		Str("TENDERMINT_TRIGGER_BASE_CONFIG", baseConfig).
		Int("TENDERMINT_TRIGGER_MAX_WRITE_COUNT", env.maxWriteCount).
		Int64("TENDERMINT_TRIGGER_BATCH_SIZE", env.batchSize).
		Strs("subcommand", subcommand).
		Msg("init env")

	err = json.Unmarshal([]byte(baseConfig), &env.baseConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to parse BASE_COFIG: %w", err)
	}

	return &env, nil
}

// GetLogger returns an app logger.
func (e *Env) GetLogger() *zerolog.Logger {
	return e.logger
}

// GetBatchSize returns a maximum of the block count.
func (e *Env) GetBatchSize() int64 {
	return e.batchSize
}

// GetMaxWriteCount returns a maximum of output count.
func (e *Env) GetMaxWriteCount() int {
	return e.maxWriteCount
}

// WriteConfig writes baseConfig + rg to stdout as json lines.
func (e *Env) WriteConfig(rang model.HeightRange) error {
	if errors.Is(e.ctx.Err(), context.Canceled) {
		return fmt.Errorf("from the common ctx: %w", e.ctx.Err())
	}

	writeConfigCount.Inc()

	e.baseConfig["earliest_height"] = strconv.FormatInt(rang.Earliest, 10)
	e.baseConfig["latest_height"] = strconv.FormatInt(rang.Latest, 10)

	log.Info().Fields(e.baseConfig).Msg("write config")

	rawConfig, err := json.Marshal(e.baseConfig)
	if err != nil {
		return fmt.Errorf("failed to write a new config: %w", err)
	}

	if len(e.subcommand) == 0 {
		_, err := os.Stdout.Write(rawConfig)
		if err != nil {
			return fmt.Errorf("failed to write next config to stdout: %w", err)
		}

		writeConfigSuccessCount.Inc()

		return nil
	}

	log.Info().Strs("cmd", e.subcommand).Msg("start the subcommand and push next config")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	cmd := exec.CommandContext(ctx, e.subcommand[0], e.subcommand[1:]...) //nolint:gosec
	cmd.Stdin = bytes.NewBuffer(append(rawConfig, '\n'))
	cmd.Stdout = os.Stdout
	// Stderr uses as a log destination
	cmd.Stderr = os.Stderr
	// request the OS to assign process group to the new process,
	// to which all its children will belong
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	err = cmd.Run()
	if err != nil {
		return fmt.Errorf("failed to run: %w %+v", err, e.subcommand)
	}

	log.Info().Msg("subcommand exited")

	writeConfigSuccessCount.Inc()

	return nil
}

// Close free all resources.
func (e *Env) Close() error {
	return nil
}
