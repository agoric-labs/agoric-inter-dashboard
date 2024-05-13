export class OraclePriceNode {
  id: string;
  dateKey: number;
  blockTimeLast: string;
  typeInName: string;
  priceFeedName?: string;
  typeInAmount?: number;
  typeInAmountLast?: number;
  typeOutAmount?: number;
  typeOutAmountLast?: number;

  constructor(data: OraclePriceNode) {
    this.id = data.id;
    this.dateKey = data.dateKey;
    this.blockTimeLast = data.blockTimeLast;
    this.typeInName = data.typeInName;
    this.priceFeedName = data.priceFeedName;
    this.typeInAmount = Number(data?.typeInAmount) || 0;
    this.typeInAmountLast = Number(data?.typeInAmountLast) || 0;
    this.typeOutAmount = Number(data?.typeOutAmount) || 0;
    this.typeOutAmountLast = Number(data?.typeOutAmountLast) || 0;
  }
}

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
