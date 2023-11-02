const dataset = process.env.DATASET_ID;
const paPrefix = process.env.APP_ENV || 'dev';

// v2_agoric_mainnet_3 -> agoric_mainnet
const subPath = process.env.DATASET_ID.replace(/^v\d+_/, '').replace(/_\d+$/, '');

module.exports = {
  // disable built-in security
  checkAuth: (req, auth) => {
    req.securityContext = {};
    return {};
  },

  contextToAppId: () => `CUBEJS_APP_${dataset}`,

  contextToOrchestratorId: () => `CUBEJS_APP_${dataset}`,

  preAggregationsSchema: () => `pre_aggregations_${dataset}_${paPrefix}`,

  basePath: `/cubejs-api/${subPath}`,
  webSocketsBasePath: `/cubejs-api/${subPath}/v1/load/websocket`,

  scheduledRefreshContexts: async () => [{}],
};
