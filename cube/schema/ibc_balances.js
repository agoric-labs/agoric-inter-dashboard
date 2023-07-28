import { dailySQL } from '../utils';

cube(`ibc_balances`, {
  sql: dailySQL(['amount'], ['address'], `
     select cast(height as numeric) height
          , address
          , cast(amount as numeric) / pow(10, 6) as amount
      from agoric_mainnet_own.balances
     where denom = 'uist'
  `, block_times.sql()),

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
      sql: `concat(day, address)`,
      type: `string`,
      primary_key: true,
    },
    address: {
      sql: `address`,
      type: `string`
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [amount_sum],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
