# E2E Tests

## Test API

```
pytest cube/e2e # check http://localhost:4000 by default
API_URL=https://info.inter.trade pytest cube/e2e # check the remote api
```

## Generate Dataset

```
export PROJECT_ID=xxx
export DATASET_ID=xxx
export GOOGLE_CREDS=./agoricdevcreds.json
export BQ_CONFIG=./agoricdev.json

./cube/e2e/update_test_dataset.sh
```
