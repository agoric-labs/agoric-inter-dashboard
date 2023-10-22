package env

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"p2p-coordinator/model"
	"strconv"
	"strings"
	"syscall"

	"github.com/rs/zerolog"
)

var log = zerolog.New(os.Stderr).With().Str("type", "LOG").Str("component", "coordinator").Logger()

// Env ...
type Env struct {
	syncedRanges []*model.HeightRange
	baseConfig   map[string]interface{}
	subcommand   []string
	commitMsg    string

	tendermintURL string
}

// New creates a new instance of Env.
func New(subcommand []string) (*Env, error) {
	syncedRanges, err := readStdinRanges()
	if err != nil {
		return nil, fmt.Errorf("failed to readStdinRanges: %w", err)
	}

	tendermintURL := os.Getenv("COORDINATOR_TENDERMINT_URL")
	if tendermintURL == "" {
		log.Fatal().Msg("COORDINATOR_TENDERMINT_URL not set")
	}

	baseConfig := os.Getenv("COORDINATOR_BASE_CONFIG")
	if baseConfig == "" {
		baseConfig = "{}"
	}

	env := Env{
		syncedRanges:  syncedRanges,
		subcommand:    subcommand,
		tendermintURL: tendermintURL,
		commitMsg:     os.Getenv("COORDINATOR_COMMIT_MSG"),
	}

	err = json.Unmarshal([]byte(baseConfig), &env.baseConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to parse BASE_COFIG: %w", err)
	}

	return &env, nil
}

// WriteConfig writes baseConfig + rg to stdout as json lines.
func (e *Env) WriteConfig(ranges []*model.HeightRange) error {
	rawConfig, err := e.generateConfigLines(ranges)
	if err != nil {
		return err
	}

	if len(e.subcommand) == 0 {
		_, err := os.Stdout.Write(rawConfig)
		if err != nil {
			return fmt.Errorf("failed to write next config to stdout: %w", err)
		}

		return nil
	}

	log.Info().Strs("cmd", e.subcommand).Msg("start the subcommand and push next config")

	cmd := exec.Command(e.subcommand[0], e.subcommand[1:]...) //nolint:gosec
	cmd.Stdin = bytes.NewBuffer(append(rawConfig, '\n'))
	cmd.Stdout = os.Stdout
	// request the OS to assign process group to the new process,
	// to which all its children will belong
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	// Stderr uses as a log destination
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return fmt.Errorf("failed to make StdoutPipe: %w", err)
	}

	err = cmd.Start()
	if err != nil {
		return fmt.Errorf("failed to run: %w %+v", err, e.subcommand)
	}

	if e.commitMsg != "" {
		log.Info().Str("msg", e.commitMsg).Msg("wait a commit msg")

		err = waitCheckpoint(stderr, cmd, e.commitMsg)
		if err != nil {
			return err
		}
	} else {
		err := cmd.Wait()
		if err != nil {
			return fmt.Errorf("failed to wait: %w", err)
		}
	}

	log.Info().Msg("subcommand exited")

	return nil
}

func (e *Env) generateConfigLines(ranges []*model.HeightRange) ([]byte, error) {
	rawConfig := []byte{}

	for _, rang := range ranges {
		e.baseConfig["earliest_height"] = strconv.FormatInt(rang.Earliest, 10)
		e.baseConfig["latest_height"] = strconv.FormatInt(rang.Latest, 10)

		log.Info().Fields(e.baseConfig).Msg("write config")

		line, err := json.Marshal(e.baseConfig)
		if err != nil {
			return nil, fmt.Errorf("failed to write a new config: %w", err)
		}

		rawConfig = append(rawConfig, line...)
		rawConfig = append(rawConfig, '\n')
	}

	return rawConfig, nil
}

func waitCheckpoint(stderr io.ReadCloser, cmd *exec.Cmd, commitMsg string) error {
	scanner := bufio.NewScanner(stderr)
	for scanner.Scan() {
		line := scanner.Text()

		_, err := os.Stderr.Write([]byte(line + "\n"))
		if err != nil {
			return fmt.Errorf("failed to write to stderr: %w", err)
		}

		if strings.Contains(line, commitMsg) {
			log.Info().Msg("checkpoint substring detected")

			err := cmd.Process.Kill()
			if err != nil {
				return fmt.Errorf("failed to kill: %w", err)
			}

			break
		}
	}

	err := scanner.Err()
	if err != nil {
		return fmt.Errorf("failed to scan: %w", err)
	}

	return nil
}

// GetSyncedRanges ...
func (e *Env) GetSyncedRanges() ([]*model.HeightRange, error) {
	return e.syncedRanges, nil
}

func readStdinRanges() ([]*model.HeightRange, error) {
	syncedRanges := []*model.HeightRange{}
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		line := scanner.Text()

		var lineRange model.HeightRange

		err := json.Unmarshal([]byte(line), &lineRange)
		if err != nil {
			return nil, fmt.Errorf("failed to decode json: %w", err)
		}

		syncedRanges = append(syncedRanges, &lineRange)
	}

	err := scanner.Err()
	if err != nil {
		return nil, fmt.Errorf("failed to read from stdin: %w", err)
	}

	return syncedRanges, nil
}
