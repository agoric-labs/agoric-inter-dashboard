#!/bin/bash

set -e

if [[ -z "$RPC_URL" ]]; then
  echo "DATASET_ID not set"
  exit 1
fi

cat > /tmp/bigquery_config.json << EOL
  {
    "project": "$PROJECT_ID",
    "dataset": "$DATASET_ID",
    "method": "streaming_insert",
    "denormalized": true,
    "credentials_path": "$GOOGLE_APPLICATION_CREDENTIALS",
    "cluster_on_key_properties": true,
    "schema_resolver_version": 2,
    "location": "US",
    "batch_size": 250
  }
EOL

echo "Extra Addresses: $EXTRA_ADDRESSES"

export AGD_HOME=/tmp/agoric
export ESCROW_CMD="agd query ibc-transfer escrow-address \(.port_id) \(.channel_id) --node $RPC_URL --home $AGD_HOME"
export EXTRACT_BIN="${EXTRACT_BIN:-balances-extractor}"

# extract ibc channel balances
agd query ibc channel channels --node $RPC_URL --output json --home $AGD_HOME | \
  jq -r ".channels[] | \"$ESCROW_CMD\"" | \
  xargs -P4 -I{} bash -c {} | \
  jq -Rnc '{address: inputs}' | \
  $EXTRACT_BIN "$@" | \
  target-bigquery --config /tmp/bigquery_config.json

# extract extra address balances
echo "\"$EXTRA_ADDRESSES\"" | \
  jq -c '. | split(",") | map({address: . | gsub("^\\s+|\\s+$";"")}) | .[]' | \
  $EXTRACT_BIN "$@" | \
  target-bigquery --config /tmp/bigquery_config.json
