import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { LiquidatedVaultCountCard } from '@/widgets/LiquidatedVaultCountCard';
import { subQueryFetcher, subQueryGraphFetcher } from '@/utils';
import { LIQUIDATIONS_DASHBOARD, LIQUIDATION_GRAPH_TOKENS_QUERY, LIQUIDATION_DAILY_METRICS_QUERY } from '@/queries';

export type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralValue: number;
  numActiveVaults: number;
  numLiquidatingVaults: number;
  numLiquidationsAborted: number;
  numLiquidationsCompleted: number;
};
type VaultManagerGovernancesNode = {
  id: string;
  liquidationMarginDenominator: number;
  liquidationMarginNumerator: number;
};
type VaultsNode = {
  balance: number;
  debt: number;
  id: string;
  state: string;
  token: string;
};

type LiquidationDashboardResponse = {
  vaults: { nodes: Array<VaultsNode> };
  vaultManagerGovernances: {
    nodes: Array<VaultManagerGovernancesNode>;
  };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
};
export type LiquidationDashboardData = {
  vaults: Array<VaultsNode>;
  vaultManagerGovernances: { [key: string]: VaultManagerGovernancesNode };
};

type TokenNamesResponse = {
  vaultManagerMetrics: {
    nodes: Array<{ id: string; liquidatingCollateralBrand: string }>;
  };
};
type LiquidationMetricsDailyNode = {
  id: string;
  dateKey: number;
  blockTimeLast: string;
  numActiveVaultsLast: number;
  numLiquidatingVaultsLast: number;
  numLiquidationsCompletedLast: number;
  numLiquidationsAbortedLast: number;
  liquidatingCollateralBrand: string;
};

type LiquidationMetricsDailyResponse = {
  [key: string]: {
    nodes: Array<LiquidationMetricsDailyNode>;
  };
};
type GraphData = { key: number; x: string; active: object; liquidated: object };
const sum = (items: Array<string>) => items.reduce((agg, next) => agg + Number(next), 0);

export function Liquidated() {
  const { data, isLoading } = useSWR<AxiosResponse, AxiosError>(LIQUIDATIONS_DASHBOARD, subQueryFetcher);
  const response: LiquidationDashboardResponse = data?.data?.data;

  const vaultManagerGovernances: { [key: string]: VaultManagerGovernancesNode } =
    response?.vaultManagerGovernances?.nodes?.reduce((agg, node) => {
      const idSegments = node?.id?.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return { ...agg, [managerName]: node };
    }, {});
  const liquidationDashboardData = {
    vaultManagerGovernances,
    vaults: response?.vaults?.nodes,
  };

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(
    LIQUIDATION_GRAPH_TOKENS_QUERY,
    subQueryGraphFetcher,
  );
  const tokenNamesResponse: TokenNamesResponse = tokenNamesData?.data.data;
  const tokenNames = tokenNamesResponse?.vaultManagerMetrics.nodes.map((node) => node.liquidatingCollateralBrand) || [];

  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    LIQUIDATION_DAILY_METRICS_QUERY(tokenNames),
    subQueryGraphFetcher,
  );
  const dailyMetricsResponse: LiquidationMetricsDailyResponse = dailyMetricsData?.data.data;
  const graphDataMap: { [key: number]: GraphData } = {};
  Object.values(dailyMetricsResponse || {}).forEach((tokenDataList) => {
    tokenDataList?.nodes.forEach((dailyTokenMetrics) => {
      graphDataMap[dailyTokenMetrics.dateKey] = {
        ...graphDataMap[dailyTokenMetrics.dateKey],
        x: dailyTokenMetrics.blockTimeLast.split('T')[0],
        key: dailyTokenMetrics.dateKey,
        active: {
          ...graphDataMap[dailyTokenMetrics.dateKey]?.active,
          [dailyTokenMetrics.liquidatingCollateralBrand]: dailyTokenMetrics.numActiveVaultsLast,
        },
        liquidated: {
          ...graphDataMap[dailyTokenMetrics.dateKey]?.liquidated,
          [dailyTokenMetrics.liquidatingCollateralBrand]: dailyTokenMetrics.numLiquidationsCompletedLast,
        },
      };
    });
  });
  const sortedGraphDataList = Object.values(graphDataMap);
  sortedGraphDataList.sort((a, b) => a.key - b.key);
  const graphDataList = sortedGraphDataList.map((item) => ({
    ...item,
    active: sum(Object.values(item.active)),
    liquidated: sum(Object.values(item.active)),
  }));

  return (
    <>
      <PageHeader title="Liquidated Vaults" />
      <PageContent>
        <ValueCardGrid>
          <LiquidatedVaultCountCard data={response?.vaultManagerMetrics?.nodes} isLoading={isLoading} />
        </ValueCardGrid>
        <VaultStatesChart data={graphDataList} isLoading={graphDataIsLoading} />
        <hr className="my-5" />
        <LiquidatedVaults data={liquidationDashboardData} isLoading={isLoading} />
      </PageContent>
    </>
  );
}
