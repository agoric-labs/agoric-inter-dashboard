import { dailySQL } from '../utils';

cube(`reserve`, {
  sql: dailySQL(['atom_amount', 'fee_amount', 'shortfall_balance', 'total_fee_burned', 'total_fee_minted'], [], `
    select cast(height as int) as height
         , coalesce(cast(json_value(body, '$.allocations.ATOM.__value') as float64) / pow(10, 6), 0) as atom_amount
         , coalesce(cast(json_value(body, '$.allocations.Fee.__value') as float64) / pow(10, 6), 0) as fee_amount
         , cast(json_value(body, '$.shortfallBalance.__value') as float64) / pow(10, 6) as shortfall_balance
         , cast(json_value(body, '$.totalFeeBurned.__value') as float64) / pow(10, 6) as total_fee_burned
         , cast(json_value(body, '$.totalFeeMinted.__value') as float64) / pow(10, 6) as total_fee_minted
      from agoric_mainnet_own.storage
     where path = 'published.reserve.metrics'
  `, block_times.sql()),

  measures: {
    atom_amount_avg: {
      sql: `atom_amount`,
      type: `avg`,
    },
    fee_amount_avg: {
      sql: `fee_amount`,
      type: `avg`,
    },
    shortfall_balance_avg: {
      sql: `shortfall_balance`,
      type: `avg`,
    },
    total_fee_minted_avg: {
      sql: `total_fee_minted`,
      type: `avg`,
    },
    total_fee_burned_avg: {
      sql: `total_fee_burned`,
      type: `avg`,
    },
  },

  dimensions: {
    day: {
      sql: `day`,
      type: `time`,
      primary_key: true,
      public: true,
    },
  },

  pre_aggregations: {
    main: {
      measures: [
        atom_amount_avg,
        fee_amount_avg,
        shortfall_balance_avg,
        total_fee_minted_avg,
        total_fee_burned_avg,
      ],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
