import { dailySQL } from '../utils';

cube(`reserve`, {
  sql: dailySQL(['atom_amount', 'fee_amount', 'shortfall_balance', 'total_fee_burned', 'total_fee_minted', 'atom_price_usd'], [], `
    with coingecko_history as (
      select day, array_agg(current_price_usd order by _sdc_received_at desc)[0] as current_price_usd
        from ${coingecko_history.sql()}
       where coin_id = 'cosmos'
       group by 1
    )
    select block_time -- for dailySQL
         , coalesce(cast(json_value(body, '$.allocations.ATOM.__value') as float64) / pow(10, 6), 0) as atom_amount
         , coalesce(cast(json_value(body, '$.allocations.Fee.__value') as float64) / pow(10, 6), 0) as fee_amount
         , cast(json_value(body, '$.shortfallBalance.__value') as float64) / pow(10, 6) as shortfall_balance
         , cast(json_value(body, '$.totalFeeBurned.__value') as float64) / pow(10, 6) as total_fee_burned
         , cast(json_value(body, '$.totalFeeMinted.__value') as float64) / pow(10, 6) as total_fee_minted
         , cast(coalesce(ch.current_price_usd) as float64) as atom_price_usd
      from ${state_changes.sql()}
      left join coingecko_history ch on extract(date from ch.day) = extract(date from block_time)
     where path = 'published.reserve.metrics'
  `),

  measures: {
    atom_amount_avg: {
      sql: `atom_amount`,
      type: `avg`,
    },
    atom_amount_usd_avg: {
      sql: `atom_amount * atom_price_usd`,
      type: `avg`,
      title: `ATOM $`,
    },
    fee_amount_avg: {
      sql: `fee_amount`,
      type: `avg`,
      title: `IST Fees`,
    },
    shortfall_balance_avg: {
      sql: `shortfall_balance`,
      type: `avg`,
    },
    total_fee_minted_avg: {
      sql: `total_fee_minted`,
      type: `avg`,
    },
    total_fee_burned_avg: {
      sql: `total_fee_burned`,
      type: `avg`,
    },
    total_usd_avg: {
      sql: `fee_amount + atom_amount * atom_price_usd`,
      type: `avg`,
    },
  },

  dimensions: {
    day: {
      sql: `day`,
      type: `time`,
      primary_key: true,
      public: true,
    },
  },

  pre_aggregations: {
    main: {
      measures: [
        atom_amount_avg,
        fee_amount_avg,
        shortfall_balance_avg,
        total_fee_minted_avg,
        total_fee_burned_avg,
        atom_amount_usd_avg,
        total_usd_avg,
      ],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
