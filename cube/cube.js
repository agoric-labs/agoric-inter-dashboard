module.exports = {
  contextToAppId: ({ securityContext }) => `CUBEJS_APP_${securityContext.dataset}`,

  contextToOrchestratorId: ({ securityContext }) => `CUBEJS_APP_${securityContext.dataset}`,

  driverFactory: ({ securityContext }) => ({
    type: 'bigquery',
    dataset: securityContext.dataset,
  }),
};
