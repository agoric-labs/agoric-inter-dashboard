import { datasetId, dailySQL } from '../utils';

// liquidated + liquidated
cube('liquidated_vaults', {
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
      'liquidating_start_time',
      'liquidated_time',
    ],
    ['vault_ix', 'debt_type_name', 'collateral_type', 'vault_state'],
    `
      with vault_factory_vaults as (
      select block_height,
             block_time,
             path as vault_ix, -- manager id + vault id

             json_value(body, '$.debtSnapshot.debt.__brand') debt_type_name,
             cast(json_value(body, '$.debtSnapshot.debt.__value') as float64) / pow(10, 6) debt_value,

             cast(json_value(body, '$.debtSnapshot.interest.numerator.__value') as float64) /
             cast(json_value(body, '$.debtSnapshot.interest.denominator.__value') as float64) / pow(10, 6) interest,


             json_value(body, '$.locked.__brand') locked_type_name,
             cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) locked_value,

             json_value(body, '$.vaultState') vault_state
      from ${state_changes.sql()}
      where path like 'published.vaultFactory.managers.manager%'
        and split(path, '.')[safe_offset(4)] = 'vaults'
    ),

    vaults_statuses as (
      select vault_ix, vault_state
           , ARRAY_AGG(block_time order by block_height)[safe_offset(0)] as switch_time
        from vault_factory_vaults
       group by 1, 2
    ),

    vault_last_states as (
      select vault_ix
           , ARRAY_AGG(vault_state order by switch_time desc)[safe_offset(0)] as vault_state
        from vaults_statuses
       group by 1
    ),

    active_vaults as (
      select v.vault_ix,
             array_agg(v.block_height order by block_height desc)[safe_offset(0)] as block_height,
             array_agg(v.locked_type_name order by block_height desc)[safe_offset(0)] as locked_type_name,
             array_agg(v.debt_type_name order by block_height desc)[safe_offset(0)] as debt_type_name,
             cast(ARRAY_AGG(locked_value order by block_height desc)[safe_offset(0)] as float64) collateral_amount,
             cast(ARRAY_AGG(debt_value order by block_height desc)[safe_offset(0)] as float64) ist_debt_amount,
             cast(array_agg(in_process_s.switch_time)[0] as timestamp) liquidating_start_time,
             cast(array_agg(done_s.switch_time)[0] as timestamp) liquidated_time,
             array_agg(v.vault_state order by block_height desc)[safe_offset(0)] as vault_state
      from vault_factory_vaults v
      join vaults_statuses in_process_s on in_process_s.vault_ix = v.vault_ix and in_process_s.vault_state = 'liquidating'
      left join vaults_statuses done_s on done_s.vault_ix = v.vault_ix and done_s.vault_state = 'liquidated'
      where v.vault_ix in (select vault_ix from vault_last_states where vault_state in ('liquidated', 'liquidating'))
      group by vault_ix
    ),

    oracle_prices as (
      select block_height,
             split(path, 'published.priceFeed.')[safe_offset(1)] price_feed_name,
             json_value(body, '$.timestamp.__absValue') timestamp,
             regexp_extract(split(path, 'published.priceFeed.')[safe_offset(1)], r'^(\\w+)-') type_in_name,
             json_value(body, '$.amountIn.__value') type_in_amount,
             regexp_extract(split(path, 'published.priceFeed.')[safe_offset(1)], r'-(\\w+?)_') type_out_name,
             json_value(body, '$.amountOut.__value') type_out_amount
      from ${state_changes.sql()}
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
      unnest(generate_array((select greatest(min(block_height), max(block_height) - pow(10, 6)) from ${state_changes.sql()}),
                            (select max(block_height) from ${state_changes.sql()}), 1)) block_height
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
      select block_height
           , json_value(body, '$.current.DebtLimit.value.__brand') debt_limit_name
           , json_value(body, '$.current.DebtLimit.value.__value') debt_limit_value
           , cast(json_value(body, '$.current.InterestRate.value.numerator.__value') as int64)/cast(json_value(body, '$.current.InterestRate.value.denominator.__value') as int64) interest_rate
           , cast(json_value(body, '$.current.LiquidationMargin.value.numerator.__value') as int64)/cast(json_value(body, '$.current.LiquidationMargin.value.denominator.__value') as int64) liquidation_margin
      from ${state_changes.sql()}
      where path like 'published.vaultFactory.managers.manager%'
        and split(path, '.')[safe_offset(4)] = 'governance'
    ),

    governance as (
      select debt_limit_name
           , ARRAY_AGG(liquidation_margin order by cast(block_height as int64) desc)[safe_offset(0)] liquidation_margin
      from vault_manager_governance
      group by 1
    ),

    add_prices as (
      select v.*,
             cast(p.last_oracle_price as float64) last_oracle_price
      from active_vaults v
      left join last_oracle_prices p on v.locked_type_name = p.type_in_name
    ),

    final_rows as (
      select b.block_time,
             cast(a.block_height as int) as height,
             vault_state,
             a.debt_type_name,
             a.vault_ix,
             a.locked_type_name collateral_type,
             a.collateral_amount,
             a.last_oracle_price current_collateral_price,
             a.collateral_amount*a.last_oracle_price collateral_oracle_usd_value,
             a.ist_debt_amount,
             g.liquidation_margin,
             liquidating_start_time,
             liquidated_time,
             coalesce(SAFE_DIVIDE(a.ist_debt_amount*g.liquidation_margin, a.collateral_amount), 0) liquidation_price,
             coalesce(SAFE_DIVIDE(a.last_oracle_price, coalesce(SAFE_DIVIDE(a.ist_debt_amount * g.liquidation_margin, a.collateral_amount), 0) - 1), 0) liquidation_cushion
      from add_prices a
      join ${state_changes.sql()} b using (block_height)
      left join governance g on a.debt_type_name = g.debt_limit_name
    )
    select *
         , coalesce(SAFE_DIVIDE(collateral_oracle_usd_value, ist_debt_amount), 0) as collateralization_ratio
    from final_rows
    `,
  ),

  measures: {
    count: {
      sql: `vault_ix`,
      type: `countDistinct`,
    },
    liquidating_start_time: {
      sql: `max(unix_seconds(liquidating_start_time))`,
      type: `number`,
    },
    liquidated_time: {
      sql: `max(unix_seconds(liquidated_time))`,
      type: `number`,
    },
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
      type: `string`,
    },
    vault_state: {
      sql: `vault_state`,
      type: `string`,
    },
    collateral_type: {
      sql: `collateral_type`,
      type: `string`,
    },
    debt_type: {
      sql: `debt_type_name`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main_year2: {
      measures: [
        collateral_amount,
        current_collateral_price,
        collateral_oracle_usd_value,
        ist_debt_amount,
        liquidation_margin,
        liquidation_price,
        liquidation_cushion,
        collateralization_ratio,
        liquidating_start_time,
        liquidated_time,
      ],
      dimensions: [collateral_type, vault_ix, debt_type, vault_state],
      timeDimension: day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_month2: {
      measures: [
        collateral_amount,
        current_collateral_price,
        collateral_oracle_usd_value,
        ist_debt_amount,
        liquidation_margin,
        liquidation_price,
        liquidation_cushion,
        collateralization_ratio,
        liquidating_start_time,
        liquidated_time,
      ],
      dimensions: [collateral_type, vault_ix, debt_type, vault_state],
      timeDimension: day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_week2: {
      measures: [
        collateral_amount,
        current_collateral_price,
        collateral_oracle_usd_value,
        ist_debt_amount,
        liquidation_margin,
        liquidation_price,
        liquidation_cushion,
        collateralization_ratio,
        liquidating_start_time,
        liquidated_time,
      ],
      dimensions: [collateral_type, vault_ix, debt_type, vault_state],
      timeDimension: day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_day2: {
      measures: [
        collateral_amount,
        current_collateral_price,
        collateral_oracle_usd_value,
        ist_debt_amount,
        liquidation_margin,
        liquidation_price,
        liquidation_cushion,
        collateralization_ratio,
        liquidating_start_time,
        liquidated_time,
      ],
      dimensions: [collateral_type, vault_ix, debt_type, vault_state],
      timeDimension: day,
      granularity: `day`,
      refreshKey: {
        every: `10 minutes`,
      },
    },
    stats_year: {
      measures: [count],
      timeDimension: day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_month: {
      measures: [count],
      timeDimension: day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_week: {
      measures: [count],
      timeDimension: day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_day: {
      measures: [count],
      timeDimension: day,
      granularity: `day`,
      refreshKey: {
        every: `10 minutes`,
      },
    },
  },
});
