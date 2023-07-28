import { datasetId } from '../utils';

cube('block_times', {
  sql: `
    select cast(anchor_id as int) as height
         , parse_timestamp('%Y-%m-%dT%H:%M:%E*S%Ez', value) as value
      from ${datasetId()}.block_time_string attr
     union all
    select cast(height as int)
         , parse_timestamp('%Y-%m-%dT%H:%M:%E*S%Ez', time) as value
      from ${datasetId()}.old_block_times
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
