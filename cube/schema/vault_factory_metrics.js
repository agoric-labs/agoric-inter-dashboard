import { dailySQL } from '../utils';

cube(`vault_factory_metrics`, {
  sql: dailySQL(
    [
      'liquidating_collateral',
      'liquidating_debt',
      'locked_quote',
      'num_active_vaults',
      'num_liquidating_vaults',
      'num_liquidations_aborted',
      'num_liquidations_completed',
      'retained_collateral',
      'total_collateral',
      'total_collateral_sold',
      'total_debt',
      'total_overage_received',
      'total_proceeds_received',
      'total_shortfall_received',
    ],
    ['manager_idx', 'collateral_type', 'debt_type'],
    `
      select block_time
           , replace(split(path, '.')[3], 'manager', '') as manager_idx
           , json_value(body, '$.totalCollateral.__brand') as collateral_type
           , json_value(body, '$.totalDebt.__brand') as debt_type
           , cast(json_value(body, '$.liquidatingCollateral.__value') as float64) / pow(10, 6) as liquidating_collateral
           , cast(json_value(body, '$.liquidatingDebt.__value') as float64) / pow(10, 6) as liquidating_debt
           , cast(json_value(body, '$.lockedQuote.numerator.__value') as float64) / cast(json_value(body, '$.lockedQuote.denominator.__value') as float64) as locked_quote
           , cast(json_value(body, '$.numActiveVaults') as int) as num_active_vaults
           , cast(json_value(body, '$.numLiquidatingVaults') as int) as num_liquidating_vaults
           , cast(json_value(body, '$.numLiquidationsAborted') as int) as num_liquidations_aborted
           , cast(json_value(body, '$.numLiquidationsCompleted') as int) as num_liquidations_completed
           , cast(json_value(body, '$.retainedCollateral.__value') as float64) as retained_collateral
           , cast(json_value(body, '$.totalCollateral.__value') as float64) / pow(10, 6) as total_collateral
           , cast(json_value(body, '$.totalCollateralSold.__value') as float64) / pow(10, 6) as total_collateral_sold
           , cast(json_value(body, '$.totalDebt.__value') as float64) / pow(10, 6) as total_debt
           , cast(json_value(body, '$.totalOverageReceived.__value') as float64) / pow(10, 6) as total_overage_received
           , cast(json_value(body, '$.totalProceedsReceived.__value') as float64) / pow(10, 6) as total_proceeds_received
           , cast(json_value(body, '$.totalShortfallReceived.__value') as float64) / pow(10, 6) as total_shortfall_received
       from ${state_changes.sql()}
      where module = 'published.vaultFactory'
        -- and ${FILTER_PARAMS.vault_factory_metrics.day.filter('block_time')}
        and split(path, '.')[safe_offset(2)] = 'managers'
        and split(path, '.')[safe_offset(4)] = 'metrics'
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
    manager_idx_count: {
      sql: `manager_idx`,
      type: `countDistinct`,
    },
    liquidating_collateral_avg: {
      sql: `liquidating_collateral`,
      type: `avg`,
    },
    liquidating_debt_avg: {
      sql: `liquidating_debt`,
      type: `avg`,
    },
    locked_quote_avg: {
      sql: `locked_quote`,
      type: `avg`,
    },
    num_active_vaults_last: {
      sql: `array_agg(num_active_vaults order by ${CUBE}.day desc)[0]`,
      type: `number`,
    },
    num_liquidating_vaults_last: {
      sql: `array_agg(num_liquidating_vaults order by ${CUBE}.day desc)[0]`,
      type: `number`,
    },
    num_liquidations_aborted_last: {
      sql: `array_agg(num_liquidations_aborted order by ${CUBE}.day desc)[0]`,
      type: `number`,
    },
    num_liquidations_completed_last: {
      sql: `array_agg(num_liquidations_completed order by ${CUBE}.day desc)[0]`,
      type: `number`,
    },
    retained_collateral_avg: {
      sql: `retained_collateral`,
      type: `avg`,
    },
    total_collateral_avg: {
      sql: `total_collateral`,
      type: `avg`,
    },
    total_collateral_sold_avg: {
      sql: `total_collateral_sold`,
      type: `avg`,
    },
    total_collateral_usd_avg: {
      sql: `round(total_collateral * ${oracle_prices.rate}, 6)`,
      type: `avg`,
    },
    total_collateral_sold_usd_avg: {
      sql: `round(total_collateral_sold * ${oracle_prices.rate}, 6)`,
      type: `avg`,
    },
    total_debt_avg: {
      sql: `total_debt`,
      type: `avg`,
    },
    total_overage_received_avg: {
      sql: `total_overage_received`,
      type: `avg`,
    },
    total_proceeds_received_avg: {
      sql: `total_proceeds_received`,
      type: `avg`,
    },
    total_shortfall_received_avg: {
      sql: `total_shortfall_received`,
      type: `avg`,
    },

    num_active_vaults_sum: {
      sql: `num_active_vaults`,
      type: `sum`,
    },
    num_liquidating_vaults_sum: {
      sql: `num_liquidating_vaults`,
      type: `sum`,
    },
    num_liquidations_aborted_sum: {
      sql: `num_liquidations_aborted`,
      type: `sum`,
    },
    num_liquidations_completed_sum: {
      sql: `num_liquidations_completed`,
      type: `sum`,
    },
    liquidating_collateral_sum: {
      sql: `liquidating_collateral`,
      type: `sum`,
    },
    liquidating_debt_sum: {
      sql: `liquidating_debt`,
      type: `sum`,
    },
    retained_collateral_sum: {
      sql: `retained_collateral`,
      type: `sum`,
    },
    total_collateral_usd_sum: {
      sql: `round(total_collateral * ${oracle_prices.rate}, 6)`,
      type: `sum`,
    },
    total_collateral_sold_usd_sum: {
      sql: `round(total_collateral_sold * ${oracle_prices.rate}, 6)`,
      type: `sum`,
    },
    total_debt_sum: {
      sql: `total_debt`,
      type: `sum`,
    },
    total_overage_received_sum: {
      sql: `total_overage_received`,
      type: `sum`,
    },
    total_proceeds_received_sum: {
      sql: `total_proceeds_received`,
      type: `sum`,
    },
    total_shortfall_received_sum: {
      sql: `total_shortfall_received`,
      type: `sum`,
    },

    colletarization_ratio_avg: {
      sql: `safe_divide(total_collateral * ${oracle_prices.rate}, total_debt)`,
      type: `avg`,
    },

    utilization_rate_avg: {
      sql: `safe_divide(total_debt, ${vault_factory_governance.debt_limit})`,
      type: `avg`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(manager_idx, day)`,
      type: `string`,
      primary_key: true,
    },
    manager_idx: {
      sql: `manager_idx`,
      type: `number`,
    },
    collateral_type: {
      sql: `collateral_type`,
      type: `string`,
    },
    debt_type: {
      sql: `debt_type`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    by_manager_idx_and_collateral_type_year: {
      measures: [
        liquidating_collateral_avg,
        liquidating_debt_avg,
        locked_quote_avg,
        num_active_vaults_last,
        num_liquidating_vaults_last,
        num_liquidations_aborted_last,
        num_liquidations_completed_last,
        retained_collateral_avg,
        total_collateral_avg,
        total_collateral_sold_avg,
        total_debt_avg,
        total_overage_received_avg,
        total_proceeds_received_avg,
        total_shortfall_received_avg,
        colletarization_ratio_avg,
        vault_factory_governance.debt_limit_avg,
      ],
      dimensions: [manager_idx, collateral_type, debt_type],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_manager_idx_and_collateral_type_month: {
      measures: [
        liquidating_collateral_avg,
        liquidating_debt_avg,
        locked_quote_avg,
        num_active_vaults_last,
        num_liquidating_vaults_last,
        num_liquidations_aborted_last,
        num_liquidations_completed_last,
        retained_collateral_avg,
        total_collateral_avg,
        total_collateral_sold_avg,
        total_debt_avg,
        total_overage_received_avg,
        total_proceeds_received_avg,
        total_shortfall_received_avg,
        colletarization_ratio_avg,
        vault_factory_governance.debt_limit_avg,
      ],
      dimensions: [manager_idx, collateral_type, debt_type],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_manager_idx_and_collateral_type_week: {
      measures: [
        liquidating_collateral_avg,
        liquidating_debt_avg,
        locked_quote_avg,
        num_active_vaults_last,
        num_liquidating_vaults_last,
        num_liquidations_aborted_last,
        num_liquidations_completed_last,
        retained_collateral_avg,
        total_collateral_avg,
        total_collateral_sold_avg,
        total_debt_avg,
        total_overage_received_avg,
        total_proceeds_received_avg,
        total_shortfall_received_avg,
        colletarization_ratio_avg,
        vault_factory_governance.debt_limit_avg,
      ],
      dimensions: [manager_idx, collateral_type, debt_type],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_manager_idx_and_collateral_type_day: {
      measures: [
        liquidating_collateral_avg,
        liquidating_debt_avg,
        locked_quote_avg,
        num_active_vaults_last,
        num_liquidating_vaults_last,
        num_liquidations_aborted_last,
        num_liquidations_completed_last,
        retained_collateral_avg,
        total_collateral_avg,
        total_collateral_sold_avg,
        total_debt_avg,
        total_overage_received_avg,
        total_proceeds_received_avg,
        total_shortfall_received_avg,
        colletarization_ratio_avg,
        vault_factory_governance.debt_limit_avg,
      ],
      dimensions: [manager_idx, collateral_type, debt_type],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `day`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.vaultFactory' and path like '%metrics'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
    stats_year: {
      measures: [
        manager_idx_count,
        liquidating_collateral_sum,
        liquidating_debt_sum,
        num_active_vaults_sum,
        num_liquidating_vaults_sum,
        num_liquidations_aborted_sum,
        num_liquidations_completed_sum,
        retained_collateral_sum,
        total_collateral_usd_sum,
        total_collateral_sold_usd_sum,
        total_debt_sum,
        total_overage_received_sum,
        total_proceeds_received_sum,
        total_shortfall_received_sum,
      ],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `1 day`,
      },
    },
    stats_month: {
      measures: [
        manager_idx_count,
        liquidating_collateral_sum,
        liquidating_debt_sum,
        num_active_vaults_sum,
        num_liquidating_vaults_sum,
        num_liquidations_aborted_sum,
        num_liquidations_completed_sum,
        retained_collateral_sum,
        total_collateral_usd_sum,
        total_collateral_sold_usd_sum,
        total_debt_sum,
        total_overage_received_sum,
        total_proceeds_received_sum,
        total_shortfall_received_sum,
      ],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `1 day`,
      },
    },
    stats_week: {
      measures: [
        manager_idx_count,
        liquidating_collateral_sum,
        liquidating_debt_sum,
        num_active_vaults_sum,
        num_liquidating_vaults_sum,
        num_liquidations_aborted_sum,
        num_liquidations_completed_sum,
        retained_collateral_sum,
        total_collateral_usd_sum,
        total_collateral_sold_usd_sum,
        total_debt_sum,
        total_overage_received_sum,
        total_proceeds_received_sum,
        total_shortfall_received_sum,
      ],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `1 day`,
      },
    },
    stats_day: {
      measures: [
        manager_idx_count,
        liquidating_collateral_sum,
        liquidating_debt_sum,
        num_active_vaults_sum,
        num_liquidating_vaults_sum,
        num_liquidations_aborted_sum,
        num_liquidations_completed_sum,
        retained_collateral_sum,
        total_collateral_usd_sum,
        total_collateral_sold_usd_sum,
        total_debt_sum,
        total_overage_received_sum,
        total_proceeds_received_sum,
        total_shortfall_received_sum,
      ],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `day`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.vaultFactory' and path like '%metrics'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
  },
});
