export type OraclePriceNode = {
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
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
