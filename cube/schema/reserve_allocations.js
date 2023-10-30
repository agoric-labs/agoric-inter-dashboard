import { dailySQL } from '../utils';

/*

CREATE FUNCTION agoric_mainnet.extract_allocations(input STRING)
RETURNS Array<JSON>
LANGUAGE js AS """
  var res = [];
  var data = JSON.parse(input);

  Object.keys(data).forEach(k => {
    res.push({
      key: k,
      data: data[k],
    });
  });

  return res;
""";

*/

cube(`reserve_allocations`, {
  sql: dailySQL(
    ['amount'],
    ['brand', 'key'],
    `
    select block_time -- for dailySQL
         , json_value(alloc, '$.data.__brand') as brand
         , json_value(alloc, '$.key') as key
         , cast(json_value(alloc, '$.data.__value') as float64) / pow(10, 6) as amount
      from ${state_changes.sql()} c
      cross join unnest(agoric_mainnet.extract_allocations(to_json_string(json_query(body, '$.allocations')))) alloc
     where module = 'published.reserve'
       and path = 'published.reserve.metrics'
       and ${FILTER_PARAMS.reserve_allocations.day.filter('block_time')}
  `,
  ),

  joins: {
    oracle_prices: {
      relationship: `one_to_one`,
      sql: `${CUBE}.day = ${oracle_prices}.day and concat(${CUBE.brand}, '-USD_price_feed') = ${oracle_prices}.price_feed_name`,
    },
  },

  measures: {
    amount_avg: {
      sql: `amount`,
      type: `avg`,
    },
    amount_usd_avg: {
      sql: `round(amount * ${oracle_prices.rate}, 6)`,
      type: `avg`,
      title: `Amount USD Avg`,
    },
    amount_usd_sum: {
      sql: `round(amount * ${oracle_prices.rate}, 6)`,
      type: `sum`,
      title: `Amount USD Sum`,
    },
  },

  dimensions: {
    key: {
      sql: `key`,
      type: `string`,
      primary_key: true,
      public: true,
    },
    brand: {
      sql: `brand`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    by_brand_and_key_year: {
      measures: [
        amount_avg,
        amount_usd_avg,
        amount_usd_sum,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_brand_and_key_month: {
      measures: [
        oracle_prices.rate_avg,
        amount_avg,
        amount_usd_avg,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_brand_and_key_week: {
      measures: [
        amount_avg,
        amount_usd_avg,
        amount_usd_sum,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `1 day`,
      },
    },
    by_brand_and_key_day: {
      measures: [
        amount_avg,
        amount_usd_avg,
        amount_usd_sum,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `day`,
      refresh_key: {
        every: `10 minutes`,
        incremental: true,
        update_window: `1 day`,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.reserve'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
    stats_year: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_month: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_week: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `1 day`,
      },
    },
    stats_day: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `day`,
      partition_granularity: `day`,
      refresh_key: {
        every: `10 minutes`,
        incremental: true,
        update_window: `1 day`,
      },
      build_range_start: {
        sql: `select min(block_time) from ${state_changes.sql()} where module = 'published.reserve'`,
      },
      build_range_end: {
        sql: `select current_timestamp()`,
      },
    },
  },
});
