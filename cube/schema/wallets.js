import { datasetId } from '../utils';

cube(`wallets`, {
  sql: `
     select block_time
          , split(path, '.')[2] as address
      from ${state_changes.sql()}
     where path like 'published.wallet%'and path like '%current'
  `,

  measures: {
    address_count: {
      sql: `address`,
      type: `countDistinct`,
    },
  },

  dimensions: {
    day: {
      sql: `day`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [address_count],
      time_dimension: day,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
