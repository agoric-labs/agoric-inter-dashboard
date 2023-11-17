import { datasetId } from '../utils';

cube(`blocks`, {
  sql_table: `${datasetId()}.blocks`,

  measures: {
    block_height_max: {
      sql: `block_height`,
      type: `max`,
    },
  },

  dimensions: {
    block_time: {
      sql: `block_time`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [block_height_max],
      time_dimension: block_time,
      granularity: `day`,
      refresh_key: {
        every: `15 minute`,
      },
    },
  },
});
