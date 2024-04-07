import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { LiquidatedVaultCountCard } from '@/widgets/LiquidatedVaultCountCard';
import { subQueryFetcher } from '@/utils';
import { LIQUIDATIONS_DASHBOARD } from '@/queries';

export type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralValue: number;
  numActiveVaults: number;
  numLiquidatingVaults: number;
  numLiquidationsAborted: number;
  numLiquidationsCompleted: number;
};
type VaultManagerGovernancesNode = {
  id: string;
  liquidationMarginDenominator: number;
  liquidationMarginNumerator: number;
};
type VaultsNode = {
  balance: number;
  debt: number;
  id: string;
  state: string;
  token: string;
};

type LiquidationDashboardResponse = {
  vaults: { nodes: Array<VaultsNode> };
  vaultManagerGovernances: {
    nodes: Array<VaultManagerGovernancesNode>;
  };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
};
export type LiquidationDashboardData = {
  vaults: Array<VaultsNode>;
  vaultManagerGovernances: { [key: string]: VaultManagerGovernancesNode };
};

export function Liquidated() {
  const { data, isLoading } = useSWR<AxiosResponse, AxiosError>(LIQUIDATIONS_DASHBOARD, subQueryFetcher);
  const response: LiquidationDashboardResponse = data?.data?.data;

  const vaultManagerGovernances: { [key: string]: VaultManagerGovernancesNode } =
    response?.vaultManagerGovernances?.nodes?.reduce((agg, node) => {
      const idSegments = node?.id?.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return { ...agg, [managerName]: node };
    }, {});
  const liquidationDashboardData = {
    vaultManagerGovernances,
    vaults: response?.vaults?.nodes,
  };

  return (
    <>
      <PageHeader title="Liquidated Vaults" />
      <PageContent>
        <ValueCardGrid>
          <LiquidatedVaultCountCard data={response?.vaultManagerMetrics?.nodes} isLoading={isLoading} />
        </ValueCardGrid>
        <VaultStatesChart />
        <hr className="my-5" />
        <LiquidatedVaults data={liquidationDashboardData} isLoading={isLoading} />
      </PageContent>
    </>
  );
}
