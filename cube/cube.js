const { FileRepository } = require('@cubejs-backend/shared');

class ReplaceDatasetFileRepository extends FileRepository {
  constructor(dir, dataset) {
    super(dir);
    this.dataset = dataset;
  }

  async dataSchemaFiles(includeDependencie) {
    const files = await super.dataSchemaFiles(includeDependencie);

    files.forEach(f => {
      f.content = f.content.replace(/\$\$DATASET\$\$/g, this.dataset);
    });

    return files;
  }
}

if (!process.env.ALLOWED_DATASETS) {
  throw new Error('ALLOWED_DATASETS not set');
}

const allowedDatasets = process.env.ALLOWED_DATASETS.split(/,\s*/);

const defaultDataset = process.env.DEFAULT_DATASET || 'agoric_mainnet';
const paPrefix = process.env.NODE_ENV !== 'production' ? '_dev' : '';

module.exports = {
  // disable built-in security
  checkAuth: (req, auth) => {},

  contextToAppId: ({ dataset }) => `CUBEJS_APP_${dataset || defaultDataset}`,

  contextToOrchestratorId: ({ dataset }) => `CUBEJS_APP_${dataset || defaultDataset}`,

  preAggregationsSchema: ({ dataset }) =>
    `pre_aggregations_${dataset || defaultDataset}${paPrefix}`,

  repositoryFactory: ({ dataset }) => new ReplaceDatasetFileRepository('schema', dataset),

  extendContext: (req) => {
    const dataset = req.headers['x-dataset'] || defaultDataset;
    if (!allowedDatasets.includes(dataset)) {
      throw new Error('unexpected dataset');
    }

    return { dataset };
  },

  scheduledRefreshContexts: async () =>
    allowedDatasets.map(dataset => ({
      dataset,
    })),
};
