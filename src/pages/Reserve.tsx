import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveShortfall } from '@/widgets/ReserveShortfall';
import { fetchDataFromUrl, subQueryFetcher } from '@/utils';
import { RESERVE_DASHBOARD_QUERY, RESERVE_GRAPH_TOKENS_QUERY } from '@/queries';
import { ReserveCosmosSummary } from '@/widgets/ReserveCosmosSummary';
import { GET_MODULE_ACCOUNTS_URL, VBANK_RESERVE_ACCOUNT } from '@/constants';

type OraclePriceNode = {
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
};
type AllocationsNode = { id: string; denom: string; value: number };
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
        [allocation.denom]: { ...allocation, ...oraclePrices[allocation.denom] },
      }),
      {},
    ),
  }));

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(RESERVE_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: ReserveManagerMetricsResponse = tokenNamesData?.data.data;
  const tokenNames =
    tokenNamesResponse?.reserveMetrics?.nodes.flatMap((node) =>
      node.allocations?.nodes?.map((allocation) => allocation.denom),
    ) || [];
  tokenNames.sort();

  const {
    data: moduleAccountsData,
    isLoading: moduleAccountsLoading,
    error: moduleAccountsError,
  } = useSWR<AxiosResponse, AxiosError>(GET_MODULE_ACCOUNTS_URL, fetchDataFromUrl);

  const reserveAccount = moduleAccountsData?.data?.accounts?.find(
    (account: { name: string }) => account.name === VBANK_RESERVE_ACCOUNT,
  );
  const reserveAddress = reserveAccount?.base_account.address;
  
  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReserveSummary data={reserveDashboardQueryData} isLoading={isLoading} />
          <ReserveCosmosSummary reserveAddress={reserveAddress} isLoading={moduleAccountsLoading} error={moduleAccountsError}/>
          <ReserveShortfall data={reserveDashboardQueryData} isLoading={isLoading} />
        </div>
        {/* <ReserveHistoryGraph tokenNames={tokenNames} /> */}
      </PageContent>
    </>
  );
};
