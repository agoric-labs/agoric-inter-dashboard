#!/bin/bash

set -e

cat > /tmp/bigquery_config.json << EOL
  {
    "project": "$TENDERMINT_TRIGGER_PROJECT_ID",
    "dataset": "$TENDERMINT_TRIGGER_DATASET_ID",
    "method": "storage_write_api",
    "denormalized": true,
    "credentials_path": "$GOOGLE_APPLICATION_CREDENTIALS",
    "cluster_on_key_properties": true,
    "schema_resolver_version": 2,
    "location": "US",
    "batch_size": 500
  }
EOL

while read line; do
  echo $line | \
    tendermint-source read --catalog ./tendermint.catalog.json --format squash | \
    simple-normalizer | \
    target-bigquery --config /tmp/bigquery_config.json
done
