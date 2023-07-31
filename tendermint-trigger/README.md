# Tendermint Tail Watcher

Demo:

```bash
DATASET_ID=xxx
PROJECT_ID=xxx
GOOGLE_APPLICATION_CREDENTIALS=xxx
TENDERMINT_URL=http://...
BASE_CONFIG='{}'
  go run . head

{"earliest_height": 1, "latest_height": 10}
```

Or with a subcommand:

```
go run . head bash -c 'while read line; do echo $line; sleep 5; done; echo done'
```

Mode:

 - head (emit a latest single height if the blocks table not exists)
 - tail (throws an error if the block table not exists)

Realworld example:

```bash
export BASE_CONFIG='{"rpc_url":"https://cosmos-rpc.polkachu.com","batch_size":32,"thread_count":8}'
go run .
```

With other components:

```bash
tendermint-trigger tail | tendermint-source | simple-normalizer | target-bigquery
tendermint-trigger head | tendermint-source | simple-normalizer | target-bigquery
```
