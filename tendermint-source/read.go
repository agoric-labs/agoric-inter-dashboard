package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"p2p-tendermint-source/models"

	"github.com/mailru/easyjson"
)

const defaultBatchSize = 56
const defaultThreadCount = 6
const defaultRetryCount = 3

var errNothingToLoad = errors.New("nothing to load")
var newLine = []byte{'\n'}

// Read a read logic context.
type Read struct {
	config  *models.Config
	catalog *models.ConfiguredCatalog
	format  string // airbyte or squash

	earliestHeight uint64
	latestHeight   uint64

	writeMU sync.Mutex
	results models.JSONRPCBatchResponse
}

func (r *Read) run(args []string) error {
	processedLines := 0

	err := processStdin(func(line []byte) error {
		processedLines++
		return r.runConfig(args, line)
	})

	if err != nil {
		return fmt.Errorf("failed to processStdin: %w", err)
	}

	// without stdin, read --config
	if processedLines == 0 {
		return r.runConfig(args, nil)
	}

	return nil
}

func (r *Read) runConfig(args []string, config []byte) error {
	err := r.init(args, config)
	if err != nil {
		return err
	}

	err = r.sheduleJobs()
	if err != nil {
		return err
	}

	return r.writeResults()
}

func (r *Read) sheduleJobs() error {
	numJobs := r.latestHeight - r.earliestHeight + 1
	if numJobs < 1 {
		return errNothingToLoad
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log.Info().Uint64("numJobs", numJobs).Msg("starting")

	jobs := make(chan models.HeightRange, numJobs)

	var waitGroup sync.WaitGroup

	for i := 0; i < r.config.ThreadCount; i++ {
		waitGroup.Add(1)

		go func() {
			defer waitGroup.Done()
			r.pullAndReadRanges(ctx, jobs, cancel)
		}()
	}

	batchSize := uint64(r.config.BatchSize)

	for height := r.earliestHeight; height <= r.latestHeight; height += batchSize {
		to := height + batchSize - 1
		if to > r.latestHeight {
			to = r.latestHeight
		}

		jobs <- models.HeightRange{From: height, To: to}
	}

	close(jobs)

	waitGroup.Wait()

	return nil
}

func (r *Read) writeResults() error {
	var err error

	if r.format == "squash" {
		err = r.writeSquashResults()
	} else {
		err = r.writeAirbyteResults()
	}

	if err != nil {
		return err
	}

	r.results = nil // clear prev results

	return nil
}

func (r *Read) writeSquashResults() error {
	// height -> id -> rows
	groups := map[string]models.SquashGroupData{}

	// group by heights
	for _, result := range r.results {
		buf := bytes.Buffer{}
		err := json.Compact(&buf, result.Result)
		if err != nil {
			return fmt.Errorf("failed to compact: %w", err)
		}

		parts := strings.SplitN(result.ID, ":", 2)

		_, heightExists := groups[parts[1]]
		if !heightExists {
			groups[parts[1]] = models.SquashGroupData{}
		}

		groups[parts[1]][parts[0]] = append(groups[parts[1]][parts[0]], easyjson.RawMessage(buf.Bytes()))
	}

	for height, squashRow := range groups {
		row := models.SquashGroup{
			Height:   height,
			Entities: squashRow,
		}

		_, err := easyjson.MarshalToWriter(&row, os.Stdout)
		if err != nil {
			return fmt.Errorf("failed to MarshalToWriter: %w", err)
		}

		_, err = os.Stdout.Write(newLine)
		if err != nil {
			return fmt.Errorf("failed to write a new line: %w", err)
		}
	}

	return nil
}

func (r *Read) writeAirbyteResults() error {
	log.Info().Int("count", len(r.results)).Msg("start writing")

	emittedAt := time.Now().Format(time.RFC3339)

	for _, result := range r.results {
		buf := bytes.Buffer{}
		err := json.Compact(&buf, result.Result)
		if err != nil {
			return fmt.Errorf("failed to compact: %w", err)
		}

		parts := strings.SplitN(result.ID, ":", 2)

		msg := models.AirbyteMessage{
			Type: "RECORD",
			Record: &models.AirbyteRecord{
				Stream:    parts[0],
				Data:      easyjson.RawMessage(buf.Bytes()),
				EmittedAt: emittedAt,
			},
		}

		_, err = easyjson.MarshalToWriter(&msg, os.Stdout)
		if err != nil {
			return fmt.Errorf("failed to MarshalToWriter: %w", err)
		}

		_, err = os.Stdout.Write(newLine)
		if err != nil {
			return fmt.Errorf("failed to write a new line: %w", err)
		}
	}

	return nil
}

func (r *Read) pullAndReadRanges(ctx context.Context, jobs <-chan models.HeightRange, cancel context.CancelFunc) {
	for heightRange := range jobs {
		var err error

		// retries
		for i := 0; i < r.config.RetryCount; i++ {
			log.Info().
				Int("try", i).
				Uint64("from", heightRange.From).
				Uint64("to", heightRange.To).
				Msg("load the next batch")

			err = r.readRange(ctx, heightRange)
			if err != nil {
				log.Warn().Err(err).Msgf("failed to read a range: %+v %s", heightRange, err.Error())

				continue
			}

			// break after the success try
			break
		}

		// after last try
		if err != nil {
			log.Error().Int("count", r.config.RetryCount).Msg("failed after all attempts")
			cancel()

			break
		}
	}
}

func (r *Read) readRange(ctx context.Context, rg models.HeightRange) error {
	calls := r.generateCalls(rg)

	results, err := r.batchRequest(ctx, calls)
	if err != nil {
		return fmt.Errorf("failed to make a batch request: %w", err)
	}

	results, err = r.loadOtherValidators(ctx, results)
	if err != nil {
		return fmt.Errorf("failed to load other validators: %w", err)
	}

	r.writeMU.Lock()
	r.results = append(r.results, results...)
	r.writeMU.Unlock()

	return nil
}

func (r *Read) loadOtherValidators(
	ctx context.Context,
	results models.JSONRPCBatchResponse,
) (models.JSONRPCBatchResponse, error) {
	calls := []*models.JSONRPCRequest{}

	otherPages, err := r.findMissingValidatorPages(results)
	if err != nil {
		return nil, err
	}

	for height, pageCount := range otherPages {
		for p := uint64(2); p <= pageCount; p++ {
			calls = append(calls, &models.JSONRPCRequest{
				Version: "2.0",
				ID:      "validators:" + height,
				Method:  "validators",
				Params:  []string{height, strconv.FormatUint(p, 10), "100"},
			})
		}
	}

	if len(calls) > 0 {
		otherResults, err := r.batchRequest(ctx, calls)
		if err != nil {
			return nil, fmt.Errorf("failed to load other calls: %w", err)
		}

		return append(results, otherResults...), nil
	}

	return results, nil
}

func (r *Read) findMissingValidatorPages(results models.JSONRPCBatchResponse) (map[string]uint64, error) {
	otherPages := map[string]uint64{} // height -> page count

	var resp models.ValidatorsResponse

	for _, result := range results {
		if !strings.HasPrefix(result.ID, "validators") {
			continue
		}

		err := json.Unmarshal(result.Result, &resp)
		if err != nil {
			return nil, fmt.Errorf("failed to parse a validator page: %w", err)
		}

		total, err := strconv.ParseUint(resp.Total, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("failed to parse a total: %w %s", err, resp.Total)
		}

		if total > 100 {
			otherPages[resp.BlockHeight] = total/100 + 1
		}
	}

	return otherPages, nil
}

func (r *Read) batchRequest(ctx context.Context, calls []*models.JSONRPCRequest) ([]*models.JSONRPCResponse, error) {
	requestBody, err := json.Marshal(calls)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal calls: %w", err)
	}

	if r.config.Timeout > 0 {
		var cancel context.CancelFunc

		ctx, cancel = context.WithTimeout(ctx, time.Duration(r.config.Timeout)*time.Second)
		defer cancel()
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, r.config.RPCURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to build a new request: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to do the request: %w", err)
	}

	defer resp.Body.Close()

	var results models.JSONRPCBatchResponse

	if len(calls) == 1 {
		var res models.JSONRPCResponse

		err := easyjson.UnmarshalFromReader(resp.Body, &res)
		if err != nil {
			return nil, fmt.Errorf("failed to decode a single body: %w", err)
		}

		results = append(results, &res)
	} else {
		err := easyjson.UnmarshalFromReader(resp.Body, &results)
		if err != nil {
			return nil, fmt.Errorf("failed to decode a multiple body: %w", err)
		}
	}

	for _, result := range results {
		if len(result.Error) > 0 {
			//nolint:goerr113
			return nil, fmt.Errorf("the request failed: %s", string(result.Error))
		}
	}

	return results, nil
}

