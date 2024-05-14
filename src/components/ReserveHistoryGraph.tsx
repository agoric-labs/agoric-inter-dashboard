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
  const dayRange: number[] = range(90).reverse();

  const today = new Date();
  const graphDataMap: { [key: string]: GraphData } = dayRange.reduce((agg, dateNum: number) => {
    const { key: dateKey, formattedDate } = getDateKey(new Date(today), dateNum);

    return { ...agg, [dateKey]: { key: dateKey, x: formattedDate } };
  }, {});

  tokenNames.forEach((tokenName: string) => {
    const dailyOracles = extractDailyOracles(tokenName, dailyMetricsResponse);
    let lastTokenMetric = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];

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
  });

  const graphDataList = populateMissingDays(graphDataMap, GRAPH_DAYS);

  return (
    <ReserveHistory
      data={graphDataList}
      tokenNames={tokenNames}
      isLoading={graphDataIsLoading}
      error={error?.message}
    />
  );
};

export default ReserveHistoryGraph;
