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
import {
  VAULTS_DASHBOARD_QUERY,
  OPEN_VAULTS_QUERY,
  VAULTS_GRAPH_TOKENS_QUERY,
  VAULTS_DAILY_METRICS_QUERY,
} from '@/queries';
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
type VaultDashboardManagerGovernancesNode = {
  id: string;
  debtLimit: number;
};

type VaultsDashboardResponse = {
  boardAuxes: { nodes: Array<{ allegedName: string; decimalPlaces: number }> };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
  vaultManagerGovernances: { nodes: Array<VaultDashboardManagerGovernancesNode> };
};

type OpenVaultsResponse = {
  vaults: {
    nodes: Array<VaultsNode>;
  };
  oraclePrices: { nodes: Array<OraclePriceNode> };
  vaultManagerGovernances: { nodes: Array<VaultManagerGovernancesNode> };
};

type VaultManagerMetricsResponse = {
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
};

type GraphData = { key: number; x: string };

export type VaultsDashboardData = {
  [key: string]: VaultManagerMetricsNode & OraclePriceNode & VaultDashboardManagerGovernancesNode;
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

  const vaultsDashboardManagerGovernances: { [key: string]: VaultDashboardManagerGovernancesNode } =
    vaultsDashboardResponse?.vaultManagerGovernances?.nodes?.reduce((agg, node) => {
      const idSegments = node.id.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return { ...agg, [managerName]: node };
    }, {});
  const vaultsDashboardQueryData: VaultsDashboardData = vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.reduce(
    (agg, node) => {
      const idSegments = node.id.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return {
        ...agg,
        [node.liquidatingCollateralBrand]: {
          ...vaultsDashboardManagerGovernances[managerName],
          ...vaultDashboardOraclePrices[node.liquidatingCollateralBrand],
          ...node,
        },
      };
    },
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

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(VAULTS_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: VaultManagerMetricsResponse = tokenNamesData?.data.data;
  const tokenNames = tokenNamesResponse?.vaultManagerMetrics.nodes.map((node) => node.liquidatingCollateralBrand) || [];
  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    VAULTS_DAILY_METRICS_QUERY(tokenNames),
    subQueryFetcher,
  );
  const dailyMetricsResponse = dailyMetricsData?.data.data;

  const graphDataMap: { [key: number]: GraphData } = {};
  tokenNames.forEach((tokenName) => {
    const dailyOracles = dailyMetricsResponse?.[`${tokenName}_oracle`].nodes.reduce(
      (agg: object, dailyOracleData: { dateKey: string }) => ({ ...agg, [dailyOracleData.dateKey]: dailyOracleData }),
      {},
    );

    dailyMetricsResponse?.[tokenName].nodes.forEach((dailyTokenMetrics: any) => {
      const oracle = dailyOracles[dailyTokenMetrics.dateKey] || { typeOutAmountLast: 0, typeInAmountLast: 1 };
      graphDataMap[dailyTokenMetrics.dateKey] = {
        ...graphDataMap[dailyTokenMetrics.dateKey],
        x: dailyTokenMetrics.blockTimeLast.slice(0, 10),
        key: dailyTokenMetrics.dateKey,
        [`${dailyTokenMetrics.liquidatingCollateralBrand}-total_collateral`]:
          (dailyTokenMetrics.totalCollateralLast / 1_000_000) * (oracle.typeOutAmountLast / oracle.typeInAmountLast),
        [`${dailyTokenMetrics.liquidatingCollateralBrand}-total_minted`]:
          dailyTokenMetrics.totalDebtSum / dailyTokenMetrics.metricsCount / 1000_000,
      };
    });
  });

  const sortedGraphDataList = Object.values(graphDataMap)
    .slice()
    .sort((a, b) => a.key - b.key);
  let prevValue: GraphData = sortedGraphDataList[0];
  const graphDataList: Array<GraphData> = sortedGraphDataList.reduce(
    (aggArray: Array<GraphData>, graphData: GraphData) => {
      // filling in missing days
      const prevDay = new Date(prevValue.x);
      const nextDay = new Date(graphData.x);
      const timeDiff = nextDay.getTime() - prevDay.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const missingDays =
        diffDays > 1
          ? Array.from(Array(diffDays - 1).keys()).map((idx) => {
              const newDate = new Date(prevDay);
              newDate.setDate(prevDay.getDate() + 1 + idx);
              const newDateString = newDate.toISOString().slice(0, 10);
              const dateKey = Number(newDateString.replaceAll('-', ''));
              return { ...prevValue, x: newDateString, key: dateKey };
            })
          : [];

      const newAggArray = [...aggArray, ...missingDays, { ...prevValue, ...graphData }];
      prevValue = { ...prevValue, ...graphData };
      return newAggArray;
    },
    [],
  ).slice(-90);;

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
        <VaultTotalLockedCollateralChart data={graphDataList} tokenNames={tokenNames} isLoading={graphDataIsLoading} />
        <VaultTotalMintedISTChart data={graphDataList} tokenNames={tokenNames} isLoading={graphDataIsLoading} />
        <hr className="my-5" />
        <VaultManagers data={vaultsDashboardQueryData} isLoading={vaultsDashboardIsLoading} />
        <hr className="my-5" />
        <OpenVaults data={openVaultsQueryData} isLoading={openVaultsIsLoading} />
      </PageContent>
    </>
  );
}
