# Perfomance Testing

```bash
# copy perf files to the remote vm
gcloud compute scp --zone "us-central1-a" --recurse perf instance-1:~ --project "agoric-prod"
# jump to the remote vm
gcloud compute ssh --zone "us-central1-a" "instance-1" --project "agoric-prod"

# download vegeta
wget https://github.com/tsenart/vegeta/releases/download/v12.11.1/vegeta_12.11.1_linux_amd64.tar.gz
tar xvf vegeta_12.11.1_linux_amd64.tar.gz
chmod +x vegeta

# run
cat perf/requests.txt | ./vegeta attack -max-workers 50 -duration 60s -rate 0 | ./vegeta report
```

Last Results:

```
Requests      [total, rate, throughput]         5017, 83.60, 81.39
Duration      [total, attack, wait]             1m0s, 1m0s, 323.714ms
Latencies     [min, mean, 50, 90, 95, 99, max]  38.717µs, 599.923ms, 598.087ms, 794.47ms, 882.15ms, 1.056s, 1.345s
Bytes In      [total, mean]                     84137705, 16770.52
Bytes Out     [total, mean]                     1091806, 217.62
Success       [ratio]                           97.89%
Status Codes  [code:count]                      0:99  200:4911  502:7
Error Set:
Post "https://info.inter.trade/cubejs-api/agoric_mainnet/v1/load": dial tcp 0.0.0.0:0->[2606:4700::6812:1d87]:443: connect: network is unreachable
Post "https://info.inter.trade/cubejs-api/agoric_mainnet/v1/load": dial tcp 0.0.0.0:0->[2606:4700::6812:1c87]:443: connect: network is unreachable
502 Bad Gateway
```

83.60 rps -> 5016.0 rpm
