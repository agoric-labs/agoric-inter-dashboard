import useSWR from 'swr';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveShortfall } from '@/widgets/ReserveShortfall';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { subQueryFetcher, subQueryGraphFetcher } from '@/utils';
import { RESERVE_DASHBOARD_QUERY, RESERVE_GRAPH_TOKENS_QUERY, RESERVE_DAILY_METRICS_QUERY } from '@/queries';
import { ReserveCosmosSummary } from '@/widgets/ReserveCosmosSummary';
import {
  GET_ACCOUNT_BALANCE_URL,
  GET_MODULE_ACCOUNTS_URL,
  VBANK_RESERVE_ACCOUNT,
  UIST_DENOMINATION,
  GRAPH_DAYS,
} from '@/constants';

type GraphData = { key: number; x: string; [key: string]: any };

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

export const Reserve = () => {
  const { data, isLoading } = useSWR<AxiosResponse, AxiosError>(RESERVE_DASHBOARD_QUERY, subQueryFetcher);

  const response: ReserveDashboardResponse = data?.data?.data;
  const oraclePrices: { [key: string]: OraclePriceNode } = response?.oraclePrices?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.typeInName]: node }),
    {},
  );
  const reserveDashboardQueryData: ReserveDashboardData = response?.reserveMetrics?.nodes?.map((vaultNode) => ({
    ...vaultNode,
    allocations: vaultNode.allocations?.nodes?.reduce(
      (agg, allocation) => ({
        ...agg,
        [allocation.token]: { ...allocation, ...oraclePrices[allocation.token] },
      }),
      {},
    ),
  }));

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - GRAPH_DAYS);
  const startDateFormatDate = startDate.toISOString().slice(0, 10);
  const startDateKey = Number(startDateFormatDate.replaceAll('-', ''));

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(RESERVE_GRAPH_TOKENS_QUERY, subQueryGraphFetcher);
  const tokenNamesResponse: ReserveManagerMetricsResponse = tokenNamesData?.data.data;
  const tokenNames =
    tokenNamesResponse?.reserveMetrics?.nodes
      .map((node) => node.allocations?.nodes?.map((allocation) => allocation.token))
      .flat()
      .toSorted() || [];
  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    RESERVE_DAILY_METRICS_QUERY(tokenNames, startDateKey),
    subQueryGraphFetcher,
  );
  const dailyMetricsResponse = dailyMetricsData?.data.data;

  const range: number[] = [...Object(Array(90)).keys()].reverse();

  const today = new Date();
  const graphDataMap: { [key: string]: GraphData } = range.reduce((agg, dateNum: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - dateNum);
    const formatDate = date.toISOString().slice(0, 10);
    const dateKey = Number(formatDate.replaceAll('-', ''));

    return { ...agg, [dateKey]: { key: dateKey, x: formatDate } };
  }, {});

  tokenNames.forEach((tokenName) => {
    const dailyOracles = dailyMetricsResponse?.[`${tokenName}_oracle`]?.nodes.reduce(
      (agg: object, dailyOracleData: { dateKey: string }) => ({ ...agg, [dailyOracleData.dateKey]: dailyOracleData }),
      {},
    );

    let lastTokenMetric = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];

    const dailyMetrics = dailyMetricsResponse?.[tokenName]?.nodes.reduce(
      (agg: object, metricsData: { dateKey: string }) => ({ ...agg, [metricsData.dateKey]: metricsData }),
      {},
    );

    Object.keys(graphDataMap)
      .toSorted()
      .forEach((dateKey) => {
        const oracle = (dailyOracles && dailyOracles[dateKey]) || { typeOutAmountLast: 1, typeInAmountLast: 1 };
        const tokenMetrics = (dailyMetrics && dailyMetrics[dateKey]) || lastTokenMetric;
        graphDataMap[dateKey][tokenName] =
          ((tokenMetrics?.valueLast || 0) / 1_000_000) * (oracle.typeOutAmountLast / oracle.typeInAmountLast);

        lastTokenMetric = tokenMetrics;

      });
  });

  const sortedGraphDataList = Object.values(graphDataMap) as GraphData[];
  sortedGraphDataList.sort((a, b) => a.key - b.key);
  let prevValue: GraphData = sortedGraphDataList[0];
  const graphDataList: Array<GraphData> = sortedGraphDataList
    .reduce((aggArray: Array<GraphData>, graphData: GraphData) => {
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
    }, [])
    .slice(-1 * GRAPH_DAYS);

  // Cosmos reserve balance
  const { data: moduleAccounts } = useSWR<AxiosResponse, AxiosError>(GET_MODULE_ACCOUNTS_URL, axios.get);
  const reserveAccount = moduleAccounts?.data.accounts.find(
    (account: { name: string }) => account.name === VBANK_RESERVE_ACCOUNT,
  );
  const reserveAddress = reserveAccount?.base_account.address;

  const { data: reserveBalance, isLoading: reserveBalanceLoading } = useSWR<AxiosResponse, AxiosError>(
    GET_ACCOUNT_BALANCE_URL(reserveAddress),
    axios.get,
  );
  const istReserve: { amount: number } = reserveBalance?.data.balances.find(
    (balance: { denom: string }) => balance.denom === UIST_DENOMINATION,
  );
  const istReserveBalance = (istReserve?.amount || 0) / 1_000_000;

  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReserveSummary data={reserveDashboardQueryData} isLoading={isLoading} />
          <ReserveCosmosSummary data={istReserveBalance} isLoading={reserveBalanceLoading} />
          <ReserveShortfall data={reserveDashboardQueryData} isLoading={isLoading} />
        </div>
        <ReserveHistory data={graphDataList} tokenNames={tokenNames} isLoading={graphDataIsLoading} />
      </PageContent>
    </>
  );
};
