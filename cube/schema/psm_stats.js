import { dailySQL, datasetId } from '../utils';

cube(`psm_stats`, {
  sql: dailySQL(
    ['minted_pool_balance', 'anchor_pool_balance', 'total_minted_provided'],
    ['coin'],
    `
    select block_time
         , split(path, '.')[3] as coin
         , cast(json_value(body, '$.mintedPoolBalance.__value') as float64) / pow(10, 6) as  minted_pool_balance
         , cast(json_value(body, '$.anchorPoolBalance.__value') as float64) / pow(10, 6) as anchor_pool_balance
         , cast(json_value(body, '$.totalMintedProvided.__value') as float64) / pow(10, 6) as total_minted_provided
     from ${state_changes.sql()}
    where path like 'published.psm.%.metrics'
  `,
  ),

  joins: {
    psm_governance: {
      relationship: `one_to_one`,
      sql: `${CUBE.coin} = ${psm_governance.coin} and ${CUBE.day} = ${psm_governance.day}`,
    },
  },

  measures: {
    minted_pool_balance_sum: {
      sql: `minted_pool_balance`,
      type: `sum`,
    },
    last_minted_pool_balance: {
      sql: `array_agg(minted_pool_balance)[0]`,
      type: `number`,
    },
    last_total_minted_provided: {
      sql: `array_agg(total_minted_provided)[0]`,
      type: `number`,
    },
    last_anchor_pool_balance: {
      sql: `array_agg(anchor_pool_balance)[0]`,
      type: `number`,
    },
    last_utilization_rate: {
      sql: `${CUBE.last_minted_pool_balance} / ${psm_governance.last_mint_limit} * 100`,
      type: `number`,
      format: `percent`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(height, coin)`,
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
    main_year: {
      measures: [
        last_minted_pool_balance,
        last_utilization_rate,
        last_total_minted_provided,
        last_anchor_pool_balance,
        psm_governance.last_mint_limit,
      ],
      dimensions: [psm_stats.coin],
      time_dimension: psm_stats.day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_month: {
      measures: [
        last_minted_pool_balance,
        last_utilization_rate,
        last_total_minted_provided,
        last_anchor_pool_balance,
        psm_governance.last_mint_limit,
      ],
      dimensions: [psm_stats.coin],
      time_dimension: psm_stats.day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_week: {
      measures: [
        last_minted_pool_balance,
        last_utilization_rate,
        last_total_minted_provided,
        last_anchor_pool_balance,
        psm_governance.last_mint_limit,
      ],
      dimensions: [psm_stats.coin],
      time_dimension: psm_stats.day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_day: {
      measures: [
        last_minted_pool_balance,
        last_utilization_rate,
        last_total_minted_provided,
        last_anchor_pool_balance,
        psm_governance.last_mint_limit,
      ],
      dimensions: [psm_stats.coin],
      time_dimension: psm_stats.day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
    stats_year: {
      measures: [minted_pool_balance_sum],
      time_dimension: psm_stats.day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_month: {
      measures: [minted_pool_balance_sum],
      time_dimension: psm_stats.day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_week: {
      measures: [minted_pool_balance_sum],
      time_dimension: psm_stats.day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_day: {
      measures: [minted_pool_balance_sum],
      time_dimension: psm_stats.day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
