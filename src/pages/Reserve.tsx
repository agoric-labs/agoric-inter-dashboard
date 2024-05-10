import useSWR from 'swr';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveShortfall } from '@/widgets/ReserveShortfall';
import { subQueryFetcher } from '@/utils';
import { RESERVE_DASHBOARD_QUERY, RESERVE_GRAPH_TOKENS_QUERY } from '@/queries';
import { ReserveCosmosSummary } from '@/widgets/ReserveCosmosSummary';
import {
  GET_ACCOUNT_BALANCE_URL,
  GET_MODULE_ACCOUNTS_URL,
  VBANK_RESERVE_ACCOUNT,
  UIST_DENOMINATION,
} from '@/constants';
import ReserveHistoryGraph from '@/components/ReserveHistoryGraph';

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
        [allocation.token]: { ...allocation, ...oraclePrices[allocation.token] },
      }),
      {},
    ),
  }));

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(RESERVE_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: ReserveManagerMetricsResponse = tokenNamesData?.data.data;
  const tokenNames =
    tokenNamesResponse?.reserveMetrics?.nodes.flatMap((node) =>
      node.allocations?.nodes?.map((allocation) => allocation.token),
    ) || [];
  tokenNames.sort();

  // Cosmos reserve balance
  const { data: moduleAccounts } = useSWR<AxiosResponse, AxiosError>(GET_MODULE_ACCOUNTS_URL, axios.get);
  const reserveAccount = moduleAccounts?.data.accounts.find(
    (account: { name: string }) => account.name === VBANK_RESERVE_ACCOUNT,
  );
  const reserveAddress = reserveAccount?.base_account.address;

  const { data: reserveBalance, isLoading: reserveBalanceLoading } = useSWR<AxiosResponse, AxiosError>(
    reserveAddress ? GET_ACCOUNT_BALANCE_URL(reserveAddress) : null,
    axios.get,
  );
  const istReserve: { amount: number } = reserveBalance?.data.balances.find(
    (balance: { denom: string }) => balance.denom === UIST_DENOMINATION,
  );
  const istReserveBalance = (istReserve?.amount || 0) / 1_000_000;

  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReserveSummary data={reserveDashboardQueryData} isLoading={isLoading} />
          <ReserveCosmosSummary data={istReserveBalance} isLoading={reserveBalanceLoading} />
          <ReserveShortfall data={reserveDashboardQueryData} isLoading={isLoading} />
        </div>
        {/* <ReserveHistoryGraph tokenNames={tokenNames} /> */}
      </PageContent>
    </>
  );
};
