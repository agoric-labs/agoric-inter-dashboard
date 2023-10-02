import { datasetId, dailySQL } from '../utils';

cube('vaults', {
  sql: dailySQL(
    [
      'collateral_amount',
      'state',
    ],
    ['vault_ix', 'debt_type_name', 'collateral_type'],
    `
      select block_time,
             path as vault_ix, -- manager id + vault id
             json_value(body, '$.debtSnapshot.debt.__brand') debt_type_name,
             json_value(body, '$.locked.__brand') collateral_type,
             cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) collateral_amount,
             json_value(body, '$.vaultState') state
      from ${state_changes.sql()}
      where path like 'published.vaultFactory.managers.manager%'
        and split(path, '.')[safe_offset(4)] = 'vaults'
    `
  ),
  measures: {
    count: {
      sql: `vault_ix`,
      type: `count`,
    },
    last_state: {
      sql: `state`,
      type: `sql`,
    },
  },

  dimensions: {
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  // pre_aggregations: {
  //   stats_year: {
  //     measures: [count],
  //     dimensions: [state],
  //     timeDimension: day,
  //     granularity: `year`,
  //     refreshKey: {
  //       every: `24 hour`,
  //     },
  //   },
  //   stats_month: {
  //     measures: [count],
  //     dimensions: [state],
  //     timeDimension: day,
  //     granularity: `month`,
  //     refreshKey: {
  //       every: `24 hour`,
  //     },
  //   },
  //   stats_week: {
  //     measures: [count],
  //     dimensions: [state],
  //     timeDimension: day,
  //     granularity: `month`,
  //     refreshKey: {
  //       every: `24 hour`,
  //     },
  //   },
  //   stats_day: {
  //     measures: [count],
  //     dimensions: [state],
  //     timeDimension: day,
  //     granularity: `day`,
  //     refreshKey: {
  //       every: `10 minutes`,
  //     },
  //   },
  // },
});
