export type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralValue: number;
  numActiveVaults: number;
  numLiquidatingVaults: number;
  numLiquidationsAborted: number;
  numLiquidationsCompleted: number;
};
export type VaultManagerGovernancesNode = {
  id: string;
  liquidationMarginDenominator: number;
  liquidationMarginNumerator: number;
};

export type VaultsNode = {
  balance: number;
  debt: number;
  id: string;
  state: string;
  denom: string;
  blockTime: string;
  currentState: string;
  liquidatingState: VaultLiquidationsNode;
};

export type VaultLiquidationsNode = {
  balance: number;
  debt: number;
  id: string;
  state: string;
  denom: string;
  blockTime: string;
  currentState: VaultsNode;
  liquidatingState: VaultLiquidationsNode;
  oraclePrice: {
    typeInAmount: string;
    typeOutAmount: string;
  };
  vaultManagerGovernance: {
    liquidationMarginNumerator: string;
    liquidationMarginDenominator: string;
  };
};

export type OraclePriceNode = {
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
  priceFeedName?: string;
};

export type BoardAuxesNode = { allegedName: string; decimalPlaces: number };
export type LiquidationDashboardResponse = {
  vaultLiquidations: { nodes: Array<VaultLiquidationsNode> };
  vaultManagerGovernances: {
    nodes: Array<VaultManagerGovernancesNode>;
  };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  boardAuxes: { nodes: Array<BoardAuxesNode> };
};
export type LiquidationDashboardData = {
  vaultLiquidations: Array<VaultLiquidationsNode>;
};

export type VaultStateDailyNode = {
  id: string;
  blockTimeLast: string;
  active: string;
  liquidated: string;
  closed: string;
  liquidating: string;
  liquidatedClosed: string;
};

export type VaultStateDailyResponse = {
  vaultStatesDailies: {
    nodes: Array<VaultStateDailyNode>;
  };
};
export type GraphData = { key: number; x: string; active: number; liquidated: number; closed: number };

export type OraclePriceDailiesNode = {
  typeInAmountLast: number;
  typeOutAmountLast: number;
  dateKey: number;
};

export type OraclePriceDailiesResponse = { [key: string]: { nodes: Array<OraclePriceDailiesNode> } };
