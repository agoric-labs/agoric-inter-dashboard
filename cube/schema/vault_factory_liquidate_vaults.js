import { dailySQL } from '../utils';

cube(`vault_factory_liquidate_vaults`, {
  sql: dailySQL(
    [
      'state',
      'collateral_amount',
      'active_collateral_amount',
      'liquidating_collateral_amount',
      'liquidating_debt_amount',
      'liquidating_enter_time',
      'liquidating_rate',
      'liquidated_enter_time',
      'liquidated_collateral_amount',
      'debt_amount',
      'block_time',
    ],
    ['manager_idx', 'vault_idx', 'collateral_type', 'debt_type'],
    `
      with vault_data as (
        select path
             , json_value(body, '$.vaultState') as state
             , block_time
             , cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) collateral_amount
             , cast(json_value(body, '$.debtSnapshot.debt.__value') as float64) / pow(10, 6) debt_amount
             , json_value(body, '$.locked.__brand') collateral_type
          from ${state_changes.sql()}
        where module = 'published.vaultFactory'
          and split(path, '.')[safe_offset(2)] = 'managers'
          and split(path, '.')[safe_offset(4)] = 'vaults'
      ),

      vault_last_states as (
        select path
             , array_agg(state order by block_time desc)[safe_offset(0)] as state
          from vault_data
         group by 1
      ),

      vault_states as (
        select path, state, collateral_type
             , min(block_time) as enter_time
             , max(block_time) as leave_time
             , array_agg(collateral_amount order by block_time desc)[0] last_collateral_amount
             , array_agg(debt_amount order by block_time desc)[0] last_debt_amount
         from vault_data
        group by 1, 2, 3
      ),

      vault_states_with_rates as (
        select vs.*
             , coalesce(type_out_amount / type_in_amount, 1) as rate
          from vault_states vs
          left join ${oracle_prices.sql()} op on op.day = date_trunc(vs.leave_time, DAY) and concat(vs.collateral_type, '-USD_price_feed') = op.price_feed_name
      )

      select block_time
           , replace(split(sc.path, '.')[3], 'manager', '') as manager_idx
           , replace(split(sc.path, '.')[5], 'vault', '') as vault_idx
           , json_value(body, '$.locked.__brand') collateral_type
           , json_value(body, '$.debtSnapshot.debt.__brand') debt_type
           , json_value(body, '$.vaultState') as state
           , cast(json_value(body, '$.locked.__value') as float64) / pow(10, 6) collateral_amount
           , cast(json_value(body, '$.debtSnapshot.debt.__value') as float64) / pow(10, 6) debt_amount
           , active_state.last_collateral_amount as active_collateral_amount
           , liquidating_state.last_collateral_amount as liquidating_collateral_amount
           , liquidating_state.last_debt_amount as liquidating_debt_amount
           , liquidating_state.rate as liquidating_rate
           , liquidating_state.enter_time as liquidating_enter_time
           , liquidated_state.enter_time as liquidated_enter_time
           , liquidated_state.last_collateral_amount as liquidated_collateral_amount
       from ${state_changes.sql()} sc
       join vault_states_with_rates active_state on sc.path = active_state.path and active_state.state = 'active'
       join vault_states_with_rates liquidating_state on sc.path = liquidating_state.path and liquidating_state.state = 'liquidating'
       left join vault_states_with_rates liquidated_state on sc.path = liquidated_state.path and liquidated_state.state = 'liquidated'
      where module = 'published.vaultFactory'
        and sc.path in (select path from vault_last_states where state in ('liquidating', 'liquidated'))
    `,
  ),

  joins: {
    vault_factory_governance: {
      relationship: `one_to_one`,
      sql: `${CUBE.manager_idx} = ${vault_factory_governance.manager_idx} and date_trunc(${CUBE}.liquidating_enter_time, DAY) = ${vault_factory_governance.day}`,
    },
    oracle_prices: {
      relationship: `one_to_one`,
      sql: `${CUBE}.day = ${oracle_prices}.day and concat(${CUBE}.collateral_type, '-USD_price_feed') = ${oracle_prices}.price_feed_name`,
    },
  },

  measures: {
    liquidating_rate: {
      sql: `array_agg(liquidating_rate order by ${CUBE}.day desc)[0]`,
      type: `number`,
    },
    liquidating_enter_time: {
      sql: `array_agg(liquidating_enter_time order by ${CUBE}.day desc)[0]`,
      type: `time`,
    },
    liquidated_enter_time: {
      sql: `array_agg(liquidated_enter_time order by ${CUBE}.day desc)[0]`,
      type: `time`,
    },
    liquidating_duration: {
      sql: `array_agg(liquidating_duration order by ${CUBE}.day desc)[0]`,
      type: `number`,
    },
    liquidated_return_amount_avg: {
      sql: `liquidating_collateral_amount - liquidated_collateral_amount`,
      type: `avg`,
    },
    liquidated_return_amount_usd_avg: {
      sql: `(liquidating_collateral_amount - liquidated_collateral_amount) * liquidating_rate`,
      type: `avg`,
    },
    liquidated_count: {
      sql: `vault_idx`,
      type: `count`,
      filters: [{ sql: `${CUBE}.state = 'liquidated'` }],
    },
    last_state: {
      sql: `array_agg(${CUBE}.state order by ${CUBE}.day desc)[0]`,
      type: `string`,
    },
    active_collateral_amount_avg: {
      sql: `active_collateral_amount`,
      type: `avg`,
    },
    liquidating_debt_amount_avg: {
      sql: `liquidating_debt_amount`,
      type: `avg`,
    },
    liquidating_collateral_amount_avg: {
      sql: `liquidating_collateral_amount`,
      type: `avg`,
    },
    liquidating_collateral_amount_usd_avg: {
      sql: `liquidating_collateral_amount * liquidating_rate`,
      type: `avg`,
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
});
