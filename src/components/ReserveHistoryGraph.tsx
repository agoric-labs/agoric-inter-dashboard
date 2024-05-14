import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { GRAPH_DAYS } from '@/constants';
import { populateMissingDays, getDateKey, range, subQueryFetcher, extractDailyOracles } from '@/utils';
import { RESERVE_DAILY_METRICS_QUERY } from '@/queries';
import { GraphData, ReserveAllocationMetricsDaily, ReserveAllocationMetricsDailyNode } from '@/types/reserve-types';

type Props = {
  tokenNames: string[];
};

export function generateGraphDataForDateRange(dayRange: number[]): Record<string, GraphData> {
  const graphData: Record<string, GraphData> = {};

  for (let i = 0; i < dayRange?.length; i++) {
    const dateNum = dayRange[i];
    const { key: dateKey, formattedDate } = getDateKey(new Date(), dateNum);
    graphData[dateKey] = { key: dateKey, x: formattedDate };
  }

  return graphData;
}

export function updateGraphDataForToken(
  tokenName: string,
  graphData: Record<string, GraphData>,
  dailyMetricsResponse: any,
  lastTokenMetric: ReserveAllocationMetricsDailyNode,
): void {
  const dailyOracles = extractDailyOracles(tokenName, dailyMetricsResponse);

  const dailyMetrics: ReserveAllocationMetricsDaily = {};
  const nodes = dailyMetricsResponse?.[tokenName]?.nodes;

  for (let i = 0; i < nodes?.length; i++) {
    const metricsData = nodes[i];
    const { dateKey } = metricsData;
    dailyMetrics[dateKey] = metricsData;
  }

  const dateList = Object.keys(graphData).sort();

  for (let i = 0; i < dateList?.length; i++) {
    const dateKey = dateList[i];
    const oracle = (dailyOracles && dailyOracles[dateKey]) || { typeOutAmountLast: 1, typeInAmountLast: 1 };
    const tokenMetrics = (dailyMetrics && dailyMetrics[dateKey]) || lastTokenMetric;

    const tokenValue = (Number(tokenMetrics?.valueLast) || 0) / 1_000_000;
    const ratio = Number(oracle.typeOutAmountLast) / Number(oracle.typeInAmountLast);
    graphData[dateKey][tokenName] = tokenValue * ratio;

    lastTokenMetric = tokenMetrics;
  }
}

export function constructGraph(tokenNames: string[], dailyMetricsResponse: any) {
  if (!tokenNames || tokenNames?.length === 0 || !dailyMetricsResponse) {
    return [];
  }

  const dayRange: number[] = range(90).reverse();
  const graphData: Record<string, GraphData> = generateGraphDataForDateRange(dayRange);

  for (let i = 0; i < tokenNames.length; i++) {
    const tokenName = tokenNames[i];
    let lastTokenMetric: ReserveAllocationMetricsDailyNode = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];
    updateGraphDataForToken(tokenName, graphData, dailyMetricsResponse, lastTokenMetric);
  }

  const graphDataList = populateMissingDays(graphData, GRAPH_DAYS);
  return graphDataList;
}

const ReserveHistoryGraph = ({ tokenNames }: Props) => {
  const { key: startDateKey } = getDateKey(new Date(), GRAPH_DAYS);
  const {
    data: dailyMetricsData,
    isLoading: graphDataIsLoading,
    error,
  } = useSWR<AxiosResponse, AxiosError>(
    tokenNames.length ? RESERVE_DAILY_METRICS_QUERY(tokenNames, startDateKey) : null,
    subQueryFetcher,
  );
  const dailyMetricsResponse = dailyMetricsData?.data.data;
  const graphData = constructGraph(tokenNames, dailyMetricsResponse);

  return (
    <ReserveHistory data={graphData} tokenNames={tokenNames} isLoading={graphDataIsLoading} error={error?.message} />
  );
};

export default ReserveHistoryGraph;
