import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { LiquidatedVaultCountCard } from '@/widgets/LiquidatedVaultCountCard';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { subQueryFetcher } from '@/utils';
import { LIQUIDATIONS_DASHBOARD, LIQUIDATION_GRAPH_TOKENS_QUERY, LIQUIDATION_DAILY_METRICS_QUERY } from '@/queries';
import { GraphData, LiquidationDashboardResponse, LiquidationMetricsDailyResponse, OraclePriceNode, TokenNamesResponse, VaultManagerGovernancesNode } from '@/types/liquidation-types';


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
  const oraclePrices: { [key: string]: OraclePriceNode } = response?.oraclePrices?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.typeInName]: node }),
    {},
  );

  const liquidationDashboardData = {
    vaultManagerGovernances,
    vaultLiquidations: response?.vaultLiquidations?.nodes,
    oraclePrices,
  };

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(
    LIQUIDATION_GRAPH_TOKENS_QUERY,
    subQueryFetcher,
  );
  const tokenNamesResponse: TokenNamesResponse = tokenNamesData?.data.data;
  const tokenNames = tokenNamesResponse?.vaultManagerMetrics.nodes.map((node) => node.liquidatingCollateralBrand) || [];

  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    LIQUIDATION_DAILY_METRICS_QUERY(tokenNames),
    subQueryFetcher,
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
  let prevValue: GraphData = sortedGraphDataList[0];
  const graphDataList: Array<GraphData> = sortedGraphDataList.reduce(
    (aggArray: Array<GraphData>, graphData: GraphData) => {
      // filling in missing days
      const prevDay = new Date(prevValue.x);
      const nextDay = new Date(graphData.x);
      const timeDiff = nextDay.getTime() - prevDay.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const missingDays =
        diffDays > 1
          ? Array.from(Array(diffDays - 1).keys()).map((idx) => {
              const newDate = new Date(prevDay);
              newDate.setDate(prevDay.getDate() + 1 + idx);
              const newDateString = newDate.toISOString().slice(0, 10);
              const dateKey = Number(newDateString.replaceAll('-', ''));
              return { ...prevValue, x: newDateString, key: dateKey };
            })
          : [];

      const newAggArray = [...aggArray, ...missingDays, { ...prevValue, ...graphData }];
      prevValue = { ...prevValue, ...graphData };
      return newAggArray;
    },
    [],
  ).slice(-90);
  const summedGraphDataList = graphDataList.map((item) => ({
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
        {/* <VaultStatesChart data={summedGraphDataList} isLoading={graphDataIsLoading} /> */}
        <hr className="my-5" />
        <LiquidatedVaults data={liquidationDashboardData} isLoading={isLoading} />
      </PageContent>
    </>
  );
}
