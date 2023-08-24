import { dailySQL } from '../utils';

cube(`wallet_purses`, {
  sql: dailySQL(
    ['amount'],
    ['address', 'brand'],
    `
     select block_time
          , split(path, '.')[2] as address
          , json_value(p, '$.__brand') as brand
          , cast(json_value(p, '$.balance.__value') as int) / pow(10, 6) as amount
      from ${state_changes.sql()}
     cross join unnest(json_extract_array(body, '$.purses')) p
     where path like 'published.wallet%'and path like '%current'
  `,
  ),

  measures: {
    address_count: {
      sql: `address`,
      type: `countDistinct`,
    },
    amount_avg: {
      sql: `amount`,
      type: `avg`,
    },
    amount_sum: {
      sql: `amount`,
      type: `sum`,
    },
  },

  dimensions: {
    address: {
      sql: `address`,
      type: `string`,
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
    main: {
      measures: [amount_sum, amount_avg, address_count],
      dimensions: [brand, address],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
