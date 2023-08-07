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
    "batch_size": 500,
    "options": {
      "storage_write_batch_mode": true
    }
  }
EOL

export TENDERMINT_TRIGGER_BASE_CONFIG="{\"rpc_url\":\"$TENDERMINT_TRIGGER_RPC_URL\",\"batch_size\":32,\"thread_count\":24}"

while read line; do
  echo $line | \
    tendermint-source read --catalog ./tendermint.catalog.json --format squash | \
    tendermint-normalizer | \
    target-bigquery --config /tmp/bigquery_config.json
done
