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

type GraphData = { key: number; x: string };

type OraclePriceDailiesArr = {
  oracleDailyPrices: Array<OraclePriceDailiesNode>;
};

type OraclePriceNodesData = { [key: string]: OraclePriceNode };
type OracleDailyPriceNodesData = { [key: string]: OraclePriceDailiesNode[] };
type VaultManagerGovernancesNodesData = { [key: string]: VaultManagerGovernancesNode };

export type VaultsDashboardData = {
  [key: string]: VaultManagerMetricsNode &
    OraclePriceNode &
    VaultManagerGovernancesNode &
    VaultsNode &
    OraclePriceDailiesArr;
};
export type OpenVaultsData = Array<VaultsNode & OraclePriceNode & VaultManagerGovernancesNode>;

export function Vaults() {
  const { data, isLoading: vaultsDashboardIsLoading } = useSWR<AxiosResponse, AxiosError>(
    VAULTS_DASHBOARD_QUERY,
    subQueryFetcher,
  );

  const vaultsDashboardResponse: VaultsDashboardResponse = data?.data?.data;

  const oraclePrices: OraclePriceNodesData = vaultsDashboardResponse?.oraclePrices?.nodes?.reduce((agg, node) => {
    const nameSegments = node.priceFeedName.split('-');
    if (nameSegments.length !== 2) {
      throw new Error(`Invalid priceFeedName: ${node.priceFeedName}`);
    }
    const tokenName = nameSegments[0];
    return { ...agg, [tokenName]: node };
  }, {});

    const oracleDailyPrices: OracleDailyPriceNodesData = {};
    vaultsDashboardResponse?.oraclePriceDailies?.nodes?.forEach((node) => {
      const typeInName = node.typeInName;

      if (!(typeInName in oracleDailyPrices)) {
        oracleDailyPrices[typeInName] = [];
      }

      oracleDailyPrices[typeInName].push(node);
    });

  const managerGovernancesNodes: VaultManagerGovernancesNodesData =
    vaultsDashboardResponse?.vaultManagerGovernances?.nodes?.reduce((agg, node) => {
      const idSegments = node.id.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return { ...agg, [managerName]: node };
    }, {});

  const vaultsDashboardData: VaultsDashboardData = vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.reduce(
    (agg, node) => {
      const idSegments = node.id.split('.');
      if (idSegments.length < 4) {
        throw new Error(`Node ID does not contain enough segments: ${node.id}`);
      }
      const managerName = idSegments.slice(0, 4).join('.');
      return {
        ...agg,
        [node.liquidatingCollateralBrand]: {
          ...managerGovernancesNodes[managerName],
          ...oraclePrices[node.liquidatingCollateralBrand],
          ...node,
          oracleDailyPrices: [...(oracleDailyPrices[node.liquidatingCollateralBrand] || [])],
        },
      };
    },
    {},
  );

  const openVaultsData: OpenVaultsData = vaultsDashboardResponse?.vaults?.nodes?.map((vaultNode) => {
    const idSegments = vaultNode.id.split('.');
    if (idSegments.length < 4) {
      throw new Error(`Node ID does not contain enough segments: ${vaultNode.id}`);
    }
    const managerName = idSegments.slice(0, 4).join('.');
    return {
      ...oraclePrices[vaultNode.token],
      ...managerGovernancesNodes[managerName],
      ...vaultNode,
    };
  });

  const tokenNames = vaultsDashboardResponse?.vaultManagerMetrics?.nodes?.map((node) => node.liquidatingCollateralBrand) || [];
  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    VAULTS_DAILY_METRICS_QUERY(tokenNames),
    subQueryFetcher,
  );
  const dailyMetricsResponse = dailyMetricsData?.data?.data;

  const graphDataMap: { [key: number]: GraphData } = {};
  tokenNames.forEach((tokenName) => {
    const dailyOracles = dailyMetricsResponse?.[`${tokenName}_oracle`].nodes.reduce(
      (agg: object, dailyOracleData: { dateKey: string }) => ({ ...agg, [dailyOracleData.dateKey]: dailyOracleData }),
      {},
    );

    dailyMetricsResponse?.[tokenName]?.nodes.forEach((dailyTokenMetrics: any) => {
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
          <VaultManagerCountCard data={vaultsDashboardData} isLoading={vaultsDashboardIsLoading} />
          <ActiveVaultCountCard data={vaultsDashboardData} isLoading={vaultsDashboardIsLoading} />
          <VaultTotalLockedCollateralValueCard data={vaultsDashboardData} isLoading={vaultsDashboardIsLoading} />
        </ValueCardGrid>
        <TokenPrices data={vaultsDashboardData} isLoading={vaultsDashboardIsLoading} />
        <VaultTotalLockedCollateralChart data={graphDataList} tokenNames={tokenNames} isLoading={graphDataIsLoading} />
        <VaultTotalMintedISTChart data={graphDataList} tokenNames={tokenNames} isLoading={graphDataIsLoading} />
        <hr className="my-5" />
        <VaultManagers data={vaultsDashboardData} isLoading={vaultsDashboardIsLoading} />
        <hr className="my-5" />
        <OpenVaults data={openVaultsData} isLoading={vaultsDashboardIsLoading} />
      </PageContent>
    </>
  );
}
