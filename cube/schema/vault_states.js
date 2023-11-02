import { dailySQL } from '../utils';

cube(`vault_states`, {
  sql: dailySQL(
    ['state', 'switch_time', 'collateral_amount'],
    ['vault_ix'],
    `
      select block_time
           , block_time as switch_time
           , path as vault_ix -- manager id + vault id
           , json_value(body, '$.vaultState') state
           , cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) collateral_amount
      from ${state_changes.sql()}
      where module = 'published.vaultFactory'
        and path like 'published.vaultFactory.managers.manager%'
        and split(path, '.')[safe_offset(4)] = 'vaults'
    `,
  ),
  measures: {
    count: {
      sql: `state`,
      type: `count`,
    },
  },

  dimensions: {
    state: {
      sql: `state`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    stats_year: {
      measures: [count],
      dimensions: [state],
      timeDimension: day,
      granularity: `year`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    stats_month: {
      measures: [count],
      dimensions: [state],
      timeDimension: day,
      granularity: `month`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    stats_week: {
      measures: [count],
      dimensions: [state],
      timeDimension: day,
      granularity: `month`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    stats_day: {
      measures: [count],
      dimensions: [state],
      timeDimension: day,
      granularity: `day`,
      partition_granularity: `month`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.vaultFactory' and path like 'published.vaultFactory.managers.manager%'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
  },
});
