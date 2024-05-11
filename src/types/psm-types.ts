export type PsmMetricsNode = {
  id: string;
  denom: string;
};

export type PsmMetricsDailyNode = {
  id: string;
  denom: string;
  dateKey: number;
  blockTimeLast: string;
  totalMintedProvidedLast: number;
};

export type PsmMetricsResponse = {
  psmMetrics: {
    nodes: Array<PsmMetricsNode>;
  };
};
export type PsmMetricsDailyResponse = {
  [key: string]: {
    nodes: Array<PsmMetricsDailyNode>;
  };
};
export type GraphData = { key: number; x: string };
