import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { PSMStats } from '@/widgets/PSMStats';
import { PSMMintedPoolBalancePie } from '@/widgets/PSMMintedPoolBalancePie';
import { populateMissingDays, subQueryFetcher } from '@/utils';
import { PSM_DASHBOARD_QUERY, PSM_GRAPH_TOKENS_QUERY, PSM_TOKEN_DAILY_MINT_QUERY } from '@/queries';
import { PsmMetricsResponse, PsmMetricsDailyResponse, GraphData } from '@/types/psm-types';
import { GRAPH_DAYS } from '@/constants';

export const PSM = () => {
  const { data, error, isLoading } = useSWR<AxiosResponse, AxiosError>(PSM_DASHBOARD_QUERY, subQueryFetcher);
  const response = data?.data?.data;
  const queryData: { [key: string]: object } = {};

  response?.psmMetrics?.nodes?.forEach((node: { denom: string }) => {
    queryData[node.denom] = node;
  });
  response?.psmGovernances?.nodes?.forEach((node: { denom: string }) => {
    if (node.denom in queryData) queryData[node.denom] = { ...queryData[node.denom], ...node };
  });

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(PSM_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: PsmMetricsResponse = tokenNamesData?.data.data;
  const tokenNames = tokenNamesResponse?.psmMetrics.nodes.map((node: { denom: string }) => node.denom) || [];

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
        [dailyTokenMetrics.denom]: Number(dailyTokenMetrics.totalMintedProvidedLast) / 1_000_000,
      };
    });
  });
  
  const graphDataList = populateMissingDays(graphDataMap, GRAPH_DAYS);

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
        {/* <PSMHistory
          data={graphDataList}
          tokenNames={Object.keys(dailyMetricsData?.data.data || {})}
          isLoading={graphDataIsLoading}
        /> */}
      </PageContent>
    </>
  );
};
