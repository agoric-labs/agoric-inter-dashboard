export type OraclePriceNode = {
  id: string;
  dateKey: number;
  blockTimeLast: string;
  typeInName: string;
  priceFeedName?: string;
  typeInAmount?: string | number;
  typeInAmountLast?: string | number;
  typeOutAmount?: string | number;
  typeOutAmountLast?: string | number;
};

export type VaultManagerMetricsNode = {
  id: string;
  dateKey: number;
  liquidatingCollateralBrand: string;
  blockTimeLast: string;
  totalCollateral?: number;
  totalDebt?: number;
  totalCollateralLast?: string;
  metricsCount?: string;
  totalDebtLast?: string;
  numActiveVaults?: number;
};

export type DailyOracles = {
  [dateKey: string]: OraclePriceNode;
};

export type VaultsNode = {
  balance: number;
  debt: number;
  id: string;
  state: string;
  denom: string;
};

export type VaultManagerGovernancesNode = {
  id: string;
  liquidationMarginDenominator: number;
  liquidationMarginNumerator: number;
  debtLimit: number;
};

export type OraclePriceDailiesNode = {
  priceFeedName: string;
  typeInName: string;
  dateKey: number;
  typeInAmountLast: number;
  typeOutAmountLast: number;
};

export type BoardAuxesNode = { allegedName: string; decimalPlaces: number };

export type VaultsDashboardResponse = {
  boardAuxes: { nodes: Array<BoardAuxesNode> };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
  vaultManagerGovernances: { nodes: Array<VaultManagerGovernancesNode> };
  vaults: {
    nodes: Array<VaultsNode>;
    totalCount: number;
  };
  oraclePriceDailies: { nodes: Array<OraclePriceDailiesNode> };
};

export type VaultDailyMetricsQueryResponse = {
  [key: string]: {
    nodes: Array<VaultManagerMetricsNode | OraclePriceNode>;
  };
};

export type OraclePriceDailiesArr = {
  oracleDailyPrices: Array<OraclePriceDailiesNode>;
};

export type OraclePriceNodesData = { [key: string]: OraclePriceNode };
export type OracleDailyPriceNodesData = { [key: string]: OraclePriceDailiesNode[] };
export type VaultManagerGovernancesNodesData = { [key: string]: VaultManagerGovernancesNode };

export type VaultsDashboardData = {
  [key: string]: VaultManagerMetricsNode & OraclePriceNode & VaultManagerGovernancesNode & OraclePriceDailiesArr;
};

export type OpenVaultsData = Array<VaultsNode & OraclePriceNode & VaultManagerGovernancesNode>;