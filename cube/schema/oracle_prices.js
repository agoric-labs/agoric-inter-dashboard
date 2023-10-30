import { dailySQL, isDev, datasetId } from '../utils';

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
     where module = 'published.priceFeed'
       -- and ${FILTER_PARAMS.oracle_prices.day.filter('block_time')}
       and path like 'published.priceFeed.%_price_feed'
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
      sql: `${CUBE.rate}`,
      type: `avg`,
    },
    rate_last: {
      sql: `array_agg(${CUBE.rate} order by ${CUBE.day})[0]`,
      type: `number`,
    },
    // a fake measure for joins
    rate: {
      sql: `coalesce(type_out_amount / type_in_amount, 1)`,
      type: `number`,
      public: false,
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

  pre_aggregations: isDev
    ? {}
    : {
        by_price_feed_name_year: {
          measures: [rate_avg],
          dimensions: [price_feed_name],
          time_dimension: day,
          granularity: `year`,
          refresh_key: {
            every: '1 day',
          },
        },
        by_price_feed_name_month: {
          measures: [rate_avg],
          dimensions: [price_feed_name],
          time_dimension: day,
          granularity: `month`,
          refresh_key: {
            every: '1 day',
          },
        },
        by_price_feed_name_week: {
          measures: [rate_avg],
          dimensions: [price_feed_name],
          time_dimension: day,
          granularity: `week`,
          refresh_key: {
            every: '1 day',
          },
        },
        by_price_feed_name_day: {
          measures: [rate_avg],
          dimensions: [price_feed_name],
          time_dimension: day,
          granularity: `day`,
          partition_granularity: `day`,
          refresh_key: {
            every: `10 minutes`,
            incremental: true,
            update_window: `1 day`,
          },
          build_range_start: {
            sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.priceFeed'`,
          },
          build_range_end: {
            sql: `select current_timestamp()`,
          },
        },
      },
});
