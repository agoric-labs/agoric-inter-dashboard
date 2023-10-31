import { dailySQL } from '../utils';

cube(`vault_factory_vaults`, {
  sql: dailySQL(
    ['state', 'collateral_amount', 'debt_amount'],
    ['manager_idx', 'vault_idx', 'collateral_type', 'debt_type'],
    `
      select block_time
           , replace(split(path, '.')[3], 'manager', '') as manager_idx
           , replace(split(path, '.')[5], 'vault', '') as vault_idx
           , json_value(body, '$.locked.__brand') collateral_type
           , json_value(body, '$.debtSnapshot.debt.__brand') debt_type
           , json_value(body, '$.vaultState') as state
           , cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) collateral_amount
           , cast(json_value(body, '$.debtSnapshot.debt.__value') as float64) / pow(10, 6) debt_amount
       from ${state_changes.sql()}
      where module = 'published.vaultFactory'
        -- and ${FILTER_PARAMS.vault_factory_governance.day.filter('block_time')}
        and split(path, '.')[safe_offset(2)] = 'managers'
        and split(path, '.')[safe_offset(4)] = 'vaults'
    `,
  ),

  joins: {
    vault_factory_governance: {
      relationship: `one_to_one`,
      sql: `${CUBE.manager_idx} = ${vault_factory_governance.manager_idx} and ${CUBE.day} = ${vault_factory_governance.day}`,
    },
    oracle_prices: {
      relationship: `one_to_one`,
      sql: `${CUBE}.day = ${oracle_prices}.day and concat(${CUBE}.collateral_type, '-USD_price_feed') = ${oracle_prices}.price_feed_name`,
    },
  },

  measures: {
    liquidated_count: {
      sql: `vault_idx`,
      type: `count`,
      filters: [{ sql: `${CUBE}.state = 'liquidated'` }],
    },
    last_state: {
      sql: `array_agg(${CUBE}.state order by ${CUBE}.day desc)[0]`,
      type: `string`,
    },
    collateral_amount_avg: {
      sql: `collateral_amount`,
      type: `avg`,
    },
    debt_amount_avg: {
      sql: `debt_amount`,
      type: `avg`,
    },
    liquidation_price_avg: {
      sql: `safe_divide(debt_amount * ${vault_factory_governance.liquidation_margin}, collateral_amount)`,
      type: `avg`,
    },
    liquidation_cushion_avg: {
      sql: `safe_divide(${oracle_prices.rate}, safe_divide(debt_amount * ${vault_factory_governance.liquidation_margin}, collateral_amount) - 1)`,
      type: `avg`,
    },
    collateralization_ratio_avg: {
      sql: `safe_divide(collateral_amount * ${oracle_prices.rate}, debt_amount)`,
      type: `avg`,
    },
    collateral_amount_usd_avg: {
      sql: `round(collateral_amount * ${oracle_prices.rate}, 6)`,
      type: `avg`,
      title: `Collateral Amount USD Avg`,
    },
    collateral_amount_usd_sum: {
      sql: `round(collateral_amount * ${oracle_prices.rate}, 6)`,
      type: `sum`,
      title: `Collateral Amount USD Sum`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(manager_idx, vault_ix, collateral_type, debt_type, day)`,
      type: `string`,
      primary_key: true,
    },
    manager_idx: {
      type: `number`,
      sql: `manager_idx`,
    },
    vault_idx: {
      type: `number`,
      sql: `vault_idx`,
    },
    collateral_type: {
      type: `string`,
      sql: `collateral_type`,
    },
    debt_type: {
      type: `string`,
      sql: `debt_type`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    by_manager_idx_and_vault_idx_and_collateral_type_and_debt_type_year: {
      measures: [
        oracle_prices.rate_avg,
        vault_factory_governance.liquidation_margin_avg,
        collateral_amount_avg,
        collateral_amount_usd_avg,
        debt_amount_avg,
        liquidation_price_avg,
        liquidation_cushion_avg,
        collateralization_ratio_avg,
      ],
      dimensions: [debt_type, vault_idx, manager_idx, collateral_type],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `1 day`,
      },
    },
    by_manager_idx_and_vault_idx_and_collateral_type_and_debt_type_month: {
      measures: [
        oracle_prices.rate_avg,
        vault_factory_governance.liquidation_margin_avg,
        collateral_amount_avg,
        collateral_amount_usd_avg,
        debt_amount_avg,
        liquidation_price_avg,
        liquidation_cushion_avg,
        collateralization_ratio_avg,
      ],
      dimensions: [debt_type, vault_idx, manager_idx, collateral_type],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `1 day`,
      },
    },
    by_manager_idx_and_vault_idx_and_collateral_type_and_debt_type_week: {
      measures: [
        oracle_prices.rate_avg,
        vault_factory_governance.liquidation_margin_avg,
        collateral_amount_avg,
        collateral_amount_usd_avg,
        debt_amount_avg,
        liquidation_price_avg,
        liquidation_cushion_avg,
        collateralization_ratio_avg,
      ],
      dimensions: [debt_type, vault_idx, manager_idx, collateral_type],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `1 day`,
      },
    },
    by_manager_idx_and_vault_idx_and_collateral_type_and_debt_type_day: {
      measures: [
        oracle_prices.rate_avg,
        vault_factory_governance.liquidation_margin_avg,
        collateral_amount_avg,
        collateral_amount_usd_avg,
        debt_amount_avg,
        liquidation_price_avg,
        liquidation_cushion_avg,
        collateralization_ratio_avg,
      ],
      dimensions: [debt_type, vault_idx, manager_idx, collateral_type],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `30 minutes`,
        incremental: true,
      },
    },
    stats_year: {
      measures: [liquidated_count],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_month: {
      measures: [liquidated_count],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_week: {
      measures: [liquidated_count],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_day: {
      measures: [liquidated_count],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `30 minutes`,
        incremental: true,
      },
    },
  },
});
