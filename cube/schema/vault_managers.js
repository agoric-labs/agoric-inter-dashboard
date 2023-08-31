import { dailySQL, datasetId } from '../utils';

cube('vault_managers', {
  sql: dailySQL(
    [
      'total_locked_collateral',
      'total_locked_collateral_usd',
      'total_ist_minted',
      'colletarization_ratio',
      'ist_minting_limit',
      'utilization_rate',
    ],
    ['collateral_type'],
    `
      with block_time as (
        select
          block_height as height,
          block_time as time
        from
          agoric_mainnet.blocks
      ),

      vault_factory_metrics as (
          select *
          from ${state_changes.sql()}
        where path = 'published.vaultFactory.managers.manager0.metrics'
      ),

      vault_factory_manager_metrics as (
        select block_height,
               json_extract_scalar(body, '$.liquidatingCollateral.__brand') collateral_type,
               --json_extract_scalar(body, '$.liquidatingCollateral.brand.index') liquidating_collateral_type_ix,
               json_extract_scalar(body, '$.liquidatingCollateral.__value') liquidating_collateral_amount,

               json_extract_scalar(body, '$.liquidatingDebt.__brand') debt_type,
               --json_extract_scalar(body, '$.liquidatingDebt.brand.index') liquidating_debt_type_ix,
               json_extract_scalar(body, '$.liquidatingDebt.__value') liquidating_debt_amount,

               json_extract_scalar(body, '$.numActiveVaults') num_active_vaults,
               json_extract_scalar(body, '$.numLiquidationsAborted') num_liquidations_aborted,
               json_extract_scalar(body, '$.numLiquidationsCompleted') num_liquidations_completed,

               --json_extract_scalar(body, '$.retainedCollateral.brand.index') retained_collateral_type_ix,
               json_extract_scalar(body, '$.retainedCollateral.__value') retained_collateral_value,

               --json_extract_scalar(body, '$.totalCollateral.brand.index') tot_collateral_type_ix,
               json_extract_scalar(body, '$.totalCollateral.__value') tot_collateral_value,

               --json_extract_scalar(body, '$.totalCollateralSold.brand.index') tot_collateral_sold_type_ix,
               json_extract_scalar(body, '$.totalCollateralSold.__value') tot_collateral_sold_value,

               --json_extract_scalar(body, '$.totalDebt.brand.index') tot_debt_type_ix,
               json_extract_scalar(body, '$.totalDebt.__value') tot_debt_value,

               --json_extract_scalar(body, '$.totalOverageReceived.brand.index') tot_overage_recieved_type_ix,
               json_extract_scalar(body, '$.totalOverageReceived.__value') tot_overage_received_value,

               --json_extract_scalar(body, '$.totalProceedsReceived.brand.index') tot_proceeds_recieved_type_ix,
               json_extract_scalar(body, '$.totalProceedsReceived.__value') tot_proceeds_received_value,

               --json_extract_scalar(body, '$.totalShortfallReceived.brand.index') tot_shortfall_recieved_type_ix,
               json_extract_scalar(body, '$.totalShortfallReceived.__value') tot_shortfall_received_value
        from vault_factory_metrics
      ),

      metrics as (
        select m.block_height block_height,
               m.collateral_type,
               debt_type,
               cast(m.tot_collateral_value as float64) total_locked_collateral,
               cast(m.tot_debt_value as float64) total_ist_minted,
               SAFE_DIVIDE(cast(m.tot_collateral_value as float64), cast(m.tot_debt_value as float64)) colletarization_ratio --needs to be multiplied by price
        FROM vault_factory_manager_metrics m
      ),
      vault_manager_governance as (
        select block_height,
               json_value(body, '$.current.DebtLimit.value.__brand') debt_limit_name,
               json_value(body, '$.current.DebtLimit.value.__value') debt_limit_value,
               SAFE_DIVIDE(cast(json_value(body, '$.current.InterestRate.value.numerator.__value') as int64),
               cast(json_value(body, '$.current.InterestRate.value.denominator.__value') as int64)) interest_rate,
               SAFE_DIVIDE(cast(json_value(body, '$.current.LiquidationMargin.value.numerator.__value') as int64),
               cast(json_value(body, '$.current.LiquidationMargin.value.denominator.__value') as int64)) liquidation_margin
        from ${state_changes.sql()}
        where path = 'published.vaultFactory.managers.manager0.governance'
      ),

      governance as (
        select cast(block_height as int64) block_height,
                debt_limit_name,
               lag(cast(block_height as int64),1) over(partition by debt_limit_name order by cast(block_height as int64) desc) next_block_height,
        cast(debt_limit_value as float64) debt_limit_value
        from vault_manager_governance
      ),

      all_metrics as (
        select m.*,
               g.debt_limit_value ist_minting_limit,
               SAFE_DIVIDE(m.total_ist_minted, g.debt_limit_value) utilization_rate
        from  metrics m
        left join
        (select *,
                case when next_block_height is null then (select max(block_height) from metrics)+1 else
                next_block_height end ebh
         from governance) g
        on g.block_height <= m.block_height
        and g.ebh > m.block_height
        and g.debt_limit_name = debt_type
        order by m.block_height
      ),

      raw_vault_manager_table as (
          select t.time as block_ts,
          m.* from all_metrics m
          left join block_time t
          on m.block_height = cast(t.height as int64)
      ),

      atom_prices as (
        select day as date
             , array_agg(cast(current_price_usd as float64) order by _sdc_batched_at)[0] as usd_price
          from agoric_mainnet.coingeko_history
         where coin_id = 'cosmos'
         group by 1
      )

      select block_ts as block_time
           , collateral_type
           , total_locked_collateral/pow(10,6) total_locked_collateral
           , total_locked_collateral/pow(10,6) * p.usd_price total_locked_collateral_usd
           , total_ist_minted/pow(10,6) total_ist_minted
           , colletarization_ratio * p.usd_price colletarization_ratio
           , ist_minting_limit/pow(10,6) ist_minting_limit
           , utilization_rate
      from raw_vault_manager_table v
      join atom_prices p on p.date = date(v.block_ts) - 1
  `,
  ),

  measures: {
    total_locked_collateral_avg: {
      sql: `total_locked_collateral`,
      type: `avg`,
    },
    total_locked_collateral_usd_avg: {
      sql: `total_locked_collateral_usd`,
      type: `avg`,
    },
    total_ist_minted_avg: {
      sql: `total_ist_minted`,
      type: `avg`,
    },
    total_ist_minted_sum: {
      sql: `total_ist_minted`,
      type: `sum`,
    },
    colletarization_ratio_avg: {
      sql: `colletarization_ratio`,
      type: `avg`,
    },
    ist_minting_limit_avg: {
      sql: `ist_minting_limit`,
      type: `avg`,
    },
    ist_minting_limit_sum: {
      sql: `ist_minting_limit`,
      type: `sum`,
    },
    utilization_rate_avg: {
      sql: `utilization_rate`,
      type: `avg`,
    },
  },

  dimensions: {
    collateral_type: {
      sql: `collateral_type`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  // pre_aggregations: {
  //   main3: {
  //     measures: [
  //       total_locked_collateral_avg,
  //       total_locked_collateral_usd_avg,
  //       total_ist_minted_avg,
  //       colletarization_ratio_avg,
  //       ist_minting_limit_avg,
  //       utilization_rate_avg,
  //     ],
  //     dimensions: [collateral_type],
  //     timeDimension: day,
  //     granularity: `day`,
  //   },
  //   summary3: {
  //     measures: [ist_minting_limit_sum, total_ist_minted_sum],
  //     timeDimension: day,
  //     granularity: `day`,
  //   },
  // },
});
