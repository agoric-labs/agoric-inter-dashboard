# Simple Normalizer

Output format: https://hub.meltano.com/singer/spec/

## Typical Usage

```
tendermint-source | tendermint-normalizer | target-bigquery --config bigquery.json
```

bigquery.json:

```json
{
  "project": "xxx",
  "method": "storage_write_api",
  "denormalized": true,
  "credentials_path": "../bigquerycreds.json",
  "schema_resolver_version": 2,
  "dataset": "xxx",
  "cluster_on_key_properties": false,
  "location": "US",
  "batch_size": 100
}
```

https://github.com/z3z1ma/target-bigquery

## Development

```
# extract source
../bin/tendermint-source read \
  --format squash \
  --config ../tendermint-source/secrets/config.json \
  --catalog ../tendermint.catalog.json > data.json

# normalize
cat data.json | python3 main.py > res.json

# check schemas
cat res.json | python3 ../schema-checker/main.py
```

## Check Intigrity

```sql
select avg(events.count / b.event_count) as status_events
     , avg(msgs.count / b.message_count) as status_msgs
     , avg(txs.count / b.transaction_count) as status_txs
     , count(block_height) / count(distinct block_height) as status_blocks
     , count(block_height) as total_count
from cosmoshub_v18.blocks` b
left join (
  select block_height, count(block_height) count
    from cosmoshub_v18.events
   group by 1
) events using (block_height)
left join (
  select block_height, count(block_height) count
    from cosmoshub_v18.messages
   group by 1
) msgs using (block_height)
left join (
  select block_height, count(block_height) count
    from cosmoshub_v18.transactions
   group by 1
) txs using (block_height)
```

## Schema

This normalizer must covert `tendermint-source --format squash` data to
the given tables:

```sql
create table blocks (
  height int64 not null, -- primary key
  time timestamp not null, -- for the time partitioning by days
  event_count int not null, -- counter for stats and checks
  tx_count int not null,
  msg_count int not null,
  validator_count int not null,
  block_body json not null, -- json from the /block endpoint
  block_results_body json not null
);

create table transactions (
  id string not null, -- primary key: combination of block_height and idx
  block_height int64 not null,
  idx int64 not null, -- index within block.data.txs
  code int not null, -- the code from the /block_results endpoint (txs_results[tx_idx].code), 0 if success
  gas_used decimal not null,
  gas_wanted decimal not null,
  hash string not null,
  raw_body string, -- contains binary data if decoding failed
  decoded_body json -- decoded payload excluding messages
);

create table messages (
  id string not null, -- primary key: combination of tx id and idx
  block_height int64 not null, -- reference to the blocks table
  tx_id string not null, -- reference to the txs table
  idx int64 not null, -- index within the tx messages array
  type string not null, -- @type from body
  body json not null
);

create table validators (
  id string not null, -- primary key: combination of block_height and hex_addr
  block_height int64 not null,
  valoper_addr string, -- extract from events: https://github.com/p2p-org/p2p-cosmos-research/blob/master/active_validators_by_rewards
  pubkey_hex string not null,
  voting_power int64 not null,
  proposer_priority int64 not null,
  rewards decimal, -- prev block rewards
  commission decimal,
  proposer_reward decimal
);

create table events (
  id string not null, -- primary key: combination of block_height, phase_type, and idx
  block_height int64 not null,
  idx int64 not null,
  phase_type string not null,
  type string not null,
  parent_id string, -- for tx events
  attributes json not null -- decoded attributes
);
```
