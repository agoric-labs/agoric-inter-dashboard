create or replace view xxx.block_times as (
  select cast(anchor_id as int) as height
       , parse_timestamp('%Y-%m-%dT%H:%M:%E*S%Ez', value) as value
    from xxx.block_time_string attr
   union all
  select cast(height as int) as height
       , parse_timestamp('%Y-%m-%dT%H:%M:%E*S%Ez', time) as value
    from xxx.old_block_times
);

-- unformatted SQL from pavel.yashin@p2p.org
create or replace view xxx.vault_managers as (
  with vault_factory_metrics as (
        select *
        from agoric_mainnet_own.storage
      where path = 'published.vaultFactory.managers.manager0.metrics'
    ), vault_factory_manager_metrics as (
    select height as block_height,
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
      select cast(m.block_height as int64) block_height,
             m.collateral_type,
             debt_type,
             cast(m.tot_collateral_value as float64) total_locked_collateral,
             cast(m.tot_debt_value as float64) total_ist_minted,
             SAFE_DIVIDE(cast(m.tot_collateral_value as float64), cast(m.tot_debt_value as float64)) colletarization_ratio --needs to be multiplied by price
      FROM vault_factory_manager_metrics m
    ),
    vault_manager_governance as (
      select height as block_height,
             json_value(body, '$.current.DebtLimit.value.__brand') debt_limit_name,
             json_value(body, '$.current.DebtLimit.value.__value') debt_limit_value,
             SAFE_DIVIDE(cast(json_value(body, '$.current.InterestRate.value.numerator.__value') as int64),
             cast(json_value(body, '$.current.InterestRate.value.denominator.__value') as int64)) interest_rate,
             SAFE_DIVIDE(cast(json_value(body, '$.current.LiquidationMargin.value.numerator.__value') as int64),
             cast(json_value(body, '$.current.LiquidationMargin.value.denominator.__value') as int64)) liquidation_margin
      from agoric_mainnet_own.storage
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
    ), raw_vault_manager_table as (
        select t.value as block_ts,
        m.* from all_metrics m
        left join xxx.block_times t
        on m.block_height = cast(t.height as int64)
    ), atom_prices as (
      select cast(json_value(market_data, '$.current_price.usd') as float64) as usd_price
           , parse_date("%d-%m-%Y", date) as date
        from agoric_ollinet_may_10.coingeco_history
       where symbol = 'atom'
    )
    select cast(v.block_height as int) height
    , 'manager0' type,
    total_locked_collateral/pow(10,6) total_locked_collateral,
    total_locked_collateral/pow(10,6) * p.usd_price total_locked_collateral_usd,
    total_ist_minted/pow(10,6) total_ist_minted,
    colletarization_ratio * p.usd_price colletarization_ratio,
    ist_minting_limit/pow(10,6) ist_minting_limit,
    utilization_rate
    from raw_vault_manager_table v
    join atom_prices p on p.date = date(v.block_ts) - 1
);

