import { datasetId } from '../utils';

cube(`state_changes`, {
  sql: `select * from ${datasetId()}.state_changes`,

  measures: {
    count: {
      sql: `path`,
      type: `count`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true,
    },
    blockTime: {
      sql: `block_time`,
      type: `time`,
    },
    path: {
      sql: `path`,
      type: `string`,
    },
    path_without_wallet_addresses: {
      sql: `regexp_replace(path, 'wallet\\\\.agoric.*', 'allwallets')`,
      type: `string`,
    },
  },

  pre_aggregations: {
    group_by_path: {
      measures: [count],
      dimensions: [path],
      time_dimension: blockTime,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
    group_by_path_without_addresses: {
      measures: [count],
      dimensions: [path_without_wallet_addresses],
      time_dimension: blockTime,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
