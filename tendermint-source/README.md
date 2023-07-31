```
go get github.com/mailru/easyjson && go install github.com/mailru/easyjson/...@latest
easyjson models
```

## Find best params

```bash
#!/bin/bash

set -e

for thread_count in {8..32..8}; do
    for batch_size in {32..128..32}; do
      jq ". + {thread_count:$thread_count,batch_size:$batch_size}" data/config.json > patched_config.json

      start_time=$(date +%s)
      tendermint-source read --config patched_config.json --catalog data/catalog.json > data.jsonl
      end_time=$(date +%s)
      duration=$((end_time - start_time))

      echo "$batch_size,$thread_count,$duration"
    done
done
```

```bash
docker run -d --rm -it -v `pwd`:/app/data buildedimage \
  bash -c 'apt update && apt install -y jq && bash data/findbest > data/results.csv'
```
