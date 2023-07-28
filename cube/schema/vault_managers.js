import { dailySQL, datasetId } from '../utils';

cube(`vault_managers`, {
  sql: dailySQL(
    [
      'total_locked_collateral',
      'total_locked_collateral_usd',
      'total_ist_minted',
      'colletarization_ratio',
      'ist_minting_limit',
      'utilization_rate',
    ],
    ['type'],
    `select * from ${datasetId()}.vault_managers`,
    block_times.sql(),
  ),

  measures: {
    total_locked_collateral: {
      sql: `total_locked_collateral`,
      type: `avg`,
    },
    total_locked_collateral_usd: {
      sql: `total_locked_collateral_usd`,
      type: `avg`,
    },
    total_ist_minted: {
      sql: `total_ist_minted`,
      type: `avg`,
    },
    colletarization_ratio: {
      sql: `colletarization_ratio * 100`,
      type: `avg`,
      format: `percent`,
    },
    ist_minting_limit: {
      sql: `ist_minting_limit`,
      type: `avg`,
    },
    utilization_rate: {
      sql: `utilization_rate * 100`,
      type: `avg`,
      format: `percent`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(type, height)`,
      type: `string`,
      primary_key: true,
    },
    type: {
      sql: `type`,
      type: `string`
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [
        total_locked_collateral,
        total_locked_collateral_usd,
        total_ist_minted,
        colletarization_ratio,
        ist_minting_limit,
        utilization_rate,
      ],
      dimensions: [
        type,
      ],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
