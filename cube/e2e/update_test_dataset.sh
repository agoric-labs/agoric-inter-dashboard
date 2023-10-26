#!/bin/sh

export BQ_CONFIG=${BQ_CONFIG:-agoricbqtest.json}
export DEV_IMAGE_NAME=${DEV_IMAGE_NAME:-agoric-extractor}

if [[ -z "$DATASET_ID" ]]; then
  echo "DATASET_ID not set"
  exit 1
fi

if [[ -z "$PROJECT_ID" ]]; then
  echo "PROJECT_ID not set"
  exit 1
fi

if [[ -z "$GOOGLE_CREDS" ]]; then
  echo "GOOGLE_CREDS not set"
  exit 1
fi

bq rm -r -d $PROJECT_ID:$DATASET_ID
bq mk --dataset --default_table_expiration=86400 $PROJECT_ID:$DATASET_ID

cat > $BQ_CONFIG << EOL
  {
    "project": "$PROJECT_ID",
    "dataset": "$DATASET_ID",
    "method": "storage_write_api",
    "denormalized": true,
    "credentials_path": "/tmp/$GOOGLE_CREDS",
    "cluster_on_key_properties": true,
    "schema_resolver_version": 2,
    "location": "US",
    "batch_size": 100,
    "options": {
      "storage_write_batch_mode": true
    }
  }
EOL

# build the target-bigquery with patches
docker build -t $DEV_IMAGE_NAME .

SCHEMA_FILTER='(blocks|balances|state_changes)'

# generate and write schemas + data
(ONLY_SCHEMA=1 python tendermint-normalizer/main.py | grep -E $SCHEMA_FILTER && python cube/e2e/generate_dataset.py) | \
  docker run --rm -i \
    -v `pwd`/$BQ_CONFIG:/tmp/config.json \
    -v `pwd`/$GOOGLE_CREDS:/tmp/$GOOGLE_CREDS \
    $DEV_IMAGE_NAME target-bigquery --config /tmp/config.json
