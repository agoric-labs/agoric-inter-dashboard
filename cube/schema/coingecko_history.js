import { datasetId } from '../utils';

cube(`coingecko_history`, {
  // we collect coingecko_history only in the agoric_mainnet
  sql: `
    select cast(day as timestamp) day
         , cast(current_price_usd as decimal) current_price_usd
         , coin_id
         , _sdc_received_at
      from agoric_mainnet.coingeko_history
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
      type: `string`,
    },
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main_year: {
      measures: [current_price_usd_last, current_price_usd_avg],
      dimensions: [coin_id],
      time_dimension: day,
      granularity: `year`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_month: {
      measures: [current_price_usd_last, current_price_usd_avg],
      dimensions: [coin_id],
      time_dimension: day,
      granularity: `month`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_week: {
      measures: [current_price_usd_last, current_price_usd_avg],
      dimensions: [coin_id],
      time_dimension: day,
      granularity: `week`,
      refreshKey: {
        every: `24 hour`,
      },
    },
    main_day: {
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
