export type OraclePriceNode = {
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
};

export type ReserveAllocationMetricsDailyNode = {
  id: string;
  blockTimeLast: string;
  dateKey: number;
  valueLast: number;
  denom: string;
};

export type GraphData = { key: number; x: string; [key: string]: any };

export type ReserveAllocationMetricsDaily = {
  [key: string]: ReserveAllocationMetricsDailyNode;
};

export type AllocationsNode = { id: string; denom: string; value: number };
export type ReserveMetricsNode = {
  allocations: { nodes: Array<AllocationsNode> };
  shortfallBalance: number;
};
export type ReserveDashboardResponse = {
  oraclePrices: { nodes: Array<OraclePriceNode> };
  reserveMetrics: { nodes: Array<ReserveMetricsNode> };
};
export type ReserveDashboardData = Array<{
  shortfallBalance: number;
  allocations: { [key: string]: AllocationsNode & OraclePriceNode };
}>;

export type ReserveManagerMetricsResponse = {
  reserveMetrics: { nodes: Array<ReserveMetricsNode> };
};
