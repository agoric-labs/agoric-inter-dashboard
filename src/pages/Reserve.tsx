import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveCosmosSummary } from '@/widgets/ReserveCosmosSummary';
import { ReserveShortfall } from '@/widgets/ReserveShortfall';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { subQueryFetcher, subQueryGraphFetcher } from '@/utils';
import { RESERVE_DASHBOARD_QUERY, RESERVE_GRAPH_TOKENS_QUERY, RESERVE_DAILY_METRICS_QUERY } from '@/queries';

type OraclePriceNode = {
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
};
type AllocationsNode = { id: string; token: string; value: number };
type ReserveMetricsNode = {
  allocations: { nodes: Array<AllocationsNode> };
  shortfallBalance: number;
};
type ReserveDashboardResponse = {
  oraclePrices: { nodes: Array<OraclePriceNode> };
  reserveMetrics: { nodes: Array<ReserveMetricsNode> };
};
export type ReserveDashboardData = Array<{
  shortfallBalance: number;
  allocations: { [key: string]: AllocationsNode & OraclePriceNode };
}>;

type ReserveManagerMetricsResponse = {
  reserveMetrics: { nodes: Array<ReserveMetricsNode> };
};

type GraphData = { key: number; x: string };

export const Reserve = () => {
  const { data, isLoading } = useSWR<AxiosResponse, AxiosError>(RESERVE_DASHBOARD_QUERY, subQueryFetcher);

  const response: ReserveDashboardResponse = data?.data?.data;
  const oraclePrices: { [key: string]: OraclePriceNode } = response?.oraclePrices?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.typeInName]: node }),
    {},
  );
  const reserveDashboardQueryData: ReserveDashboardData = response?.reserveMetrics?.nodes?.map((vaultNode) => ({
    ...vaultNode,
    allocations: vaultNode.allocations.nodes.reduce(
      (agg, allocation) => ({
        ...agg,
        [allocation.token]: { ...allocation, ...oraclePrices[allocation.token] },
      }),
      {},
    ),
  }));

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(RESERVE_GRAPH_TOKENS_QUERY, subQueryGraphFetcher);
  const tokenNamesResponse: ReserveManagerMetricsResponse = tokenNamesData?.data.data;
  const tokenNames =
    tokenNamesResponse?.reserveMetrics.nodes
      .map((node) => node.allocations.nodes.map((allocation) => allocation.token))
      .flat() || [];
  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    RESERVE_DAILY_METRICS_QUERY(tokenNames),
    subQueryGraphFetcher,
  );
  const dailyMetricsResponse = dailyMetricsData?.data.data;

  const graphDataMap: { [key: number]: GraphData } = {};
  tokenNames.forEach((tokenName) => {
    const dailyOracles = dailyMetricsResponse?.[`${tokenName}_oracle`].nodes.reduce(
      (agg: object, dailyOracleData: { dateKey: string }) => ({ ...agg, [dailyOracleData.dateKey]: dailyOracleData }),
      {},
    );

    dailyMetricsResponse?.[tokenName].nodes.forEach((dailyTokenMetrics: any) => {
      const oracle = dailyOracles[dailyTokenMetrics.dateKey] || { typeOutAmountLast: 1, typeInAmountLast: 1 };
      graphDataMap[dailyTokenMetrics.dateKey] = {
        ...graphDataMap[dailyTokenMetrics.dateKey],
        x: dailyTokenMetrics.blockTimeLast.slice(0, 10),
        key: dailyTokenMetrics.dateKey,
        [`${dailyTokenMetrics.token}`]:
          (dailyTokenMetrics.valueLast / 1_000_000) * (oracle.typeOutAmountLast / oracle.typeInAmountLast),
      };
    });
  });

  const sortedGraphDataList = Object.values(graphDataMap);
  sortedGraphDataList.sort((a, b) => a.key - b.key);

  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReserveSummary data={reserveDashboardQueryData} isLoading={isLoading} />
          <ReserveCosmosSummary />
          <ReserveShortfall data={reserveDashboardQueryData} isLoading={isLoading} />
        </div>
        <ReserveHistory data={sortedGraphDataList} tokenNames={tokenNames} isLoading={graphDataIsLoading} />
      </PageContent>
    </>
  );
};
