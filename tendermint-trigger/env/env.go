package env

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strconv"
	"syscall"

	"cloud.google.com/go/bigquery"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"p2p-tendermint-trigger/model"
)

// Env contains all internal deps.
type Env struct {
	logger *zerolog.Logger

	bqClient    *bigquery.Client
	bqDatasetID string

	rpcURL string

	batchSize int64

	maxWriteCount int
	writeCount    int

	baseConfig map[string]interface{}

	subcommand   []string
	cmd          *exec.Cmd
	configWriter io.WriteCloser
	ctx          context.Context
}

// New is a constructor for Env.
func New(ctx context.Context, subcommand []string) (*Env, error) {
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
		maxWriteCount = "10"
	}

	env := Env{
		logger:      &log,
		bqClient:    bqClient,
		bqDatasetID: datasetID,
		subcommand:  subcommand,

		rpcURL: rpcURL,
		ctx:    ctx,

		configWriter: os.Stdout,
	}

	if len(subcommand) > 0 {
		err := env.runSubcommand(subcommand)
		if err != nil {
			return nil, fmt.Errorf("failed to runSubcommand: %w", err)
		}
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
func (e *Env) WriteConfig(rg model.HeightRange) error {
	// TODO: extract to params or replace by maxWriteCount
	if e.writeCount > 2 {
		err := e.Close()
		if err != nil {
			return fmt.Errorf("failed to close the restarted cmd: %w", err)
		}

		err = e.runSubcommand(e.subcommand)
		if err != nil {
			return fmt.Errorf("failed to restart the cmd: %w", err)
		}

		e.writeCount = 0
	}

	e.baseConfig["earliest_height"] = strconv.FormatInt(rg.Earliest, 10)
	e.baseConfig["latest_height"] = strconv.FormatInt(rg.Latest, 10)

	log.Info().Fields(e.baseConfig).Msg("write config")

	err := json.NewEncoder(e.configWriter).Encode(e.baseConfig)
	if err != nil {
		return fmt.Errorf("failed to write a new config: %w", err)
	}

	e.writeCount++

	return nil
}

// Close free all resources
func (e *Env) Close() error {
	if e.cmd != nil {
		// err := e.configWriter.Close()
		// if err != nil {
		// 	e.logger.Warn().Err(err).Msg("failed to close configWriter")
		// }

		e.logger.Info().Msg("wait the subcommand")

		err := e.cmd.Wait()
		if err != nil {
			e.logger.Fatal().Err(err).Msg("failed to wait the subcommand")
		}
	}

	return nil
}

func (e *Env) runSubcommand(subcommand []string) error {
	ctx := context.Background()

	cmd := exec.CommandContext(ctx, subcommand[0], subcommand[1:]...) //nolint:gosec
	cmd.Stdout = os.Stdout
	// Stderr uses as a log destination
	cmd.Stderr = os.Stderr
	// request the OS to assign process group to the new process,
	// to which all its children will belong
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	stdin, err := cmd.StdinPipe()
	if err != nil {
		return fmt.Errorf("failed to StdinPipe: %w", err)
	}

	err = cmd.Start()
	if err != nil {
		return fmt.Errorf("failed to run: %w %+v", err, subcommand)
	}

	e.configWriter = stdin
	e.cmd = cmd

	return nil
}
