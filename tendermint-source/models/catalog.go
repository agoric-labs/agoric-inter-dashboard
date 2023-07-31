package models

import "encoding/json"

// ConfiguredCatalogStreamStream a stream settings.
type ConfiguredCatalogStreamStream struct {
	Name                string          `json:"name"`
	JSONSchema          json.RawMessage `json:"json_schema"`
	SupportedSyncModes  []string        `json:"supported_sync_modes"`
	SourceDefinedCursor bool            `json:"source_defined_cursor"`
	DefaultCursorField  []string        `json:"default_cursor_field"`
	PrimaryKey          []string        `json:"primary_key"`
}

// ConfiguredCatalogStream a stream settings.
type ConfiguredCatalogStream struct {
	SyncMode            string `json:"sync_mode"`
	DestinationSyncMode string `json:"destination_sync_mode"`

	Stream *ConfiguredCatalogStreamStream
}

// ConfiguredCatalog settings for all streams.
type ConfiguredCatalog struct {
	Streams []*ConfiguredCatalogStream `json:"streams"`
}
