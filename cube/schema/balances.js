import { dailySQL, datasetId } from '../utils';

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

  pre_aggregations: {
    by_denom_and_address_year: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom, address],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    by_denom_and_address_month: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom, address],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    by_denom_and_address_week: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom, address],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    by_denom_and_address_day: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom, address],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `month`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
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