func (r *Read) generateCalls(rg models.HeightRange) []*models.JSONRPCRequest {
	calls := []*models.JSONRPCRequest{}

	for height := rg.From; height <= rg.To; height++ {
		heightS := strconv.FormatUint(height, 10)

		for _, stream := range r.catalog.Streams {
			switch stream.Stream.Name {
			case "blocks":
				calls = append(calls, &models.JSONRPCRequest{
					Version: "2.0",
					ID:      "blocks:" + heightS,
					Method:  "block",
					Params:  []string{heightS},
				})

			case "block_results":
				calls = append(calls, &models.JSONRPCRequest{
					Version: "2.0",
					ID:      "block_results:" + heightS,
					Method:  "block_results",
					Params:  []string{heightS},
				})

			case "validators":
				calls = append(calls, &models.JSONRPCRequest{
					Version: "2.0",
					ID:      "validators:" + heightS,
					Method:  "validators",
					Params:  []string{heightS, "1", "100"},
				})
			default:
				log.Warn().Str("stream", stream.Stream.Name).Msg("unknown stream")
			}
		}
	}

	return calls
}

func (r *Read) init(args []string, nextConfig []byte) error {
	var (
		configPath  string
		catalogPath string
		format      string
	)

	fs := flag.NewFlagSet("read", flag.ExitOnError)
	fs.StringVar(&configPath, "config", "config.json", "path to the json configuration file (@ - stdin)")
	fs.StringVar(&catalogPath, "catalog", "catalog.json", "path to the catalog used to determine which data to read")
	fs.StringVar(&format, "format", "airbyte", "airbyte or squash")

	err := fs.Parse(args)
	if err != nil {
		return fmt.Errorf("failed to parse flags: %w", err)
	}

	log.Info().
		Str("configPath", configPath).
		Str("catalogPath", catalogPath).
		Str("format", format).
		Msg("read")

	r.format = format

	if len(nextConfig) == 0 {
		r.config, err = readConfig(configPath)
		if err != nil {
			return fmt.Errorf("failed to readConfig: %w", err)
		}
	} else {
		r.config, err = readConfigFromBytes(nextConfig)
		if err != nil {
			return fmt.Errorf("failed to readConfigFromString: %w", err)
		}
	}

	if r.config.ThreadCount == 0 {
		r.config.ThreadCount = defaultThreadCount
	}

	if r.config.BatchSize == 0 {
		r.config.BatchSize = defaultBatchSize
	}

	if r.config.RetryCount == 0 {
		r.config.RetryCount = defaultRetryCount
	}

	log.Info().Interface("config", r.config).Msg("config")

	r.catalog, err = readCatalog(catalogPath)
	if err != nil {
		return fmt.Errorf("failed to readCatalog: %w", err)
	}

	r.earliestHeight, err = strconv.ParseUint(r.config.EarliestHeight, 10, 64)
	if err != nil {
		return fmt.Errorf("failed to parse the earliestHeight: %w", err)
	}

	r.latestHeight, err = strconv.ParseUint(r.config.LatestHeight, 10, 64)
	if err != nil {
		return fmt.Errorf("failed to parse the earliestHeight: %w", err)
	}

	return nil
}

func processStdin(process func([]byte) error) error {
	scanner := bufio.NewScanner(os.Stdin)

	log.Info().Msg("read stdin")

	for scanner.Scan() {
		err := process(scanner.Bytes())
		if err != nil {
			return fmt.Errorf("failed to process stdin: %w", err)
		}
	}

	err := scanner.Err()
	if err != nil {
		return fmt.Errorf("failed to scan stdin: %w", err)
	}

	return nil
}
