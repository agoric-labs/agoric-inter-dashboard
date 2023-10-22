#!/bin/bash

set -e

if [[ -z "$DATASET_ID" ]]; then
  echo "DATASET_ID not set"
  exit 1
fi

if [[ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
  echo "GOOGLE_APPLICATION_CREDENTIALS not set"
  exit 1
fi

QUERY=$(cat << EOM
  with uniq_heights as (
    select distinct block_height
      from $DATASET_ID.blocks
  ), ranked_heights as (
    select block_height
         , block_height - row_number() over (order by block_height) group_id
      from uniq_heights
  )
  select min(block_height) as earliest
       , max(block_height) as latest
    from ranked_heights
   group by group_id
   order by 1
EOM
)

# pass SIGTERM to the coordinator
# https://unix.stackexchange.com/questions/146756/forward-sigterm-to-child-in-bash
_term() {
  kill -TERM "$child" 2>/dev/null
  wait "$child"
}

trap _term SIGTERM

# the coordinator waits this line for the graceful shutdown
export COORDINATOR_COMMIT_MSG="Emitting completed target state {}"

bqreader "$QUERY" | coordinator ./extract-tendermint.sh &

child=$!
wait "$child"
