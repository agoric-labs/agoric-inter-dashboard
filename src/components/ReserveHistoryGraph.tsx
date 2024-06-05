import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { GRAPH_DAYS } from '@/constants';
import { populateMissingDays, getDateKey, range, subQueryFetcher, extractDailyOracles, getTokenDivisor } from '@/utils';
import { RESERVE_DAILY_METRICS_QUERY } from '@/queries';
import { GraphData, ReserveAllocationMetricsDaily, ReserveAllocationMetricsDailyNode } from '@/types/reserve-types';
import ChartsSkeleton from './ChartsSkeleton';

type Props = {
  tokenNames: string[];
  error: any;
  isLoading: boolean;
  boardAuxes: { [key: string]: number };
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
  boardAuxes: { [key: string]: number },
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

    const tokenDivisor = getTokenDivisor(boardAuxes, tokenName);
    const tokenValue = (Number(tokenMetrics?.valueLast) || 0) / tokenDivisor;
    const ratio = Number(oracle.typeOutAmountLast) / Number(oracle.typeInAmountLast);
    graphData[dateKey][tokenName] = tokenValue * ratio;

    lastTokenMetric = tokenMetrics;
  }
}

export function constructGraph(tokenNames: string[], dailyMetricsResponse: any, boardAuxes: { [key: string]: number }) {
  if (!tokenNames || tokenNames?.length === 0 || !dailyMetricsResponse) {
    return [];
  }

  const dayRange: number[] = range(90).reverse();
  const graphData: Record<string, GraphData> = generateGraphDataForDateRange(dayRange);

  for (let i = 0; i < tokenNames.length; i++) {
    const tokenName = tokenNames[i];
    let lastTokenMetric: ReserveAllocationMetricsDailyNode = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];
    updateGraphDataForToken(tokenName, graphData, dailyMetricsResponse, lastTokenMetric, boardAuxes);
  }

  const graphDataList = populateMissingDays(graphData, GRAPH_DAYS);
  return graphDataList;
}

const ReserveHistoryGraph = ({ tokenNames, boardAuxes, isLoading, error }: Props) => {
  const isTokenNamesEmpty = !tokenNames || tokenNames.length === 0;
  if (isLoading || error || isTokenNamesEmpty) {
    const errorMessage = !isTokenNamesEmpty && 'Oops! Missing Token Names';

    return (
      <>
        <ChartsSkeleton
          title="Total Locked Collateral"
          isLoading={isLoading}
          error={error || (errorMessage && { message: errorMessage })}
        />
        <ChartsSkeleton
          title="Total Minted IST"
          isLoading={isLoading}
          error={error || (errorMessage && { message: errorMessage })}
        />
      </>
    );
  }

  const { key: startDateKey } = getDateKey(new Date(), GRAPH_DAYS);
  const {
    data: dailyMetricsData,
    isLoading: graphDataIsLoading,
    error: graphDataError,
  } = useSWR<AxiosResponse, AxiosError>(RESERVE_DAILY_METRICS_QUERY(tokenNames, startDateKey), subQueryFetcher);

  const dailyMetricsResponse = dailyMetricsData?.data.data;
  const graphData = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes);

  return (
    <ReserveHistory
      data={graphData}
      tokenNames={tokenNames}
      isLoading={graphDataIsLoading}
      error={graphDataError?.message}
    />
  );
};

export default ReserveHistoryGraph;
