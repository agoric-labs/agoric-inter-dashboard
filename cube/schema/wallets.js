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
    main1: {
      measures: [address_count],
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});