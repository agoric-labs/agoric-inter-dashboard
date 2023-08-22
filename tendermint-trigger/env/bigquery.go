package env

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"p2p-tendermint-trigger/model"
	"strings"

	"cloud.google.com/go/bigquery"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/googleapi"
	"google.golang.org/api/iterator"
)

// GetBlockCountByHeightRange returns count(block_height) between Earliest and Latest heights.
func (e *Env) GetBlockCountByHeightRange(ctx context.Context, rang model.HeightRange) (int64, error) {
	sql := fmt.Sprintf(`
		select count(block_height) val
		  from %s.blocks
		 where block_height between @earliest and @latest
	`, e.bqDatasetID)

	query := e.bqClient.Query(sql)
	query.Parameters = []bigquery.QueryParameter{
		{
			Name:  "earliest",
			Value: rang.Earliest,
		},
		{
			Name:  "latest",
			Value: rang.Latest,
		},
	}

	iter, err := query.Read(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed to read the query: %w", err)
	}

	var values struct {
		Val bigquery.NullInt64
	}

	err = iter.Next(&values)
	if errors.Is(err, iterator.Done) {
		return 0, nil
	}

	if err != nil {
		return 0, fmt.Errorf("failed to get a first row: %w", err)
	}

	if values.Val.Valid {
		return values.Val.Int64, nil
	}

	return 0, nil
}

// TODO: in this case, it makes sense, but maybe I can replace *int64 with some struct
//
//nolint:nilnil
func (e *Env) getDBHeight(ctx context.Context, operation string) (*int64, error) {
	log.Info().Str("operation", operation).Msg("get the db height")

	sql := fmt.Sprintf(`select %s(block_height) val from %s.blocks`, operation, e.bqDatasetID)
	query := e.bqClient.Query(sql)

	iter, err := query.Read(ctx)
	if err != nil {
		// I'm not sure if this is correct but i don't want to use table validation logic on every request
		if strings.Contains(err.Error(), "blocks was not found in location") {
			return nil, nil
		}

		return nil, fmt.Errorf("failed to read the query: %w", err)
	}

	var values struct {
		Val bigquery.NullInt64
	}

	err = iter.Next(&values)
	if errors.Is(err, iterator.Done) {
		return nil, nil
	}

	if err != nil {
		return nil, fmt.Errorf("failed to get a first row: %w", err)
	}

	if values.Val.Valid {
		return &values.Val.Int64, nil
	}

	return nil, nil
}

// GetEarliestDBHeight extracts min(height) from blocks.
func (e *Env) GetEarliestDBHeight(ctx context.Context) (*int64, error) {
	return e.getDBHeight(ctx, "min")
}

// GetLatestDBHeight extracts max(height) from blocks.
func (e *Env) GetLatestDBHeight(ctx context.Context) (*int64, error) {
	return e.getDBHeight(ctx, "max")
}

// GetBlockTableExists checks whether the blocks table exists in given dataset.
func (e *Env) GetBlockTableExists(ctx context.Context) (bool, error) {
	tableRef := e.bqClient.Dataset(e.bqDatasetID).Table("blocks")

	_, err := tableRef.Metadata(ctx)
	if err != nil {
		var gErr *googleapi.Error
		if errors.As(err, &gErr) {
			if gErr.Code == http.StatusNotFound {
				return false, nil
			}
		}

		return false, fmt.Errorf("failed to get metadata: %w", err)
	}

	return true, nil
}
