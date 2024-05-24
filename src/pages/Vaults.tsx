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
    const {typeInName} = node;

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

function processOpenVaultsData(
  nodes: VaultsNode[],
  oraclePrices: OraclePriceNodesData,
  managerGovernancesNodes: VaultManagerGovernancesNodesData,
): OpenVaultsData {
  const arr: OpenVaultsData = [];
  const openVaultsData: OpenVaultsData = nodes?.reduce((acc, vaultNode) => {
    const idSegments = vaultNode.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${vaultNode.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');

    const combinedData = {
      ...oraclePrices[vaultNode.denom],
      ...managerGovernancesNodes[managerName],
      ...vaultNode,
    };

    acc.push(combinedData);

    return acc;
  }, arr);

  return openVaultsData;
}

function processVaultsData(
  vaultsDashboardResponse: VaultsDashboardResponse,
): [OpenVaultsData, VaultsDashboardData, string[]] {
  const oraclePrices = processOraclePrices(vaultsDashboardResponse?.oraclePrices?.nodes);
  const oracleDailyPrices = processOracleDailyPrices(vaultsDashboardResponse?.oraclePriceDailies?.nodes);
  const managerGovernancesNodes = processManagerGovernancesNodes(
    vaultsDashboardResponse?.vaultManagerGovernances?.nodes,
  );
  const openVaults: OpenVaultsData = processOpenVaultsData(
    vaultsDashboardResponse.vaults.nodes,
    oraclePrices,
    managerGovernancesNodes,
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
    const { liquidatingCollateralBrand } = node;

    agg[liquidatingCollateralBrand] = {
      ...managerGovernancesNodes[managerName],
      ...oraclePrices[liquidatingCollateralBrand],
      ...node,
      oracleDailyPrices: [...(oracleDailyPrices[liquidatingCollateralBrand] || [])],
    };
    return agg;
  }, dashboardData);

  return [openVaults, dashboardData, tokenNames];
}
export function Vaults() {
  const {
    data: vaultsData,
    isLoading,
    error,
  } = useSWR<AxiosResponse, AxiosError>(VAULTS_DASHBOARD_QUERY, subQueryFetcher);

  const vaultDataResponse: VaultsDashboardResponse = vaultsData?.data?.data;

  const totalVaultsCount = vaultDataResponse?.vaults.totalCount || 1;
  const pageCount = Math.ceil(totalVaultsCount / 100) - 1;
  const { data: vaultsNextPages } = useSWR<AxiosResponse, AxiosError>(
    pageCount ? OPEN_VAULTS_NEXT_PAGES_QUERY(pageCount) : null,
    subQueryFetcher,
  );

  let vaultsDataAppended: VaultsDashboardResponse | null = null;
  if (!((pageCount !== 0 && !vaultsNextPages) || !vaultDataResponse)) {
    const vaultPages: {
      [key: string]: {
        nodes: Array<VaultsNode>;
      };
    } = vaultsNextPages?.data.data || {};
    const nextVaults = Object.values(vaultPages).flatMap((openVaultsPage) => openVaultsPage.nodes);

    vaultsDataAppended = {
      ...vaultDataResponse,
      vaults: { ...vaultDataResponse.vaults, nodes: [...vaultDataResponse.vaults.nodes, ...nextVaults] },
    };
  }

  if (error) {
    return <ErrorAlert value={error} />;
  }

  let openVaults: OpenVaultsData = [];
  let dashboardData: VaultsDashboardData = {};
  let tokenNames: string[] = [];

  if (vaultsDataAppended && Object.keys(vaultsDataAppended).length > 0) {
    [openVaults, dashboardData, tokenNames] = processVaultsData(vaultsDataAppended);
  }

  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <VaultManagerCountCard totalCollateralTypes={Object.keys(dashboardData)?.length} isLoading={isLoading} />
          <ActiveVaultCountCard activeVaults={openVaults?.length} isLoading={isLoading} />
          <VaultTotalLockedCollateralValueCard data={dashboardData} isLoading={isLoading} />
        </ValueCardGrid>
        <TokenPrices data={dashboardData} isLoading={isLoading} />
        <VaultCharts tokenNames={tokenNames} vaultsDataIsLoading={isLoading} error={error} />
        <hr className="my-5" />
        <VaultManagers data={dashboardData} isLoading={isLoading} />
        <hr className="my-5" />
        <OpenVaults data={openVaults} isLoading={isLoading} />
      </PageContent>
    </>
  );
}
