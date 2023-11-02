# Coordinator

This app takes synchronized height ranges from `stdin`, requests `node_info` from Tendermint RPC (`/status`),
and passes `merge(COORDINATOR_BASE_CONFIG, {"earliest": xxx, "latest": xxx})` to subprogram stdin.

The main idea:

```bash
./bqreader ... | ./coordinator ./extract-tendermint.sh
```

The coordinator extract blocks in this order:

 - head (latest blocks)
 - missing blocks
 - tail

Features:

 - graceful shutdown (wait the subprogram)
 - wait a checkpoint substring in the subprogram (like "Emitting completed target state {}") in the stderr

# Settings

 - `COORDINATOR_BATCH_SIZE` sets the maximum number of blocks in one task.
    The program can stop only after the task is completed. Longer task - longer graceful shutdown time.

 - `COORDINATOR_OUTPUT_LIMIT` sets the maximum number of tasks before next status check.

 - `COORDINATOR_EXPECTED_NETWORK` compare a `.node_info.network` from `/status` with
   value and panic if the values not equal. Helps avoid mistakes in the
   `COORDINATOR_TENDERMINT_URL` and vipe cases (restart the network from zero). Uses the value
   from the first request if not specified (will crash if `.network` changes).

 - `COORDINATOR_COMMIT_MSG` the program waits this commit signal and
   kill the subprocess if needed in 30 seconds. Helps avoid `target-bigquery` freezes.

 - merge(`COORDINATOR_BASE_CONFIG`, { earliest: <int64>, latest: <int64> }) pushes to the subprocess stdin.

 - `COORDINATOR_ADDR` the program starts a server with `/metrics` and a
   monitoring page.

# Monitoring Page

Run with `COORDINATOR_ADDR=:3333`:

![screenshot](../docs/coordinatormonitoring.png)

# Testing

```bash
export COORDINATOR_TENDERMINT_URL=https://cosmos-rpc.polkachu.com
export COORDINATOR_BASE_CONFIG='{"some":1}'

echo '{"earliest":11041099,"latest":11041099}' | go run . | bash -c 'while read line; do echo "input: $line"; sleep 1; done'
```
