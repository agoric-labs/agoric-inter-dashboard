import { dailySQL } from '../utils';

cube(`psm_stats`, {
  sql: dailySQL(['minted_pool_balance'], ['coin'], `
    select block_time
         , split(path, '.')[3] as coin
         , cast(json_value(body, '$.mintedPoolBalance.__value') as float64) / pow(10, 6) as  minted_pool_balance
     from ${state_changes.sql()}
    where path like 'published.psm.%.metrics'
  `),

  joins: {
    psm_governance: {
      relationship: `one_to_one`,
      sql: `${CUBE.coin} = ${psm_governance.coin} and ${CUBE.day} = ${psm_governance.day}`,
    },
  },

  measures: {
    last_minted_pool_balance: {
      sql: `array_agg(minted_pool_balance)[0]`,
      type: `number`,
    },
    last_utilization_rate: {
      sql: `${CUBE.last_minted_pool_balance} / ${psm_governance.last_mint_limit} * 100`,
      type: `number`,
      format: `percent`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(height, coin)`,
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
    main: {
      measures: [
        last_minted_pool_balance,
        last_utilization_rate,
        psm_governance.last_mint_limit,
      ],
      dimensions: [psm_stats.coin],
      time_dimension: psm_stats.day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
