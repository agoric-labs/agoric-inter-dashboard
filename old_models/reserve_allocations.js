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
    ['amount', 'usd_rate'],
    ['brand', 'key'],
    `
    select block_time -- for dailySQL
         , json_value(alloc, '$.data.__brand') as brand
         , json_value(alloc, '$.key') as key
         , cast(json_value(alloc, '$.data.__value') as float64) / pow(10, 6) as amount
         , coalesce(p.type_out_amount / p.type_in_amount, 1) as usd_rate -- 1 for ist without the oracle feed
      from ${state_changes.sql()} c
      cross join unnest(agoric_mainnet.extract_allocations(to_json_string(json_query(body, '$.allocations')))) alloc
      left join ${oracle_prices.sql()} p on p.day = date_trunc(c.block_time, day) and p.price_feed_name like concat(json_value(alloc, '$.data.__brand'), '%')
     where path = 'published.reserve.metrics'
  `,
  ),

  measures: {
    usd_rate_avg: {
      sql: `usd_rate`,
      type: `avg`,
    },
    amount_avg: {
      sql: `amount`,
      type: `avg`,
    },
    amount_usd_avg: {
      sql: `amount * usd_rate`,
      type: `avg`,
      title: `Amount USD Avg`,
    },
    amount_usd_sum: {
      sql: `amount * usd_rate`,
      type: `sum`,
      title: `Amount USD Sum`,
    },
  },

  dimensions: {
    brand: {
      sql: `brand`,
      type: `string`,
    },
    key: {
      sql: `key`,
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main_year: {
      measures: [
        usd_rate_avg,
        amount_avg,
        amount_usd_avg,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `year`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    main_month: {
      measures: [
        usd_rate_avg,
        amount_avg,
        amount_usd_avg,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `month`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    main_week: {
      measures: [
        usd_rate_avg,
        amount_avg,
        amount_usd_avg,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `week`,
      refresh_key: {
        every: `24 hour`,
      },
    },
    main_day: {
      measures: [
        usd_rate_avg,
        amount_avg,
        amount_usd_avg,
      ],
      dimensions: [brand, key],
      time_dimension: day,
      granularity: `day`,
      refresh_key: {
        every: `1 hour`,
      },
    },
    stats_year: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_month: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_week: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    stats_day: {
      measures: [amount_usd_sum],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
