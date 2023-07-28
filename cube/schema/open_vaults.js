import { datasetId, dailySQL } from '../utils';

cube('open_vaults', {
  sql: dailySQL(
    [
      'collateral_amount',
      'current_collateral_price',
      'collateral_oracle_usd_value',
      'ist_debt_amount',
      'liquidation_margin',
      'liquidation_price',
      'liquidation_cushion',
      'collateralization_ratio',
    ],
    ['vault_ix', 'collateral_type'],
    `select * from ${datasetId()}.open_vaults`,
    block_times.sql(),
  ),

  measures: {
    collateral_amount: {
      sql: `collateral_amount`,
      type: `avg`,
    },
    current_collateral_price: {
      sql: `current_collateral_price`,
      type: `avg`,
    },
    collateral_oracle_usd_value: {
      sql: `collateral_oracle_usd_value`,
      type: `avg`,
    },
    ist_debt_amount: {
      sql: `ist_debt_amount`,
      type: `avg`,
    },
    liquidation_margin: {
      sql: `liquidation_margin`,
      type: `avg`,
    },
    liquidation_price: {
      sql: `liquidation_price`,
      type: `avg`,
    },
    liquidation_cushion: {
      sql: `liquidation_cushion`,
      type: `avg`,
    },
    collateralization_ratio: {
      sql: `collateralization_ratio`,
      type: `avg`,
      format: `percent`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(vault_ix, height)`,
      type: `string`,
      primary_key: true,
    },
    vault_ix: {
      sql: `vault_ix`,
      type: `number`
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [
        collateral_amount,
        current_collateral_price,
        collateral_oracle_usd_value,
        ist_debt_amount,
        liquidation_margin,
        liquidation_price,
        liquidation_cushion,
        collateralization_ratio,
      ],
      dimensions: [
        vault_ix,
      ],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
