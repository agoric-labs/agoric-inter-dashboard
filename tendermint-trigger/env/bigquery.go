package env

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"cloud.google.com/go/bigquery"
	"google.golang.org/api/googleapi"
	"google.golang.org/api/iterator"
)

func (e *Env) getDBHeight(ctx context.Context, operation string) (*int64, error) {
	sql := fmt.Sprintf(`select %s(block_height) val from %s.blocks`, operation, e.bqDatasetID)
	q := e.bqClient.Query(sql)

	iter, err := q.Read(ctx)
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
