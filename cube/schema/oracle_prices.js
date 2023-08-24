import { dailySQL } from '../utils';

cube(`oracle_prices`, {
  sql: dailySQL(
    ['type_in_amount', 'type_out_amount'],
    ['price_feed_name'],
    `
     select block_time
          , split(path, 'published.priceFeed.')[safe_offset(1)] price_feed_name
          , regexp_extract(split(path, 'published.priceFeed.')[safe_offset(1)], r'^(\\w+)-') type_in_name
          , cast(json_value(body, '$.amountIn.__value') as float64) type_in_amount
          , regexp_extract(split(path, 'published.priceFeed.')[safe_offset(1)], r'-(\\w+?)_') type_out_name
          , cast(json_value(body, '$.amountOut.__value') as float64) type_out_amount
     from ${state_changes.sql()}
     where path like 'published.priceFeed.%_price_feed'
  `,
  ),

  measures: {
    type_in_amount_avg: {
      sql: `type_in_amount`,
      type: `avg`,
    },
    type_out_amount_avg: {
      sql: `type_out_amount`,
      type: `avg`,
    },
    rate_avg: {
      sql: `type_out_amount / type_in_amount`,
      type: `avg`,
    },
  },

  dimensions: {
    id: {
      sql: `concat(day, price_feed_name)`,
      type: `string`,
      primary_key: true,
    },
    price_feed_name: {
      sql: `price_feed_name`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [rate_avg],
      dimensions: [price_feed_name],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
