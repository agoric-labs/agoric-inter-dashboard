import { dailySQL } from '../utils';

cube(`reserve`, {
  sql: dailySQL(
    ['shortfall_balance', 'total_fee_burned', 'total_fee_minted'],
    [],
    `
    select block_time -- for dailySQL
         , cast(json_value(body, '$.shortfallBalance.__value') as float64) / pow(10, 6) as shortfall_balance
         , cast(json_value(body, '$.totalFeeBurned.__value') as float64) / pow(10, 6) as total_fee_burned
         , cast(json_value(body, '$.totalFeeMinted.__value') as float64) / pow(10, 6) as total_fee_minted
      from ${state_changes.sql()}
     where module = 'published.reserve'
       -- and ${FILTER_PARAMS.reserve.day.filter('block_time')}
       and path = 'published.reserve.metrics'
  `,
  ),

  measures: {
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
    main_year: {
      measures: [shortfall_balance_avg, total_fee_minted_avg, total_fee_burned_avg],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `1 day`,
      },
    },
    main_month: {
      measures: [shortfall_balance_avg, total_fee_minted_avg, total_fee_burned_avg],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `1 day`,
      },
    },
    main_week: {
      measures: [shortfall_balance_avg, total_fee_minted_avg, total_fee_burned_avg],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `1 day`,
      },
    },
    main_day: {
      measures: [shortfall_balance_avg, total_fee_minted_avg, total_fee_burned_avg],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `month`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.reserve'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
  },
});
