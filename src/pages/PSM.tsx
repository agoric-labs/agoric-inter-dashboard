import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { PSMStats } from '@/widgets/PSMStats';
import { PSMHistory } from '@/widgets/PSMHistory';
import { PSMMintedPoolBalancePie } from '@/widgets/PSMMintedPoolBalancePie';
import { subQueryFetcher } from '@/utils';
import { PSM_DASHBOARD_QUERY, PSM_GRAPH_TOKENS_QUERY, PSM_TOKEN_DAILY_MINT_QUERY } from '@/queries';

type PsmMetricsNode = {
  id: string;
  token: string;
};

type PsmMetricsDailyNode = {
  id: string;
  token: string;
  dateKey: number;
  blockTimeLast: string;
  totalMintedProvidedLast: number;
};

type PsmMetricsResponse = {
  psmMetrics: {
    nodes: Array<PsmMetricsNode>;
  };
};
type PsmMetricsDailyResponse = {
  [key: string]: {
    nodes: Array<PsmMetricsDailyNode>;
  };
};
type GraphData = { key: number; x: string };

export const PSM = () => {
  const { data, error, isLoading } = useSWR<AxiosResponse, AxiosError>(PSM_DASHBOARD_QUERY, subQueryFetcher);
  const response = data?.data?.data;
  const queryData: { [key: string]: object } = {};

  response?.psmMetrics?.nodes?.forEach((node: { token: string }) => {
    queryData[node.token] = node;
  });
  response?.psmGovernances?.nodes?.forEach((node: { token: string }) => {
    if (node.token in queryData) queryData[node.token] = { ...queryData[node.token], ...node };
  });

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(PSM_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: PsmMetricsResponse = tokenNamesData?.data.data;
  const tokenNames = tokenNamesResponse?.psmMetrics.nodes.map((node: { token: string }) => node.token) || [];

  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    PSM_TOKEN_DAILY_MINT_QUERY(tokenNames),
    subQueryFetcher,
  );
  const dailyMetricsResponse: PsmMetricsDailyResponse = dailyMetricsData?.data.data;
  const graphDataMap: { [key: number]: GraphData } = {};
  Object.values(dailyMetricsResponse || {}).forEach((tokenDataList) => {
    tokenDataList?.nodes.forEach((dailyTokenMetrics) => {
      graphDataMap[dailyTokenMetrics.dateKey] = {
        ...graphDataMap[dailyTokenMetrics.dateKey],
        x: dailyTokenMetrics.blockTimeLast.split('T')[0],
        key: dailyTokenMetrics.dateKey,
        [dailyTokenMetrics.token]: Number(dailyTokenMetrics.totalMintedProvidedLast) / 1_000_000,
      };
    });
  });
  const sortedGraphDataList = Object.values(graphDataMap).slice().sort((a, b) => a.key - b.key);
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
  ).slice(-90);;

  return (
    <>
      <PageHeader title="PSM" />
      <PageContent>
        <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2">
          <div>
            <PSMStats data={queryData} error={error} isLoading={isLoading} />
          </div>
          <PSMMintedPoolBalancePie data={queryData} isLoading={isLoading} />
        </div>
        <PSMHistory
          data={graphDataList}
          tokenNames={Object.keys(dailyMetricsData?.data.data || {})}
          isLoading={graphDataIsLoading}
        />
      </PageContent>
    </>
  );
};
