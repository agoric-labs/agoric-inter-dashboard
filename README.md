```
yarn
yarn husky add .husky/pre-commit "yarn lint-staged"
yarn dev
```

## Last values

Needs of the last two days should be ordered by day, and the `data[0]` should be used to display the most recent value.
This approach helps avoid issues that occur after 00:00 and before the pre-aggregation is rebuilt."

```
  const res = useCubeQuery({
    measures: ['reserve_allocations.amount_usd_sum'],
    timeDimensions: [
      {
        dimension: 'reserve_allocations.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now', // important!
      },
    ],
    order: {
      'reserve_allocations.day': 'desc', // important!
    },
  });
```
