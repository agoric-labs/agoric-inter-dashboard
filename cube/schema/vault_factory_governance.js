import { dailySQL } from '../utils';

cube(`vault_factory_governance`, {
  sql: dailySQL(
    ['debt_limit', 'interest_rate', 'liquidation_margin', 'liquidation_padding', 'liquidation_penalty', 'mint_fee'],
    ['manager_idx'],
    `
      select block_time
           , replace(split(path, '.')[3], 'manager', '') as manager_idx
           , cast(json_value(body, '$.current.DebtLimit.value.__value') as float64) / pow(10, 6) as debt_limit
           , cast(json_value(body, '$.current.InterestRate.value.numerator.__value') as float64) / cast(json_value(body, '$.current.InterestRate.value.denominator.__value') as float64) as interest_rate
           , cast(json_value(body, '$.current.LiquidationMargin.value.numerator.__value') as float64) / cast(json_value(body, '$.current.LiquidationMargin.value.denominator.__value') as float64) as liquidation_margin
           , cast(json_value(body, '$.current.LiquidationPadding.value.numerator.__value') as float64) / cast(json_value(body, '$.current.LiquidationPadding.value.denominator.__value') as float64) as liquidation_padding
           , cast(json_value(body, '$.current.LiquidationPenalty.value.numerator.__value') as float64) / cast(json_value(body, '$.current.LiquidationPenalty.value.denominator.__value') as float64) as liquidation_penalty
           , cast(json_value(body, '$.current.MintFee.numerator.value.__value') as float64) / cast(json_value(body, '$.current.MintFee.value.denominator.__value') as float64) as mint_fee
       from ${state_changes.sql()}
      where module = 'published.vaultFactory'
        -- and ${FILTER_PARAMS.vault_factory_governance.day.filter('block_time')}
        and split(path, '.')[safe_offset(2)] = 'managers'
        and split(path, '.')[safe_offset(4)] = 'governance'
    `,
  ),

  measures: {
    debt_limit_avg: {
      sql: 'debt_limit',
      type: 'avg',
    },
    interest_rate_avg: {
      sql: 'interest_rate',
      type: 'avg',
    },
    liquidation_margin_avg: {
      sql: 'liquidation_margin',
      type: 'avg',
    },
    liquidation_padding_avg: {
      sql: 'liquidation_padding',
      type: 'avg',
    },
    liquidation_penalty_avg: {
      sql: 'liquidation_penalty',
      type: 'avg',
    },
    mint_fee_avg: {
      sql: 'mint_fee',
      type: 'avg',
    },
    debt_limit_sum: {
      sql: 'debt_limit',
      type: 'sum',
    },
    // a fake measure for joins
    debt_limit: {
      sql: 'debt_limit',
      type: 'number',
      public: false,
    },
    liquidation_margin: {
      sql: 'liquidation_margin',
      type: 'number',
      public: false,
    },
  },

  dimensions: {
    id: {
      sql: `concat(manager_idx, day)`,
      type: `string`,
      primary_key: true,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
    manager_idx: {
      sql: `manager_idx`,
      type: `number`,
    },
  },

  pre_aggregations: {
    by_manager_idx_year: {
      measures: [
        debt_limit_avg,
        interest_rate_avg,
        liquidation_margin_avg,
        liquidation_padding_avg,
        liquidation_penalty_avg,
        mint_fee_avg,
      ],
      dimensions: [manager_idx],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_manager_idx_month: {
      measures: [
        debt_limit_avg,
        interest_rate_avg,
        liquidation_margin_avg,
        liquidation_padding_avg,
        liquidation_penalty_avg,
        mint_fee_avg,
      ],
      dimensions: [manager_idx],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_manager_idx_week: {
      measures: [
        debt_limit_avg,
        interest_rate_avg,
        liquidation_margin_avg,
        liquidation_padding_avg,
        liquidation_penalty_avg,
        mint_fee_avg,
      ],
      dimensions: [manager_idx],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_manager_idx_day: {
      measures: [
        debt_limit_sum,
        interest_rate_avg,
        liquidation_margin_avg,
        liquidation_padding_avg,
        liquidation_penalty_avg,
        mint_fee_avg,
      ],
      dimensions: [manager_idx],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `month`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.vaultFactory' and path like '%governance'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
    stats_year: {
      measures: [debt_limit_sum],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `1 day`,
      },
    },
    stats_month: {
      measures: [debt_limit_sum],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `1 day`,
      },
    },
    stats_week: {
      measures: [debt_limit_sum],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `1 day`,
      },
    },
    stats_day: {
      measures: [debt_limit_sum],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `month`,
      refresh_key: {
        every: `30 minutes`,
        incremental: true,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.vaultFactory' and path like '%governance'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
  },
});
