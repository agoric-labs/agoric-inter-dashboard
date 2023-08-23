#!/bin/bash

set -e

cat > /tmp/bigquery_config.json << EOL
  {
    "project": "$PROJECT_ID",
    "dataset": "$DATASET_ID",
    "method": "storage_write_api",
    "denormalized": true,
    "credentials_path": "$GOOGLE_APPLICATION_CREDENTIALS",
    "cluster_on_key_properties": true,
    "schema_resolver_version": 2,
    "location": "US",
    "batch_size": 250
  }
EOL

STATUS=`curl $RPC_URL/status | jq -c '.result'`

QUERY=$(cat << EOM
with mm as (
   select min(block_height) mn, max(block_height) mx
     from $DATASET_ID.blocks
)
select case when block_height < (select mn from mm) + 2000 then 1
            when block_height > (select mx from mm) - 2000 then 3
            else 2 end as section
     , avg(events.count / b.event_count) as status_events
     , avg(msgs.count / b.message_count) as status_msgs
     , avg(txs.count / b.transaction_count) as status_txs
     , count(block_height) / count(distinct block_height) as status_blocks
     , count(block_height) / (max(block_height) - min(block_height)) as status_missing_total
     , sum(events.count) event_count
     , sum(msgs.count) msg_count
     , sum(txs.count) tx_count
     , count(block_height) as total_count
     , (max(block_height) - min(block_height)) as expected_total
     , extract(millisecond from (max(block_time) - min(block_time)) / count(block_height)) / 1000.0 avg_build_block_time
     , extract(millisecond from (max(_sdc_batched_at) - min(_sdc_batched_at)) / count(block_height)) / 1000.0 avg_extract_block_time
     , max(block_height) as lastest_block_height
     , max(block_height) as earlist_block_height
     , max(block_height - prev_block_height) as max_hole
     , JSON'$STATUS' as node_status
from (
  select block_height
       , block_time
       , event_count
       , message_count
       , transaction_count
       , _sdc_batched_at
       , lag(block_height) over (order by block_height) as prev_block_height
    from $DATASET_ID.blocks
    where block_height between (select mn from mm) + 600 and (select mx from mm) - 600
) b
left join (
  select block_height, count(block_height) count
    from $DATASET_ID.events
   group by 1
) events using (block_height)
left join (
  select block_height, count(block_height) count
    from $DATASET_ID.messages
   group by 1
) msgs using (block_height)
left join (
  select block_height, count(block_height) count
    from $DATASET_ID.transactions
   group by 1
) txs using (block_height)
group by 1
order by 1
EOM
)

SINGER_STREAM_NAME=tendermint_slo_metrics \
  bqreader "$QUERY" | \
  target-bigquery --config /tmp/bigquery_config.json