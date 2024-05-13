export type OraclePriceNode = { priceFeedName: string; typeInAmount: number; typeOutAmount: number };

export type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralBrand: string;
  numActiveVaults: number;
  totalCollateral: number;
  totalDebt: number;
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
  };
  oraclePriceDailies: { nodes: Array<OraclePriceDailiesNode> };
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
