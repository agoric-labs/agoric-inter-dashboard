# Cosmos Balance Extractor

Cosmos Balance Extractor is a tool built atop grpcurl designed to fetch balances from Cosmos. It processes the data
and outputs the results in the [Singer specification format](https://hub.meltano.com/singer/spec/) as JSON lines to stdout.

## Key Features

 - Extracts Cosmos balances using `grpcurl`.
 - Outputs data in the structured Singer spec format.
 - Enables seamless integration with Singer-compatible platforms.

## Example Usage

Call example:

```bash
# Set the address query for fetching data
export ADDRESS_QUERY="select distinct json_value(attributes, '$.receiver') as address from raw_cosmos_hub.events where event_type = 'coin_received' limit 10"

# Define the RPC URL for extracting the current block height
export RPC_URL=https://cosmos-rpc.polkachu.com

# Specify the GRPC address
export GRPC_ADDR=cosmos-grpc.polkachu.com:14990

# Execute the query and save results to BigQuery
bqreader "$ADDRESS_QUERY" |
  python main.py --plaintext | # Note: --plaintext is an additional argument for grpcurl
  target-bigquery --config config.json
```

 - target-bigquery references the tool found here.
 - The bq command returns a JSON array containing a single field named address: `[{ "address": "..." }]`.

## Call a k8s cronjob with the given height

```
kubectl create job --from=cronjob.batch/cosmoshub-mainnet-balances balances-manual-15392883 --dry-run -o "json" \
  | jq ".spec.template.spec.containers[0].env += [{ \"name\": \"BLOCK_HEIGHT\", value:\"15392883\" }]"
  | kubectl apply -f -
```
