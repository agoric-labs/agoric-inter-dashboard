import { dailySQL } from '../utils';

cube(`psm_governance`, {
  sql: dailySQL(['mint_limit'], ['coin'], `
    select cast(height as int) as height
         , split(path, '.')[3] as coin
         , cast(json_value(body, '$.current.MintLimit.value.__value') as float64) / pow(10, 6) as mint_limit
     from agoric_mainnet_own.storage
    where path like 'published.psm.%.governance'
  `, block_times.sql()),

  measures: {
    last_mint_limit: {
      sql: `array_agg(mint_limit)[0]`,
      type: `number`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(coin, day)`,
      type: `string`,
      primary_key: true,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
    coin: {
      sql: `coin`,
      type: `string`,
    },
  },

  pre_aggregations: {
    mint_limit_per_coin: {
      measures: [psm_governance.last_mint_limit],
      dimensions: [psm_governance.coin],
      time_dimension: psm_governance.day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
