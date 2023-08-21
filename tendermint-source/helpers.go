package main

import (
	"encoding/json"
	"fmt"
	"os"
	"p2p-tendermint-source/models"
)

func readConfig(path string) (*models.Config, error) {
	var err error

	configFile, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open: %w", err)
	}

	var res models.Config

	err = json.NewDecoder(configFile).Decode(&res)
	if err != nil {
		return nil, fmt.Errorf("failed to decode: %w", err)
	}

	return &res, nil
}

func readConfigFromBytes(value []byte) (*models.Config, error) {
	var (
		err error
		res models.Config
	)

	err = json.Unmarshal(value, &res)
	if err != nil {
		return nil, fmt.Errorf("failed to decode: %w", err)
	}

	return &res, nil
}

func readCatalog(path string) (*models.ConfiguredCatalog, error) {
	if path == "" {
		// load all by default
		return &models.ConfiguredCatalog{
			Streams: []*models.ConfiguredCatalogStream{
				&models.ConfiguredCatalogStream{Stream: &models.ConfiguredCatalogStreamStream{Name: "blocks"}},
				&models.ConfiguredCatalogStream{Stream: &models.ConfiguredCatalogStreamStream{Name: "block_results"}},
				&models.ConfiguredCatalogStream{Stream: &models.ConfiguredCatalogStreamStream{Name: "validators"}},
			},
		}, nil
	}

	configFile, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open: %w", err)
	}

	var res models.ConfiguredCatalog

	err = json.NewDecoder(configFile).Decode(&res)
	if err != nil {
		return nil, fmt.Errorf("failed to decode: %w", err)
	}

	return &res, nil
}
