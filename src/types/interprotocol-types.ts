export type OraclePriceNode = {
  priceFeedName: string;
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
};
export type PsmGovernancesNode = { denom: string; mintLimit: number };
export type PsmMetricsNode = { denom: string; anchorPoolBalance: number; mintedPoolBalance: number };
export type AllocationsNode = { id: string; denom: string; value: number };
export type ReserveMetricsNode = {
  allocations: { nodes: Array<AllocationsNode> };
  shortfallBalance: number;
  totalFeeBurned: number;
};
export type VaultManagerGovernancesNode = {
  id: string;
  debtLimit: number;
};
export type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralBrand: string;
  liquidatingDebtBrand: string;
  totalCollateral: number;
  totalDebt: number;
};
export type BoardAuxesNode = { allegedName: string; decimalPlaces: number };

export type InterProtocolResponse = {
  oraclePrices: { nodes: Array<OraclePriceNode> };
  psmGovernances: { nodes: Array<PsmGovernancesNode> };
  psmMetrics: { nodes: Array<PsmMetricsNode> };
  reserveMetrics: { nodes: Array<ReserveMetricsNode> };
  vaultManagerGovernances: {
    nodes: Array<VaultManagerGovernancesNode>;
  };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
  wallets: { totalCount: number };
  boardAuxes: { nodes: Array<BoardAuxesNode> };
};

export type Balance = {
  denom: string;
  amount: string;
};

export type AccountData = {
  channel_id: string;
  address: string;
  balance: Balance[];
};
