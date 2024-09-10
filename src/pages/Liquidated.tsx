import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { LiquidatedVaultCountCard } from '@/widgets/LiquidatedVaultCountCard';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { populateMissingDays, subQueryFetcher } from '@/utils';
import { LIQUIDATED_VAULTS_NEXT_PAGES_QUERY, LIQUIDATIONS_DASHBOARD, VAULT_STATE_DAILIES_QUERY } from '@/queries';
import {
  GraphData,
  LiquidationDashboardResponse,
  VaultLiquidationsNode,
  VaultStateDailyResponse,
} from '@/types/liquidation-types';
import { GRAPH_DAYS } from '@/constants';
import { ErrorAlert } from '@/components/ErrorAlert';

export function Liquidated() {
  const { data, isLoading, error } = useSWR<AxiosResponse, AxiosError>(LIQUIDATIONS_DASHBOARD, subQueryFetcher);
  const liquidatedVaultsDataResponse: LiquidationDashboardResponse = data?.data?.data;

  const totalVaultsCount = liquidatedVaultsDataResponse?.vaultLiquidations.totalCount || 1;
  const pageCount = Math.ceil(totalVaultsCount / 100) - 1;
  const {
    data: liquidatedVaultsNextPages,
    error: nextPagesError,
    isLoading: nextPagesIsLoading,
  } = useSWR<AxiosResponse, AxiosError>(
    pageCount ? LIQUIDATED_VAULTS_NEXT_PAGES_QUERY(pageCount) : null,
    subQueryFetcher,
  );

  const pageError = error || nextPagesError;

  let liquidatedVaultsDataAppended: LiquidationDashboardResponse = liquidatedVaultsDataResponse;
  if (liquidatedVaultsNextPages) {
    const vaultPages: {
      [key: string]: {
        nodes: Array<VaultLiquidationsNode>;
      };
    } = liquidatedVaultsNextPages?.data?.data || {};
    const nextVaults = Object.values(vaultPages).flatMap((openVaultsPage) => openVaultsPage.nodes);

    liquidatedVaultsDataAppended = {
      ...liquidatedVaultsDataResponse,
      vaultLiquidations: {
        ...liquidatedVaultsDataResponse.vaultLiquidations,
        nodes: [...liquidatedVaultsDataResponse.vaultLiquidations.nodes, ...nextVaults],
      },
    };
  }

  const boardAuxes: { [key: string]: number } | undefined = liquidatedVaultsDataAppended?.boardAuxes?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.allegedName]: node.decimalPlaces }),
    {},
  );

  const liquidationDashboardData = {
    vaultLiquidations: liquidatedVaultsDataAppended?.vaultLiquidations?.nodes,
  };

  //  Queries for graph
  const {
    data: vaultStateDailyData,
    isLoading: graphDataIsLoading,
    error: graphDataError,
  } = useSWR<AxiosResponse, AxiosError>(VAULT_STATE_DAILIES_QUERY, subQueryFetcher);
  const vaultStateDailyResponse: VaultStateDailyResponse = vaultStateDailyData?.data?.data;
  const graphDataMap: { [key: number]: GraphData } = {};
  vaultStateDailyResponse?.vaultStatesDailies.nodes?.forEach((vaultState) => {
    graphDataMap[Number(vaultState.id)] = {
      x: vaultState.blockTimeLast?.split('T')[0],
      key: Number(vaultState.id),
      active: Number(vaultState.active),
      liquidated: Number(vaultState.liquidated) + Number(vaultState.liquidatedClosed),
      closed: Number(vaultState.closed),
    };
  });
  if (pageError) {
    return <ErrorAlert value={pageError} />;
  }

  const graphDataList = populateMissingDays(graphDataMap, GRAPH_DAYS);

  const errorMessage = error || graphDataError;
  if (errorMessage) {
    return <ErrorAlert value={errorMessage} title="Request Error" />;
  }
  const dataIsLoading = isLoading || nextPagesIsLoading;
  return (
    <>
      <PageHeader title="Liquidated Vaults" />
      <PageContent>
        <ValueCardGrid>
          <LiquidatedVaultCountCard
            data={liquidatedVaultsDataAppended?.vaultManagerMetrics?.nodes}
            isLoading={dataIsLoading}
          />
        </ValueCardGrid>
        <VaultStatesChart data={graphDataList} isLoading={graphDataIsLoading} />
        <hr className="my-5" />
        <LiquidatedVaults data={liquidationDashboardData} boardAuxes={boardAuxes} isLoading={dataIsLoading} />
      </PageContent>
    </>
  );
}
