export type OraclePriceNode = {
  id: string;
<<<<<<< HEAD
  dateKey: number;
  blockTimeLast: string;
  typeInName: string;
  priceFeedName?: string;
  typeInAmount?: string | number;
  typeInAmountLast?: string | number;
  typeOutAmount?: string | number;
  typeOutAmountLast?: string | number;
=======
  dateKey: string;
  blockTimeLast: string;
  typeInName: string;
  priceFeedName: string;
  typeInAmount: number;
  typeInAmountLast: number;
  typeOutAmount: number;
  typeOutAmountLast: number;
>>>>>>> 9294c54 (chore: add type for vault metrics response)
};

export type VaultManagerMetricsNode = {
  id: string;
<<<<<<< HEAD
  dateKey: number;
  liquidatingCollateralBrand: string;
  blockTimeLast: string;
  totalCollateral?: number;
  totalDebt?: number;
  totalCollateralLast?: string;
  metricsCount?: string;
  totalDebtLast?: string;
  numActiveVaults?: number;
=======
  dateKey: string;
  liquidatingCollateralBrand: string;
  blockTimeLast: string;
  totalCollateral: number;
  totalDebt: number;
  totalCollateralLast: number;
  metricsCount: number;
  totalDebtLast: number;
  numActiveVaults: number;
>>>>>>> 9294c54 (chore: add type for vault metrics response)
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
  };
  oraclePriceDailies: { nodes: Array<OraclePriceDailiesNode> };
};

export type VaultDailyMetricsQueryResponse = {
  [key: string]: {
<<<<<<< HEAD
    nodes: Array<VaultManagerMetricsNode | OraclePriceNode>;
=======
    nodes: Array<VaultManagerMetricsNode>;
  };
} & {
  [key in `${string}_oracle`]: {
    nodes: Array<OraclePriceNode>;
>>>>>>> 9294c54 (chore: add type for vault metrics response)
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
