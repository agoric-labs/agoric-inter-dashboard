import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { TokenPrices } from '@/widgets/TokenPrices';
import { ActiveVaultCountCard } from '@/widgets/ActiveVaultCountCard';
import { OpenVaults } from '@/widgets/OpenVaults';
import { VaultManagers } from '@/widgets/VaultManagers';
import { VaultManagerCountCard } from '@/widgets/VaultManagerCountCard';
import { VaultTotalLockedCollateralValueCard } from '@/widgets/VaultTotalLockedCollateralValueCard';
import { OPEN_VAULTS_NEXT_PAGES_QUERY, VAULTS_DASHBOARD_QUERY } from '@/queries';
import { subQueryFetcher } from '@/utils';
import { VaultCharts } from '@/components/VaultCharts';
import { ErrorAlert } from '@/components/ErrorAlert';
import {
  OraclePriceNode,
  OraclePriceNodesData,
  OraclePriceDailiesNode,
  OracleDailyPriceNodesData,
  VaultManagerGovernancesNode,
  VaultManagerGovernancesNodesData,
  VaultsNode,
  OpenVaultsData,
  VaultsDashboardResponse,
  VaultsDashboardData,
  BoardAuxesNode,
  BoardAuxesMap,
} from '@/types/vault-types';

function processOraclePrices(nodes: OraclePriceNode[]): OraclePriceNodesData {
  const obj: OraclePriceNodesData = {};
  return nodes?.reduce((agg, node) => {
    const nameSegments = node?.priceFeedName?.split('-') || '';
    if (nameSegments.length !== 2) {
      throw new Error(`Invalid priceFeedName: ${node.priceFeedName}`);
    }

    const tokenName = nameSegments[0];
    agg[tokenName] = node;
    return agg;
  }, obj);
}

function processOracleDailyPrices(nodes: OraclePriceDailiesNode[]): OracleDailyPriceNodesData {
  const obj: OracleDailyPriceNodesData = {};
  return nodes?.reduce((agg, node) => {
    const { typeInName } = node;

    if (!agg[typeInName]) {
      agg[typeInName] = [];
    }

    agg[typeInName].push(node);
    return agg;
  }, obj);
}

