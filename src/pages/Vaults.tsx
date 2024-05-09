import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr/immutable';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { TokenPrices } from '@/widgets/TokenPrices';
import { ActiveVaultCountCard } from '@/widgets/ActiveVaultCountCard';
import { OpenVaults } from '@/widgets/OpenVaults';
import { VaultManagers } from '@/widgets/VaultManagers';
import { VaultManagerCountCard } from '@/widgets/VaultManagerCountCard';
import { VaultTotalLockedCollateralValueCard } from '@/widgets/VaultTotalLockedCollateralValueCard';
import { VAULTS_DASHBOARD_QUERY } from '@/queries';
import { subQueryFetcher } from '@/utils';
import { VaultCharts } from '@/components/VaultCharts';
import { ErrorAlert } from '@/components/ErrorAlert';

type OraclePriceNode = { priceFeedName: string; typeInAmount: number; typeOutAmount: number };

type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralBrand: string;
  numActiveVaults: number;
  totalCollateral: number;
  totalDebt: number;
};

type VaultsNode = {
  balance: number;
  debt: number;
  id: string;
  state: string;
  token: string;
};

type VaultManagerGovernancesNode = {
  id: string;
  liquidationMarginDenominator: number;
  liquidationMarginNumerator: number;
  debtLimit: number;
};

type OraclePriceDailiesNode = {
  priceFeedName: string;
  typeInName: string;
  dateKey: number;
  typeInAmountLast: number;
  typeOutAmountLast: number;
};

type BoardAuxesNode = { allegedName: string; decimalPlaces: number };

type VaultsDashboardResponse = {
  boardAuxes: { nodes: Array<BoardAuxesNode> };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
  vaultManagerGovernances: { nodes: Array<VaultManagerGovernancesNode> };
  vaults: {
    nodes: Array<VaultsNode>;
  };
  oraclePriceDailies: { nodes: Array<OraclePriceDailiesNode> };
};

type OraclePriceDailiesArr = {
  oracleDailyPrices: Array<OraclePriceDailiesNode>;
};

type OraclePriceNodesData = { [key: string]: OraclePriceNode };
type OracleDailyPriceNodesData = { [key: string]: OraclePriceDailiesNode[] };
type VaultManagerGovernancesNodesData = { [key: string]: VaultManagerGovernancesNode };

export type VaultsDashboardData = {
  [key: string]: VaultManagerMetricsNode & OraclePriceNode & VaultManagerGovernancesNode & OraclePriceDailiesArr;
};

export type OpenVaultsData = Array<VaultsNode & OraclePriceNode & VaultManagerGovernancesNode>;

function processOraclePrices(nodes: OraclePriceNode[]): OraclePriceNodesData {
  let obj: OraclePriceNodesData = {};
  return nodes?.reduce((agg, node) => {
    const nameSegments = node.priceFeedName.split('-');
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
    const typeInName = node.typeInName;

    if (!agg[typeInName]) {
      agg[typeInName] = [];
    }

    agg[typeInName].push(node);
    return agg;
  }, obj);
}

function processManagerGovernancesNodes(nodes: VaultManagerGovernancesNode[]): VaultManagerGovernancesNodesData {
  let obj: VaultManagerGovernancesNodesData = {};
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
  let arr: OpenVaultsData = [];
  const openVaultsData: OpenVaultsData = nodes?.reduce((acc, vaultNode) => {
    const idSegments = vaultNode.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${vaultNode.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');

    const combinedData = {
      ...oraclePrices[vaultNode.token],
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

  let dashboardData: VaultsDashboardData = {};
  vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.reduce((agg, node) => {
    const idSegments = node.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${node.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');
    const liquidatingCollateralBrand = node.liquidatingCollateralBrand;

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
  const { data, isLoading, error } = useSWR<AxiosResponse, AxiosError>(VAULTS_DASHBOARD_QUERY, subQueryFetcher);

  if (error) {
    return <ErrorAlert value={error} />;
  }

  let openVaults: OpenVaultsData = [];
  let dashboardData: VaultsDashboardData = {};
  let tokenNames: string[] = [];

  if (data) {
    [openVaults, dashboardData, tokenNames] = processVaultsData(data.data.data);
  }

  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <VaultManagerCountCard data={dashboardData} isLoading={isLoading} />
          <ActiveVaultCountCard data={openVaults} isLoading={isLoading} />
          <VaultTotalLockedCollateralValueCard data={dashboardData} isLoading={isLoading} />
        </ValueCardGrid>
        <TokenPrices data={dashboardData} isLoading={isLoading} />
        <VaultCharts tokenNames={tokenNames} vaultsDataIsLoading={isLoading} error={error}/>
        <hr className="my-5" />
        <VaultManagers data={dashboardData} isLoading={isLoading} />
        <hr className="my-5" />
        <OpenVaults data={openVaults} isLoading={isLoading} />
      </PageContent>
    </>
  );
}
