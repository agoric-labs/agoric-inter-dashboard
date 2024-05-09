import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { GRAPH_DAYS } from '@/constants';
import { getDateKey, subQueryFetcher } from '@/utils';
import { RESERVE_DAILY_METRICS_QUERY } from '@/queries';

type GraphData = { key: number; x: string; [key: string]: any };

const ReserveHistoryGraph = ({ tokenNames }: { tokenNames: string[] }) => {
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
  const range: number[] = [...Object(Array(90)).keys()].reverse();

  const today = new Date();
  const graphDataMap: { [key: string]: GraphData } = range.reduce((agg, dateNum: number) => {
    const { key: dateKey, formattedDate } = getDateKey(new Date(today), dateNum);

    return { ...agg, [dateKey]: { key: dateKey, x: formattedDate } };
  }, {});

  tokenNames.forEach((tokenName: string) => {
    const dailyOracles = dailyMetricsResponse?.[`${tokenName}_oracle`]?.nodes.reduce(
      (agg: object, dailyOracleData: { dateKey: string }) => ({ ...agg, [dailyOracleData.dateKey]: dailyOracleData }),
      {},
    );

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
      graphDataMap[dateKey][tokenName] =
        ((tokenMetrics?.valueLast || 0) / 1_000_000) * (oracle.typeOutAmountLast / oracle.typeInAmountLast);

      lastTokenMetric = tokenMetrics;
    });
  });

  const sortedGraphDataList = Object.values(graphDataMap);
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
