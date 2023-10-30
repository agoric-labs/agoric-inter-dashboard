import { dailySQL, datasetId, isDev } from '../utils';

cube(`balances`, {
  sql: dailySQL(
    ['amount'],
    ['address', 'denom'],
    `
     select b.block_time
          , bl.address
          , cast(bl.amount as numeric) / pow(10, 6) as amount
          , bl.denom
      from ${datasetId()}.balances bl
      join ${datasetId()}.blocks b using (block_height)
     -- where ${FILTER_PARAMS.balances.day.filter('block_time')}
  `,
  ),

  measures: {
    amount_avg: {
      sql: `amount`,
      type: `avg`,
    },
    amount_sum: {
      sql: `amount`,
      type: `sum`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(day, address, denom)`,
      type: `string`,
      primary_key: true,
    },
    address: {
      sql: `address`,
      type: `string`,
    },
    denom: {
      sql: `denom`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: isDev
    ? {}
    : {
        by_denom_year: {
          measures: [amount_sum, amount_avg],
          dimensions: [denom],
          time_dimension: day,
          granularity: `year`,
          refreshKey: {
            every: `24 hour`,
          },
        },
        by_denom_month: {
          measures: [amount_sum, amount_avg],
          dimensions: [denom],
          time_dimension: day,
          granularity: `month`,
          refreshKey: {
            every: `24 hour`,
          },
        },
        by_denom_week: {
          measures: [amount_sum, amount_avg],
          dimensions: [denom],
          time_dimension: day,
          granularity: `week`,
          refreshKey: {
            every: `24 hour`,
          },
        },
        by_denom_day: {
          measures: [amount_sum, amount_avg],
          dimensions: [denom],
          time_dimension: day,
          granularity: `day`,
          partition_granularity: `day`,
          refresh_key: {
            every: `10 minutes`,
            incremental: true,
            update_window: `1 day`,
          },
          build_range_start: {
            sql: `select min(_sdc_batched_at) from ${datasetId()}.balances`,
          },
          build_range_end: {
            sql: `select current_timestamp()`,
          },
        },
      },
});
