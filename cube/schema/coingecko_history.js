import { datasetId } from '../utils';

cube(`coingecko_history`, {
  sql: `
    select cast(day as timestamp) day
         , cast(current_price_usd as decimal) current_price_usd
         , coin_id
         , _sdc_received_at
      from ${datasetId()}.coingeko_history
  `,

  measures: {
    current_price_usd_last: {
      sql: `array_agg(current_price_usd order by _sdc_received_at desc)[0]`,
      type: `number`,
    },
    current_price_usd_avg: {
      sql: `current_price_usd`,
      type: `avg`,
    },
  },

  dimensions: {
    coin_id: {
      sql: `coin_id`,
      type: `string`
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [current_price_usd_last, current_price_usd_avg],
      dimensions: [coin_id],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
