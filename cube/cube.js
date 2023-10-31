const dataset = process.env.DATASET_ID;
const paPrefix = process.env.APP_ENV || 'dev';

module.exports = {
  // disable built-in security
  checkAuth: (req, auth) => {
    req.securityContext = {};
    return {};
  },

  contextToAppId: () => `CUBEJS_APP_${dataset}`,

  contextToOrchestratorId: () => `CUBEJS_APP_${dataset}`,

  preAggregationsSchema: () => `pre_aggregations_${dataset}_${paPrefix}`,

  basePath: `/cubejs-api/${process.env.DATASET_ID.replace('v2_', '')}`,

  scheduledRefreshContexts: async () => [{}],
};
