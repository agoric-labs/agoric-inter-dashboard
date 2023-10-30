import { dailySQL, datasetId } from '../utils';

cube(`psm_stats`, {
  sql: dailySQL(
    [
      'anchor_pool_balance',
      'fee_pool_balance',
      'minted_pool_balance',
      'total_minted_provided',
      'total_anchor_provided',
    ],
    ['coin'],
    `
      select block_time
           , split(path, '.')[3] as coin
           , cast(json_value(body, '$.anchorPoolBalance.__value') as float64) / pow(10, 6) as anchor_pool_balance
           , cast(json_value(body, '$.feePoolBalance.__value') as float64) / pow(10, 6) as fee_pool_balance
           , cast(json_value(body, '$.mintedPoolBalance.__value') as float64) / pow(10, 6) as  minted_pool_balance
           , cast(json_value(body, '$.totalAnchorProvided.__value') as float64) / pow(10, 6) as  total_anchor_provided
           , cast(json_value(body, '$.totalMintedProvided.__value') as float64) / pow(10, 6) as total_minted_provided
       from ${state_changes.sql()}
      where module = 'published.psm'
        and ${FILTER_PARAMS.psm_stats.day.filter('block_time')}
        and path like 'published.psm.%.metrics'
    `,
  ),

  joins: {
    psm_governance: {
      relationship: `one_to_one`,
      sql: `${CUBE.coin} = ${psm_governance.coin} and ${CUBE.day} = ${psm_governance.day}`,
    },
  },

  measures: {
    anchor_pool_balance_avg: {
      sql: `anchor_pool_balance`,
      type: `avg`,
    },
    fee_pool_balance_avg: {
      sql: `fee_pool_balance`,
      type: `avg`,
    },
    minted_pool_balance_avg: {
      sql: `minted_pool_balance`,
      type: `avg`,
    },
    minted_pool_balance_sum: {
      sql: `minted_pool_balance`,
      type: `sum`,
    },
    total_minted_provided_avg: {
      sql: `total_minted_provided`,
      type: `avg`,
    },
    total_anchor_provided_avg: {
      sql: `total_anchor_provided`,
      type: `avg`,
    },
    utilization_rate_avg: {
      sql: `minted_pool_balance / ${psm_governance.mint_limit} * 100`,
      type: `avg`,
      format: `percent`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(height, coin, day)`,
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

  // pre_aggregations: {
  //   by_coin_year: {
  //     measures: [
  //       anchor_pool_balance_avg,
  //       fee_pool_balance_avg,
  //       minted_pool_balance_avg,
  //       minted_pool_balance_sum,
  //       total_minted_provided_avg,
  //       total_anchor_provided_avg,
  //       utilization_rate_avg,
  //       psm_governance.mint_limit,
  //     ],
  //     dimensions: [psm_stats.coin],
  //     time_dimension: psm_stats.day,
  //     granularity: `year`,
  //     refreshKey: {
  //       every: `1 day`,
  //     },
  //   },
  //   by_coin_month: {
  //     measures: [
  //       anchor_pool_balance_avg,
  //       fee_pool_balance_avg,
  //       minted_pool_balance_avg,
  //       minted_pool_balance_sum,
  //       total_minted_provided_avg,
  //       total_anchor_provided_avg,
  //       utilization_rate_avg,
  //       psm_governance.mint_limit,
  //     ],
  //     dimensions: [psm_stats.coin],
  //     time_dimension: psm_stats.day,
  //     granularity: `month`,
  //     refreshKey: {
  //       every: `1 day`,
  //     },
  //   },
  //   by_coin_week: {
  //     measures: [
  //       anchor_pool_balance_avg,
  //       fee_pool_balance_avg,
  //       minted_pool_balance_avg,
  //       minted_pool_balance_sum,
  //       total_minted_provided_avg,
  //       total_anchor_provided_avg,
  //       utilization_rate_avg,
  //       psm_governance.mint_limit,
  //     ],
  //     dimensions: [psm_stats.coin],
  //     time_dimension: psm_stats.day,
  //     granularity: `week`,
  //     refreshKey: {
  //       every: `1 day`,
  //     },
  //   },
  //   by_coin_day: {
  //     measures: [
  //       anchor_pool_balance_avg,
  //       fee_pool_balance_avg,
  //       minted_pool_balance_avg,
  //       minted_pool_balance_sum,
  //       total_minted_provided_avg,
  //       total_anchor_provided_avg,
  //       utilization_rate_avg,
  //       psm_governance.mint_limit,
  //     ],
  //     dimensions: [psm_stats.coin],
  //     time_dimension: psm_stats.day,
  //     granularity: `day`,
  //     partition_granularity: `day`,
  //     refresh_key: {
  //       every: `10 minutes`,
  //       incremental: true,
  //       update_window: `1 day`,
  //     },
  //     build_range_start: {
  //       sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.psm'`,
  //     },
  //     build_range_end: {
  //       sql: `select current_timestamp()`,
  //     },
  //   },
  //   stats_year: {
  //     measures: [minted_pool_balance_sum],
  //     time_dimension: psm_stats.day,
  //     granularity: `year`,
  //     refreshKey: {
  //       every: `1 day`,
  //     },
  //   },
  //   stats_month: {
  //     measures: [minted_pool_balance_sum],
  //     time_dimension: psm_stats.day,
  //     granularity: `month`,
  //     refreshKey: {
  //       every: `1 day`,
  //     },
  //   },
  //   stats_week: {
  //     measures: [minted_pool_balance_sum],
  //     time_dimension: psm_stats.day,
  //     granularity: `week`,
  //     refreshKey: {
  //       every: `1 day`,
  //     },
  //   },
  //   stats_day: {
  //     measures: [minted_pool_balance_sum],
  //     time_dimension: psm_stats.day,
  //     granularity: `day`,
  //     partition_granularity: `day`,
  //     refresh_key: {
  //       every: `10 minutes`,
  //       incremental: true,
  //       update_window: `1 day`,
  //     },
  //     build_range_start: {
  //       sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.psm'`,
  //     },
  //     build_range_end: {
  //       sql: `select current_timestamp()`,
  //     },
  //   },
  // },
});
