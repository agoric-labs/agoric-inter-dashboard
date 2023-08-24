import { datasetId } from '../utils';

cube(`vault_metrics`, {
  sql: `
    with atom_prices as (
      select day as date
           , array_agg(cast(current_price_usd as float64) order by _sdc_batched_at)[0] as usd_price
        from ${datasetId()}.coingeko_history
       where coin_id = 'cosmos'
       group by 1
    ),

    block_time as (
      select block_height as height, block_time as time
        from ${datasetId()}.blocks
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
             cast(m.tot_collateral_value as float64)/cast(m.tot_debt_value as float64) colletarization_ratio --needs to be multiplied by price
      FROM vault_factory_manager_metrics m
      where cast(m.tot_debt_value as float64) > 0
    ),

    vault_manager_governance as (
      select block_height,
             json_value(body, '$.current.DebtLimit.value.__brand') debt_limit_name,
             json_value(body, '$.current.DebtLimit.value.__value') debt_limit_value,
             cast(json_value(body, '$.current.InterestRate.value.numerator.__value') as int64)/
             cast(json_value(body, '$.current.InterestRate.value.denominator.__value') as int64) interest_rate,
             cast(json_value(body, '$.current.LiquidationMargin.value.numerator.__value') as int64)/
             cast(json_value(body, '$.current.LiquidationMargin.value.denominator.__value') as int64) liquidation_margin
      from ${datasetId()}.state_changes
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
             m.total_ist_minted/g.debt_limit_value utilization_rate
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

    pre as (
      select
        block_height,
        cast(block_ts as datetime) block_ts,
        'IST' debt_type,
         'ATOM' collateral_type,
         'ATOM' vault_manager_type,
        total_locked_collateral total_locked_collateral,
        total_locked_collateral * p.usd_price total_locked_collateral_usd,
        total_ist_minted total_ist_minted,
        colletarization_ratio,
        ist_minting_limit ist_minting_limit,
        utilization_rate
        from raw_vault_manager_table v
        join atom_prices p on p.date = date(v.block_ts) - 1
        order by block_height desc
    ),

      dates as (
      select * from
      (select cast(dt as datetime) block_ts from
      unnest(generate_date_array((select min(cast(block_ts as date)) from pre), current_date(), interval 1 year)) dt)
      cross join (select distinct collateral_type, debt_type from pre)
      ),

      inserted_dates as (
        select case when p.block_ts is null then d.block_ts else p.block_ts end ts,
          case when p.collateral_type is null then d.collateral_type else p.collateral_type end collateral_type,
          case when p.debt_type is null then d.debt_type else p.debt_type end debt_type,
          total_locked_collateral,
          total_ist_minted,
          colletarization_ratio,
          ist_minting_limit,
          utilization_rate
        from pre p
        full outer join dates d on p.block_ts = d.block_ts and d.collateral_type = p.collateral_type and d.debt_type = p.debt_type
      ),

      pre_filled as (
        select cast(lag(ts,1) over (partition by collateral_type, debt_type order by ts) as date)  date,
               DATETIME_DIFF(ts, lag(ts,1) over(partition by collateral_type, debt_type order by ts), second) period_len,
               collateral_type, debt_type,
               LAST_VALUE(total_locked_collateral IGNORE NULLS) OVER (partition by collateral_type, debt_type order by ts) total_locked_collateral,
               LAST_VALUE(total_ist_minted IGNORE NULLS) OVER (partition by collateral_type, debt_type order by ts) total_ist_minted,
               LAST_VALUE(colletarization_ratio IGNORE NULLS) OVER (partition by collateral_type, debt_type order by ts) colletarization_ratio,
               LAST_VALUE(ist_minting_limit IGNORE NULLS) OVER (partition by collateral_type, debt_type order by ts) ist_minting_limit,
               LAST_VALUE(utilization_rate IGNORE NULLS) OVER (partition by collateral_type, debt_type order by ts) utilization_rate,
        from inserted_dates
      )
      select d.*, usd_price
       from pre_filled d
       left join atom_prices p on p.date = d.date
       where d.date is not null
  `,

  measures: {
    avg_total_locked_collateral: {
      sql: `sum(period_len*total_locked_collateral)/sum(period_len)`,
      type: `number`,
    },
    avg_total_locked_collateral_usd: {
      sql: `sum(period_len*total_locked_collateral/pow(10,6)*usd_price)/sum(period_len)`,
      type: `number`,
    },
    avg_total_ist_minted: {
      sql: `sum(period_len*total_ist_minted)/sum(period_len)`,
      type: `number`,
    },
    avg_colletarization_ratio: {
      sql: `sum(period_len*colletarization_ratio)/sum(period_len)`,
      type: `number`,
    },
    avg_ist_minting_limit: {
      sql: `sum(period_len*ist_minting_limit)/sum(period_len)`,
      type: `number`,
    },
    avg_utilization_rate: {
      sql: `sum(period_len*utilization_rate)/sum(period_len)`,
      type: `number`,
    },
  },

  dimensions: {
    date: {
      sql: `cast(date as timestamp)`,
      type: `time`,
    },
    collateral_type: {
      sql: `collateral_type`,
      type: `string`,
    },
    debt_type: {
      sql: `debt_type`,
      type: `string`,
    },
  },

  pre_aggregations: {
    main_by_day: {
      measures: [
        avg_total_locked_collateral,
        avg_total_locked_collateral_usd,
        avg_total_ist_minted,
        avg_colletarization_ratio,
        avg_ist_minting_limit,
        avg_utilization_rate,
      ],
      dimensions: [collateral_type, debt_type],
      time_dimension: date,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
