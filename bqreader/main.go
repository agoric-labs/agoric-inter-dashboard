package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"cloud.google.com/go/bigquery"
	"github.com/rs/zerolog"
	"google.golang.org/api/iterator"
)

var log = zerolog.New(os.Stderr).With().Str("type", "LOG").Str("component", "bqreader").Logger()

func main() {
	if len(os.Args) < 2 {
		log.Fatal().Msg("call ./bqreader [query]")
	}

	projectID := os.Getenv("PROJECT_ID")
	if projectID == "" {
		log.Fatal().Msg("PROJECT_ID not set")
	}

	// empty by default, output: plain json
	// put a name, output: json schema + record (https://hub.meltano.com/singer/spec/)
	streamName := os.Getenv("SINGER_STREAM_NAME")

	log.Info().
		Str("PROJECT_ID", projectID).
		Str("SINGER_STREAM_NAME", streamName).
		Str("QUERY", os.Args[1]).
		Msg("init")

	err := process(projectID, os.Args[1], streamName)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to process")
	}
}

func process(projectID, sql, streamName string) error {
	ctx := context.Background()

	client, err := bigquery.NewClient(ctx, projectID)
	if err != nil {
		return fmt.Errorf("failed to NewClient: %w", err)
	}
	defer client.Close()

	q := client.Query(sql)

	log.Info().Msg("exec the query")

	it, err := q.Read(ctx)
	if err != nil {
		return fmt.Errorf("failed to Read: %w", err)
	}

	encoder := json.NewEncoder(os.Stdout)

	log.Info().Msg("start reading")

	for writeCount := 0; ; writeCount++ {
		var values []bigquery.Value
		err := it.Next(&values)
		if err == iterator.Done {
			break
		}
		if err != nil {
			return fmt.Errorf("failed to get Next: %w", err)
		}

		// Create a map to associate column names to their respective values
		rowMap := make(map[string]bigquery.Value)
		for i, v := range values {
			rowMap[it.Schema[i].Name] = v
		}

		if streamName != "" {
			if writeCount == 0 {
				err := writeSchema(streamName, it.Schema, encoder)
				if err != nil {
					return fmt.Errorf("failed to write a schema: %w", err)
				}
			}

			rec := map[string]interface{}{
				"type":   "RECORD",
				"stream": streamName,
				"record": rowMap,
			}

			err = encoder.Encode(rec)
			if err != nil {
				return fmt.Errorf("failed to encode: %w", err)
			}
		} else {
			err = encoder.Encode(rowMap)
			if err != nil {
				return fmt.Errorf("failed to encode: %w", err)
			}
		}
	}

	return nil
}

type errUnexpectedBigqueryType struct {
	fieldType bigquery.FieldType
}

func (e errUnexpectedBigqueryType) Error() string {
	return fmt.Sprintf("unxpected bigquery type: %s", e.fieldType)
}

func writeSchema(streamName string, schema bigquery.Schema, encoder *json.Encoder) error {
	properties := map[string]interface{}{}
	required := []string{}

	for _, field := range schema {
		required = append(required, field.Name)
		fieldType := string(field.Type)
		format := ""

		switch field.Type {
		case "STRING":
			fieldType = "string"
		case "INTEGER":
			fieldType = "number"
			format = "integer"
		case "FLOAT":
			fieldType = "number"
			format = "float"
		case "JSON":
			fieldType = "object"
		default:
			return errUnexpectedBigqueryType{field.Type}
		}

		prop := map[string]interface{}{"type": fieldType}

		if field.Required {
			prop["type"] = fieldType
		} else {
			prop["type"] = []string{fieldType, "null"}
		}

		if format != "" {
			prop["format"] = format
		}

		properties[field.Name] = prop
	}

	rec := map[string]interface{}{
		"type":   "SCHEMA",
		"stream": streamName,
		"schema": map[string]interface{}{
			"type":                 "object",
			"additionalProperties": false,
			"required":             required,
			"properties":           properties,
		},
	}

	err := encoder.Encode(rec)
	if err != nil {
		return fmt.Errorf("failed to encode: %w", err)
	}

	return nil
}
