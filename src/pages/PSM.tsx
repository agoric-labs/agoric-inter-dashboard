import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { PSMStats } from '@/widgets/PSMStats';
import { PSMHistory } from '@/widgets/PSMHistory';
import { PSMMintedPoolBalancePie } from '@/widgets/PSMMintedPoolBalancePie';
import { subQueryFetcher } from '@/utils';
import { PSM_DASHBOARD_QUERY } from '@/queries';

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
        <PSMHistory />
      </PageContent>
    </>
  );
};
