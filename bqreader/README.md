# BQ Reader

Is a lightweight solution for those experiencing performance issues with bq query, especially on large-scale queries.
It takes in a query as the first argument and outputs the rows in the jsonlines format to stdout.

```
PROJECT_ID=xxx go run . 'select 1 union all select 2 union all select 3'
```

Write as singer output:
```
SINGER_STREAM_NAME=slo_metrics PROJECT_ID=xxx test.sh | target-bigquery --config config.json
```