function processManagerGovernancesNodes(nodes: VaultManagerGovernancesNode[]): VaultManagerGovernancesNodesData {
  const obj: VaultManagerGovernancesNodesData = {};
  return nodes?.reduce((agg, node) => {
    const idSegments = node.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${node.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');
    agg[managerName] = node;
    return agg;
  }, obj);
}

function processBoardAuxes(nodes: BoardAuxesNode[]): BoardAuxesMap {
  const obj: BoardAuxesMap = {};

  for (let i = 0; i < nodes?.length; i++) {
    const item = nodes[i];
    obj[item.allegedName] = item.decimalPlaces;
  }

  return obj;
}

function processOpenVaultsData(
  nodes: VaultsNode[],
  oraclePrices: OraclePriceNodesData,
  managerGovernancesNodes: VaultManagerGovernancesNodesData,
  boardAuxes: BoardAuxesMap,
): OpenVaultsData {
  const arr: OpenVaultsData = [];
  const openVaultsData: OpenVaultsData = nodes?.reduce((acc, vaultNode) => {
    const idSegments = vaultNode.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${vaultNode.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');
    const decimalPlaces = (boardAuxes && boardAuxes[vaultNode?.denom]) || 6;
    const decimalPlacesIST = (boardAuxes && boardAuxes['IST']) || 6;

    const combinedData = {
      ...oraclePrices[vaultNode.denom],
      ...managerGovernancesNodes[managerName],
      ...vaultNode,
      decimalPlaces,
      decimalPlacesIST,
    };

    acc.push(combinedData);

    return acc;
  }, arr);

  return openVaultsData;
}

function processVaultsData(
  vaultsDashboardResponse: VaultsDashboardResponse,
): [OpenVaultsData, VaultsDashboardData, string[], BoardAuxesMap] {
  const oraclePrices = processOraclePrices(vaultsDashboardResponse?.oraclePrices?.nodes);
  const oracleDailyPrices = processOracleDailyPrices(vaultsDashboardResponse?.oraclePriceDailies?.nodes);
  const managerGovernancesNodes = processManagerGovernancesNodes(
    vaultsDashboardResponse?.vaultManagerGovernances?.nodes,
  );
  const boardAuxes = processBoardAuxes(vaultsDashboardResponse?.boardAuxes?.nodes);

  const openVaults: OpenVaultsData = processOpenVaultsData(
    vaultsDashboardResponse?.vaults?.nodes,
    oraclePrices,
    managerGovernancesNodes,
    boardAuxes,
  );
  const tokenNames: string[] =
    vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.map((node) => node.liquidatingCollateralBrand) || [];

  const dashboardData: VaultsDashboardData = {};
  vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.reduce((agg, node) => {
    const idSegments = node.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${node.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');
    const liquidatingCollateralBrand = node.liquidatingCollateralBrand;
    const decimalPlaces = (boardAuxes && boardAuxes[liquidatingCollateralBrand]) || 6;
    const decimalPlacesIST = (boardAuxes && boardAuxes['IST']) || 6;

    agg[liquidatingCollateralBrand] = {
      ...managerGovernancesNodes[managerName],
      ...oraclePrices[liquidatingCollateralBrand],
      ...node,
      oracleDailyPrices: [...(oracleDailyPrices[liquidatingCollateralBrand] || [])],
      decimalPlaces,
      decimalPlacesIST,
    };
    return agg;
  }, dashboardData);

  return [openVaults, dashboardData, tokenNames, boardAuxes];
}
export function Vaults() {
  const {
    data: vaultsData,
    isLoading,
    error,
  } = useSWR<AxiosResponse, AxiosError>(VAULTS_DASHBOARD_QUERY, subQueryFetcher);

  const vaultDataResponse: VaultsDashboardResponse = vaultsData?.data?.data;

  const totalVaultsCount = vaultDataResponse?.vaults?.totalCount || 1;
  const pageCount = Math.ceil(totalVaultsCount / 100) - 1;
  const {
    data: vaultsNextPages,
    error: nextPagesError,
    isLoading: nextPagesIsLoading,
  } = useSWR<AxiosResponse, AxiosError>(pageCount ? OPEN_VAULTS_NEXT_PAGES_QUERY(pageCount) : null, subQueryFetcher);

  let vaultsDataAppended: VaultsDashboardResponse | null = null;
  if (!((pageCount !== 0 && !vaultsNextPages) || !vaultDataResponse)) {
    const vaultPages: {
      [key: string]: {
        nodes: Array<VaultsNode>;
      };
    } = vaultsNextPages?.data?.data || {};
    const nextVaults = Object.values(vaultPages).flatMap((openVaultsPage) => openVaultsPage?.nodes);

    vaultsDataAppended = {
      ...vaultDataResponse,
      vaults: { ...vaultDataResponse.vaults, nodes: [...vaultDataResponse?.vaults?.nodes, ...nextVaults] },
    };
  }

  const pageError = error || nextPagesError;
  if (pageError) {
    return <ErrorAlert value={pageError} />;
  }

  let openVaults: OpenVaultsData = [];
  let dashboardData: VaultsDashboardData = {};
  let tokenNames: string[] = [];
  let boardAuxes: BoardAuxesMap = {};

  if (vaultsDataAppended && Object.keys(vaultsDataAppended).length > 0) {
    [openVaults, dashboardData, tokenNames, boardAuxes] = processVaultsData(vaultsDataAppended);
  }
  const dataIsLoading = isLoading || nextPagesIsLoading;

  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <VaultManagerCountCard totalCollateralTypes={Object.keys(dashboardData)?.length} isLoading={dataIsLoading} />
          <ActiveVaultCountCard activeVaults={openVaults?.length} isLoading={dataIsLoading} />
          <VaultTotalLockedCollateralValueCard data={dashboardData} isLoading={dataIsLoading} />
        </ValueCardGrid>
        <TokenPrices data={dashboardData} isLoading={dataIsLoading} />
        <VaultCharts
          tokenNames={tokenNames}
          boardAuxes={boardAuxes}
          vaultsDataIsLoading={dataIsLoading}
          error={error}
        />
        <hr className="my-5" />
        <VaultManagers data={dashboardData} isLoading={dataIsLoading} />
        <hr className="my-5" />
        <OpenVaults data={openVaults} isLoading={dataIsLoading} />
      </PageContent>
    </>
  );
}
