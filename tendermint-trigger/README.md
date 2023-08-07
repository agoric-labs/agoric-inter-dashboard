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

## Fix dataset holes and fill it via http requests to the trigger

```
kubectl port-forward cosmoshub-mainnet-tendermint-head-xxx 3333:3333
```

```sql
with mm as (
   select min(block_height) mn, max(block_height) mx
     from `p2p-data-platform.raw_cosmos_hub.blocks`
)
select array_to_string(array_agg('curl -d \'' || to_json_string(to_json(struct(earliest, latest))) || '\' http://localhost:3333'), '\n'), count(earliest)
  from (
select next as earliest
     , least(next + 99, block_height - 1) as latest
 from (
  select block_height
       , lag(block_height) over (order by block_height) as prev_block_height
    from `p2p-data-platform.raw_cosmos_hub.blocks`
   where block_height between (select mn from mm) and (select mx from mm)
 )
 cross join unnest(generate_array(prev_block_height + 1, block_height - 1, 100)) next
 where block_height - prev_block_height > 1
 order by 1
)
```
