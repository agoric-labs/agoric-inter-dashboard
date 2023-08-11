## Check integrity

```sql
with mm as (
   select min(block_height) mn, max(block_height) mx
     from `xxx.raw_cosmos_hub.blocks`
)
select avg(events.count / b.event_count) as status_events
     , avg(msgs.count / b.message_count) as status_msgs
     , avg(txs.count / b.transaction_count) as status_txs
     , count(block_height) / count(distinct block_height) as status_blocks
     , count(block_height) / (max(block_height) - min(block_height)) as status_missing_total
     , sum(events.count) event_count
     , sum(msgs.count) msg_count
     , sum(txs.count) tx_count
     , count(block_height) as total_count
     , (max(block_height) - min(block_height)) as expected_total
     , (max(block_time) - min(block_time)) / count(block_height) avg_build_block_time
     , (max(_sdc_batched_at) - min(_sdc_batched_at)) / count(block_height) avg_extract_block_time
     , max(block_height) as last_block_height
     , max(block_height - prev_block_height) as max_hole
from (
  select block_height
       , block_time
       , event_count
       , message_count
       , transaction_count
       , _sdc_batched_at
       , lag(block_height) over (order by block_height) as prev_block_height
    from `xxx.raw_cosmos_hub.blocks`
    where block_height between (select mn from mm) + 500 and (select mx from mm) - 500
) b
left join (
  select block_height, count(block_height) count
    from `xxx.raw_cosmos_hub.events`
   group by 1
) events using (block_height)
left join (
  select block_height, count(block_height) count
    from `xxx.raw_cosmos_hub.messages`
   group by 1
) msgs using (block_height)
left join (
  select block_height, count(block_height) count
    from `xxx.raw_cosmos_hub.transactions`
   group by 1
) txs using (block_height)
```

## Fill missing blocks

```
kubectl port-forward agoric-mainnet-tendermint-head-5f876fb589-cvt5c 3333:3333
```

```
with mm as (
   select min(block_height) mn, max(block_height) mx
     from `xxx.raw_cosmos_hub.blocks`
)
select array_to_string(array_agg('curl -d \'' || to_json_string(to_json(struct(earliest, latest))) || '\' http://localhost:3333'), '\n'), count(earliest)
  from (
    select next as earliest
         , least(next + 99, block_height - 1) as latest
     from (
      select block_height
           , lag(block_height) over (order by block_height) as prev_block_height
        from `xxx.raw_cosmos_hub.blocks`
       where block_height between (select mn from mm) + 500 and (select mx from mm) - 500
     )
     cross join unnest(generate_array(prev_block_height + 1, block_height - 1, 100)) next
     where block_height - prev_block_height > 1
     order by 1
  )
```
