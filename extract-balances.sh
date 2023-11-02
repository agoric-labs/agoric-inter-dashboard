#!/bin/bash

set -e

cat > /tmp/bigquery_config.json << EOL
  {
    "project": "$PROJECT_ID",
    "dataset": "$DATASET_ID",
    "method": "storage_write_api",
    "denormalized": true,
    "credentials_path": "$GOOGLE_APPLICATION_CREDENTIALS",
    "cluster_on_key_properties": true,
    "schema_resolver_version": 2,
    "location": "US",
    "batch_size": 250
  }
EOL

echo "Addresses: $ADDRESSES"

echo "\"$ADDRESSES\"" | \
  jq -c '. | split(",") | map({address: . | gsub("^\\s+|\\s+$";"")}) | .[]' | \
  balances-extractor "$@" | \
  target-bigquery --config /tmp/bigquery_config.json
