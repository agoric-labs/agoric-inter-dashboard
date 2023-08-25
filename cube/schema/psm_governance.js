import { dailySQL } from '../utils';

cube(`psm_governance`, {
  sql: dailySQL(
    ['mint_limit'],
    ['coin'],
    `
    select block_time
         , split(path, '.')[3] as coin
         , cast(json_value(body, '$.current.MintLimit.value.__value') as float64) / pow(10, 6) as mint_limit
     from ${state_changes.sql()}
    where path like 'published.psm.%.governance'
  `,
  ),

  measures: {
    last_mint_limit: {
      sql: `array_agg(mint_limit)[0]`,
      type: `number`,
    },
    mint_limit_sum: {
      sql: `mint_limit`,
      type: `sum`,
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
    main_year: {
      measures: [psm_governance.last_mint_limit],
      dimensions: [psm_governance.coin],
      time_dimension: psm_governance.day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_month: {
      measures: [psm_governance.last_mint_limit],
      dimensions: [psm_governance.coin],
      time_dimension: psm_governance.day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_week: {
      measures: [psm_governance.last_mint_limit],
      dimensions: [psm_governance.coin],
      time_dimension: psm_governance.day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_day: {
      measures: [psm_governance.last_mint_limit],
      dimensions: [psm_governance.coin],
      time_dimension: psm_governance.day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
    stats_year: {
      measures: [psm_governance.mint_limit_sum],
      time_dimension: psm_governance.day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_month: {
      measures: [psm_governance.mint_limit_sum],
      time_dimension: psm_governance.day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_week: {
      measures: [psm_governance.mint_limit_sum],
      time_dimension: psm_governance.day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_day: {
      measures: [psm_governance.mint_limit_sum],
      time_dimension: psm_governance.day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
