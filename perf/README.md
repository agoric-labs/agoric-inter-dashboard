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
Requests      [total, rate, throughput]         4564, 76.05, 75.24
Duration      [total, attack, wait]             1m0s, 1m0s, 416.529ms
Latencies     [min, mean, 50, 90, 95, 99, max]  9.86ms, 660.113ms, 665.943ms, 931.831ms, 1.036s, 1.544s, 1.962s
Bytes In      [total, mean]                     91139569, 19969.23
Bytes Out     [total, mean]                     2069300, 453.40
Success       [ratio]                           99.63%
Status Codes  [code:count]                      200:4547  502:17
Error Set:
502 Bad Gateway
```

76.05 rps -> 4563.0 rpm
