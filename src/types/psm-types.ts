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

export type Metadata = {
  lastProcessedHeight: number;
};
export type PsmMetricNode = {
  blockHeight: string;
  denom: string;
  mintedPoolBalance: string;
};

export type PsmGovernanceNode = {
  mintLimit: string;
  denom: string;
};

export type BoardAuxesNode = { allegedName: string; decimalPlaces: number };

export type PSMDashboardResponse = {
  _metadata: Metadata;
  psmMetrics: {
    nodes: Array<PsmMetricNode>;
  };
  psmGovernances: {
    nodes: Array<PsmGovernanceNode>;
  };
  boardAuxes: { nodes: Array<BoardAuxesNode> };
};
