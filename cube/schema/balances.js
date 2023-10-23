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
    main_year: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_month: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_week: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_day2: {
      measures: [amount_sum, amount_avg],
      dimensions: [denom],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
