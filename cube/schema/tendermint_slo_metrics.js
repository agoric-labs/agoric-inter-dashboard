import { datasetId } from '../utils';

cube(`head_tendermint_slo_metrics`, {
  sql: `
    select _sdc_batched_at as extracted_at
         , lastest_block_height as db_latest_block_height
         , cast(json_value(node_status, '$.sync_info.latest_block_height') as float64) as status_latest_block_height
      from $$DATASET$$.tendermint_slo_metrics
     where section = 3
  `,

  measures: {
    max_db_latest_block_height: {
      sql: `db_latest_block_height`,
      type: `max`,
    },
    max_status_latest_block_height: {
      sql: `status_latest_block_height`,
      type: `max`,
    },
    max_latest_block_height_diff: {
      sql: `status_latest_block_height - db_latest_block_height`,
      type: `max`,
    },
  },

  dimensions: {
    extracted_at: {
      sql: `extracted_at`,
      type: `time`,
    },
  },

  pre_aggregations: {
    main: {
      measures: [max_db_latest_block_height, max_status_latest_block_height, max_latest_block_height_diff],
      time_dimension: extracted_at,
      granularity: `hour`,
      refreshKey: {
        every: `1 hour`,
      },
    },
  },
});
