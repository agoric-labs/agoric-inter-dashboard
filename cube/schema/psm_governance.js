import { dailySQL, datasetId } from '../utils';

cube(`psm_governance`, {
  sql: dailySQL(
    ['mint_limit'],
    ['coin'],
    `
    select block_time
         , split(path, '.')[3] as coin
         , cast(json_value(body, '$.current.MintLimit.value.__value') as float64) / pow(10, 6) as mint_limit
     from ${state_changes.sql()}
    where module = 'published.psm'
      and path like 'published.psm.%.governance'
  `,
  ),

  measures: {
    mint_limit_avg: {
      sql: `mint_limit`,
      type: `avg`,
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
    by_coin_year: {
      measures: [mint_limit_avg, mint_limit_sum],
      dimensions: [coin],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `1 day`,
      },
    },
    by_coin_month: {
      measures: [mint_limit_avg, mint_limit_sum],
      dimensions: [coin],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `1 day`,
      },
    },
    by_coin_week: {
      measures: [mint_limit_avg, mint_limit_sum],
      dimensions: [coin],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `1 day`,
      },
    },
    by_coin_day: {
      measures: [mint_limit_avg, mint_limit_sum],
      dimensions: [coin],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `day`,
      refresh_key: {
        every: `10 minutes`,
        incremental: true,
        update_window: `1 day`,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.psm' and path like '%governance'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
    stats_year: {
      measures: [mint_limit_sum],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_month: {
      measures: [mint_limit_sum],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_week: {
      measures: [mint_limit_sum],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_day: {
      measures: [mint_limit_sum],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `day`,
      refresh_key: {
        every: `10 minutes`,
        incremental: true,
        update_window: `1 day`,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.psm' and path like '%governance'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
  },
});