-- unformatted SQL from pavel.yashin@p2p.org
create or replace view xxx.open_vaults as (
  with vault_factory_vaults as (
    select height as block_height,
           split(path, 'published.vaultFactory.managers.manager0.vaults.vault')[safe_offset(1)] vault_ix,

           json_value(body, '$.debtSnapshot.debt.__brand') debt_type_name,
           cast(json_value(body, '$.debtSnapshot.debt.__value') as float64) / pow(10, 6) debt_value,

           cast(json_value(body, '$.debtSnapshot.interest.numerator.__value') as float64) /
           cast(json_value(body, '$.debtSnapshot.interest.denominator.__value') as float64) / pow(10, 6) interest,


           json_value(body, '$.locked.__brand') locked_type_name,
           cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) locked_value,

           json_value(body, '$.vaultState') vault_state
    from agoric_mainnet_own.storage
    where path like 'published.vaultFactory.managers.manager0.vaults.%'
  ),

  vaults_statuses as (
    select vault_ix, ARRAY_AGG(vault_state order by block_height desc)[safe_offset(0)] vault_state
      from vault_factory_vaults
     group by vault_ix
  ),

  active_vaults as (
    select vault_ix,
           block_height,
           locked_type_name,
           cast(ARRAY_AGG(locked_value order by block_height desc)[safe_offset(0)] as float64) collateral_amount,
           debt_type_name,
           cast(ARRAY_AGG(debt_value order by block_height desc)[safe_offset(0)] as float64) ist_debt_amount
    from vault_factory_vaults
    where vault_ix in (select vault_ix from vaults_statuses where vault_state = 'active') and debt_type_name = 'IST'
    group by vault_ix, block_height, locked_type_name, debt_type_name
  ),

  oracle_prices as (
    select height as block_height,
           split(path, 'published.priceFeed.')[safe_offset(1)] price_feed_name,
           json_value(body, '$.timestamp.__absValue') timestamp,
           regexp_extract(split(path, 'published.priceFeed.')[safe_offset(1)], r'^(\w+)-') type_in_name,
           json_value(body, '$.amountIn.__value') type_in_amount,
           regexp_extract(split(path, 'published.priceFeed.')[safe_offset(1)], r'-(\w+?)_') type_out_name,
           json_value(body, '$.amountOut.__value') type_out_amount
    from agoric_mainnet_own.storage
    where path like 'published.priceFeed.%_price_feed'
  ),

  prices as (
    select cast(block_height as int64) block_height,
    price_feed_name,
    type_in_name,
    type_out_name,
    cast(type_out_amount as float64)/cast(type_in_amount as float64) price
    from oracle_prices
  ),

  oracle_price_grid as (
    select g.block_height,
           g.price_feed_name,
           LAST_VALUE(p.type_in_name IGNORE NULLS) OVER (partition by g.price_feed_name order by g.block_height) type_in_name,
           LAST_VALUE(p.type_out_name IGNORE NULLS) OVER (partition by g.price_feed_name order by g.block_height) type_out_name,
           LAST_VALUE(p.price IGNORE NULLS) OVER (partition by g.price_feed_name order by g.block_height) price
    from
    (select * from
    unnest(generate_array((select greatest(min(cast(height as int64)), max(cast(height as int64)) - pow(10, 6)) from agoric_mainnet_own.storage),
                          (select max(cast(height as int64)) from agoric_mainnet_own.storage), 1)) block_height
                          cross join (select distinct price_feed_name from prices)
    ) g
    join prices p
    on g.block_height = p.block_height and g.price_feed_name = p.price_feed_name
  ),

  last_oracle_prices as (
    select type_in_name,
           ARRAY_AGG(price order by block_height desc)[safe_offset(0)] last_oracle_price
    from oracle_price_grid
    where type_out_name = 'USD'
    group by type_in_name
  ),

  vault_manager_governance as (
    select height as block_height,
           json_value(body, '$.current.DebtLimit.value.__brand') debt_limit_name,
           json_value(body, '$.current.DebtLimit.value.__value') debt_limit_value,
           cast(json_value(body, '$.current.InterestRate.value.numerator.__value') as int64)/
           cast(json_value(body, '$.current.InterestRate.value.denominator.__value') as int64) interest_rate,
           cast(json_value(body, '$.current.LiquidationMargin.value.numerator.__value') as int64)/
           cast(json_value(body, '$.current.LiquidationMargin.value.denominator.__value') as int64) liquidation_margin
    from agoric_mainnet_own.storage
    where path = 'published.vaultFactory.managers.manager0.governance'
  ),

  governance as (
    select debt_limit_name,
    ARRAY_AGG(liquidation_margin order by cast(block_height as int64) desc)[safe_offset(0)] liquidation_margin
    from vault_manager_governance
    group by debt_limit_name
  ),

  add_prices as (
    select v.*,
           cast(p.last_oracle_price as float64) last_oracle_price
    from active_vaults v
    left join
    last_oracle_prices p
    on v.locked_type_name = p.type_in_name
  ), final_rows as (
    select cast(a.block_height as int) as height,
           a.vault_ix,
           a.locked_type_name collateral_type,
           a.collateral_amount,
           a.last_oracle_price current_collateral_price,
           a.collateral_amount*a.last_oracle_price collateral_oracle_usd_value,
           a.ist_debt_amount,
           g.liquidation_margin,
           coalesce(SAFE_DIVIDE(a.ist_debt_amount*g.liquidation_margin, a.collateral_amount), 0) liquidation_price,
           coalesce(SAFE_DIVIDE(a.last_oracle_price, ( a.ist_debt_amount*g.liquidation_margin/a.collateral_amount) - 1), 0) liquidation_cushion
    from
    add_prices a
    left join
    governance g
    on a.debt_type_name = g.debt_limit_name
  )
  select *
       , coalesce(SAFE_DIVIDE(collateral_oracle_usd_value, ist_debt_amount), 0) as collateralization_ratio
  from final_rows
);
