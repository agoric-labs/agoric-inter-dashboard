```
gcloud compute addresses create --global agoric-dashboard --project=agoric-prod

kubectl create configmap cube-agoric-schema --from-file=cube/schema/
kubectl create configmap cube-agoric-helpers --from-file=cube/utils.js

helm repo add gadsme https://gadsme.github.io/charts
helm repo update

helm install cube gadsme/cube
```
