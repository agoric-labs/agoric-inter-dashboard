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

# Monitoring Page

Run with `COORDINATOR_ADDR=:3333`:

![screenshot](../docs/coordinatormonitoring.png)

# Testing

```bash
export COORDINATOR_TENDERMINT_URL=https://cosmos-rpc.polkachu.com
export COORDINATOR_BASE_CONFIG='{"some":1}'

echo '{"earliest":11041099,"latest":11041099}' | go run . | bash -c 'while read line; do echo "input: $line"; sleep 1; done'
```
