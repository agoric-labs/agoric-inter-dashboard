import { datasetId } from '../utils';

cube('block_times', {
  sql: `
    select block_height as height
         , block_time as value
      from ${datasetId()}.blocks
  `,

  measures: {
    last_height: {
      sql: `height`,
      type: `max`,
    },
  },

  dimensions: {
    height: {
      sql: `height`,
      type: `number`,
      primary_key: true,
    },
    value: {
      sql: `value`,
      type: `time`,
    },
  },
});
