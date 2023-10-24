#!/bin/bash

set -e

if [[ -z "$DATASET_ID" ]]; then
  echo "DATASET_ID not set"
  exit 1
fi

if [[ -z "$PROJECT_ID" ]]; then
  echo "PROJECT_ID not set"
  exit 1
fi

if [[ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
  echo "GOOGLE_APPLICATION_CREDENTIALS not set"
  exit 1
fi

BQ_CONFIG=$(mktemp -q)

cat > $BQ_CONFIG << EOL
  {
    "project": "$PROJECT_ID",
    "dataset": "$DATASET_ID",
    "method": "storage_write_api",
    "denormalized": true,
    "credentials_path": "$GOOGLE_APPLICATION_CREDENTIALS",
    "cluster_on_key_properties": true,
    "schema_resolver_version": 2,
    "location": "US",
    "batch_size": 200,
    "options": {
      "storage_write_batch_mode": true
    }
  }
EOL

cat | \
  tendermint-source read --catalog ./tendermint.catalog.json --format squash | \
  tendermint-normalizer | \
  target-bigquery --config $BQ_CONFIG

# avoid "No space left on device" errors
rm $BQ_CONFIG

exit $?
