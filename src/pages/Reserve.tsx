import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveCosmosSummary } from '@/widgets/ReserveCosmosSummary';
import { ReserveShortfall } from '@/widgets/ReserveShortfall';
import { ReserveHistory } from '@/widgets/ReserveHistory';
import { subQueryFetcher } from '@/utils';
import { RESERVE_DASHBOARD_QUERY } from '@/queries';

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

  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReserveSummary data={reserveDashboardQueryData} isLoading={isLoading} />
          <ReserveCosmosSummary />
          <ReserveShortfall data={reserveDashboardQueryData} isLoading={isLoading} />
        </div>
        <ReserveHistory />
      </PageContent>
    </>
  );
};
