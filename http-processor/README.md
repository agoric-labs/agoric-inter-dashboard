Env settings:

```
TOKEN=xxx
ADDR=:3344
```

Echo:

```
go run . cat
```

Usage:

```
curl -d '{"test":1}' http://localhost:3344 # -> {"test":1}
```

## Proxy Airbyte Source

```bash
STDIN_ARG=--config go run . \
  docker run --rm \
  -v `pwd`/../../p2p-source-cosmos-balances/integration_tests/configured_catalog.json:/catalog.json \
  -v /tmp:/tmp \
  alexes/source-cosmos-validator-delegations:v40 \
  read --catalog /catalog.json
```

Run in an another terminal:

```bash
curl -d '{"grpc_address":"cosmos-grpc.polkachu.com:14990","extra_args":["-plaintext"],"rpc_url":"https://rpc-cosmoshub.blockapsis.com","addresses":["cosmos14lultfckehtszvzw4ehu0apvsr77afvyhgqhwh"]}' http://localhost:3344 | jq
```
