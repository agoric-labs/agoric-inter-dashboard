import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr/immutable';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { TokenPrices } from '@/widgets/TokenPrices';
import { ActiveVaultCountCard } from '@/widgets/ActiveVaultCountCard';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { OpenVaults } from '@/widgets/OpenVaults';
import { VaultManagers } from '@/widgets/VaultManagers';
import { VaultManagerCountCard } from '@/widgets/VaultManagerCountCard';
import { VaultTotalLockedCollateralValueCard } from '@/widgets/VaultTotalLockedCollateralValueCard';
import { VAULTS_DASHBOARD_QUERY, OPEN_VAULTS_QUERY } from '@/queries';
import { subQueryFetcher } from '@/utils';

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
};

type VaultsDashboardResponse = {
  boardAuxes: { nodes: Array<{ allegedName: string; decimalPlaces: number }> };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
};

type OpenVaultsResponse = {
  vaults: {
    nodes: Array<VaultsNode>;
  };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  vaultManagerGovernances: { nodes: Array<VaultManagerGovernancesNode> };
};

export type VaultsDashboardData = {
  [key: string]: VaultManagerMetricsNode & OraclePriceNode;
};
export type OpenVaultsData = Array<VaultsNode & OraclePriceNode & VaultManagerGovernancesNode>;

export function Vaults() {
  const { data: vaultsDashboardData, isLoading: vaultsDashboardIsLoading } = useSWR<AxiosResponse, AxiosError>(
    VAULTS_DASHBOARD_QUERY,
    subQueryFetcher,
  );
  const { data: openVaultsData, isLoading: openVaultsIsLoading } = useSWR<AxiosResponse, AxiosError>(
    OPEN_VAULTS_QUERY,
    subQueryFetcher,
  );

  const vaultsDashboardResponse: VaultsDashboardResponse = vaultsDashboardData?.data?.data;
  const vaultDashboardOraclePrices: { [key: string]: OraclePriceNode } =
    vaultsDashboardResponse?.oraclePrices?.nodes?.reduce((agg, node) => {
      const nameSegments = node.priceFeedName.split('-');
      if (nameSegments.length !== 2) {
        throw new Error(`Invalid priceFeedName: ${node.priceFeedName}`);
      }
      const tokenName = nameSegments[0];
      return { ...agg, [tokenName]: node };
    }, {});
  const vaultsDashboardQueryData: VaultsDashboardData = vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.reduce(
    (agg, node) => ({
      ...agg,
      [node.liquidatingCollateralBrand]: { ...node, ...vaultDashboardOraclePrices[node.liquidatingCollateralBrand] },
    }),
    {},
  );

  const openVaultsResponse: OpenVaultsResponse = openVaultsData?.data?.data;
  const oraclePrices: { [key: string]: OraclePriceNode } = openVaultsResponse?.oraclePrices?.nodes?.reduce(
    (agg, node) => {
      const nameSegments = node.priceFeedName.split('-');
      if (nameSegments.length !== 2) {
        throw new Error(`Invalid priceFeedName: ${node.priceFeedName}`);
      }
      const tokenName = nameSegments[0];
      return { ...agg, [tokenName]: node };
    },
    {},
  );
  const vaultManagerGovernances: { [key: string]: VaultManagerGovernancesNode } =
    openVaultsResponse?.vaultManagerGovernances?.nodes?.reduce((agg, node) => {
      const idSegments = node.id.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return { ...agg, [managerName]: node };
    }, {});
  const openVaultsQueryData: OpenVaultsData = openVaultsResponse?.vaults?.nodes?.map((vaultNode) => {
    const idSegments = vaultNode.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${vaultNode.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');
    return {
      ...oraclePrices[vaultNode.token],
      ...vaultManagerGovernances[managerName],
      ...vaultNode,
    };
  });

  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <VaultManagerCountCard data={vaultsDashboardQueryData} isLoading={vaultsDashboardIsLoading} />
          <ActiveVaultCountCard data={vaultsDashboardQueryData} isLoading={vaultsDashboardIsLoading} />
          <VaultTotalLockedCollateralValueCard data={vaultsDashboardQueryData} isLoading={vaultsDashboardIsLoading} />
        </ValueCardGrid>
        <TokenPrices data={vaultsDashboardQueryData} isLoading={vaultsDashboardIsLoading} />
        <VaultTotalLockedCollateralChart />
        <VaultTotalMintedISTChart />
        <hr className="my-5" />
        <VaultManagers data={vaultsDashboardQueryData} isLoading={vaultsDashboardIsLoading} />
        <hr className="my-5" />
        <OpenVaults data={openVaultsQueryData} isLoading={openVaultsIsLoading} />
      </PageContent>
    </>
  );
}
