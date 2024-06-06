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
import ReserveHistoryGraph from '@/components/ReserveHistoryGraph';
import {
  ReserveDashboardResponse,
  ReserveDashboardData,
  OraclePriceNode,
  ReserveManagerMetricsResponse,
} from '@/types/reserve-types';

export const Reserve = () => {
  const { data, isLoading } = useSWR<AxiosResponse, AxiosError>(RESERVE_DASHBOARD_QUERY, subQueryFetcher);

  const response: ReserveDashboardResponse = data?.data?.data;
  const oraclePrices: { [key: string]: OraclePriceNode } =
    response?.oraclePrices?.nodes?.reduce((agg, node) => ({ ...agg, [node.typeInName]: node }), {}) || {};

  const boardAuxes: { [key: string]: number } = response?.boardAuxes?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.allegedName]: node.decimalPlaces }),
    {},
  );
  // TODO: make the fallback implementation in this section of code more readable
  const reserveDashboardQueryData: ReserveDashboardData =
    response?.reserveMetrics?.nodes?.map((vaultNode) => ({
      ...vaultNode,
      allocations:
        vaultNode.allocations?.nodes?.reduce(
          (agg, allocation) => ({
            ...agg,
            [allocation.denom]: { ...allocation, ...(oraclePrices[allocation.denom] || {}) },
          }),
          {},
        ) || {},
    })) || [];

  //  Queries for graph
  const {
    data: tokenNamesData,
    error: tokenNamesError,
    isLoading: tokenNamesIsLoading,
  } = useSWR<AxiosResponse, AxiosError>(RESERVE_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: ReserveManagerMetricsResponse = tokenNamesData?.data?.data;
  const tokenNames =
    tokenNamesResponse?.reserveMetrics?.nodes?.flatMap((node) =>
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
  const reserveAddress = reserveAccount?.base_account?.address;

  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReserveSummary data={reserveDashboardQueryData} boardAuxes={boardAuxes} isLoading={isLoading} />
          <ReserveCosmosSummary
            reserveAddress={reserveAddress}
            boardAuxes={boardAuxes}
            isLoading={moduleAccountsLoading}
            error={moduleAccountsError}
          />
          <ReserveShortfall data={reserveDashboardQueryData} boardAuxes={boardAuxes} isLoading={isLoading} />
        </div>
        <ReserveHistoryGraph
          tokenNames={tokenNames}
          boardAuxes={boardAuxes}
          error={tokenNamesError}
          isLoading={tokenNamesIsLoading}
        />
      </PageContent>
    </>
  );
};
