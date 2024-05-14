import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { GRAPH_DAYS } from '@/constants';
import { populateMissingDays, getDateKey, range, subQueryFetcher, extractDailyOracles } from '@/utils';
import { RESERVE_DAILY_METRICS_QUERY } from '@/queries';

type GraphData = { key: number; x: string; [key: string]: any };

type Props = {
  tokenNames: string[];
};

function generateGraphDataForDateRange(dayRange: number[]): Record<string, GraphData> {
  const graphData: Record<string, GraphData> = {};

  for (const dateNum of dayRange) {
    const { key: dateKey, formattedDate } = getDateKey(new Date(), dateNum);
    graphData[dateKey] = { key: dateKey, x: formattedDate };
  }

  return graphData;
}

function updateGraphDataForToken(
  tokenName: string,
  graphDataMap: Record<string, GraphData>,
  dailyMetricsResponse: any,
  lastTokenMetric: any,
): void {
  const dailyOracles = extractDailyOracles(tokenName, dailyMetricsResponse);

  const dailyMetrics = dailyMetricsResponse?.[tokenName]?.nodes.reduce(
    (agg: object, metricsData: { dateKey: string }) => ({ ...agg, [metricsData.dateKey]: metricsData }),
    {},
  );

  const dateList = Object.keys(graphDataMap);
  dateList.sort();

  dateList.forEach((dateKey: string) => {
    const oracle = (dailyOracles && dailyOracles[dateKey]) || { typeOutAmountLast: 1, typeInAmountLast: 1 };
    const tokenMetrics = (dailyMetrics && dailyMetrics[dateKey]) || lastTokenMetric;

    const tokenValue = (tokenMetrics?.valueLast || 0) / 1_000_000;
    const ratio = Number(oracle.typeOutAmountLast) / Number(oracle.typeInAmountLast);
    graphDataMap[dateKey][tokenName] = tokenValue * ratio;

    lastTokenMetric = tokenMetrics;
  });
}

function constructGraph(tokenNames: string[], dailyMetricsResponse: any) {
  const dayRange: number[] = range(90).reverse();
  const graphData: Record<string, GraphData> = generateGraphDataForDateRange(dayRange);

  for (let i = 0; i < tokenNames.length; i++) {
    const tokenName = tokenNames[i];
    let lastTokenMetric = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];
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
