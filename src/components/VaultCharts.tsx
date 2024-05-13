import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr/immutable';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { VAULTS_DAILY_METRICS_QUERY } from '@/queries';
import { extractDailyOracles, populateMissingDays, subQueryFetcher } from '@/utils';
import ChartsSkeleton from './ChartsSkeleton';
import { GRAPH_DAYS } from '@/constants';
import { DailyOracles, FormattedGraphData } from '@/types/common';
import { GraphData } from '@/types/psm-types';
import { VaultDailyMetricsQueryResponse } from '@/types/vault-types';

type Props = {
  tokenNames: Array<string>;
  vaultsDataIsLoading: boolean;
  error: any;
};

export function populateGraphData(dailyOracles: DailyOracles, nodes: any[], graphData: Record<string, GraphData>): void {
  for (let j = 0; j < nodes.length; j++) {
    const dailyTokenMetrics = nodes[j];
    const dateKey = dailyTokenMetrics?.dateKey;

    const oracle = (dailyOracles && dailyOracles[dateKey]) || { typeOutAmountLast: 1, typeInAmountLast: 1 };
    const blockTime = dailyTokenMetrics?.blockTimeLast?.slice(0, 10);
    const liquidatingCollateralBrand = dailyTokenMetrics?.liquidatingCollateralBrand;
    const totalCollateralLast = dailyTokenMetrics?.totalCollateralLast;
    const totalDebtLast = dailyTokenMetrics?.totalDebtLast;
    const typeOutAmountLast = Number(oracle.typeOutAmountLast);
    const typeInAmountLast = Number(oracle.typeInAmountLast);
    const totalCollateral = (totalCollateralLast / 1_000_000) * (typeOutAmountLast / typeInAmountLast);

    graphData[dateKey] = {
      ...graphData[dateKey],
      x: blockTime,
      key: dateKey,
      [`${liquidatingCollateralBrand}-total_collateral`]: totalCollateral,
      [`${liquidatingCollateralBrand}-total_minted`]: totalDebtLast,
    };
  }
}

export function constructGraph(
  tokenNames: string[],
  dailyMetricsResponse: VaultDailyMetricsQueryResponse,
  graphData: Record<string, GraphData>,
): FormattedGraphData[] {
  for (let i = 0; i < tokenNames?.length; i++) {
    const tokenName = tokenNames[i];
    const dailyOracles = extractDailyOracles(tokenName, dailyMetricsResponse);

    const nodes = dailyMetricsResponse?.[tokenName]?.nodes;
    if (nodes) {
      populateGraphData(dailyOracles, nodes, graphData);
    }
  }

  const graphDataList = populateMissingDays(graphData, GRAPH_DAYS);
  return graphDataList;
}

export function VaultCharts({ tokenNames, vaultsDataIsLoading, error }: Props) {
  if (vaultsDataIsLoading || error) {
    return (
      <>
        <ChartsSkeleton title="Total Locked Collateral" isLoading={vaultsDataIsLoading} error={error} />
        <ChartsSkeleton title="Total Minted IST" isLoading={vaultsDataIsLoading} error={error} />
      </>
    );
  }

  const {
    data: dailyMetricsData,
    isLoading: graphDataIsLoading,
    error: graphDataError,
  } = useSWR<AxiosResponse, AxiosError>(VAULTS_DAILY_METRICS_QUERY(tokenNames), subQueryFetcher);

  const dailyMetricsResponse: VaultDailyMetricsQueryResponse = dailyMetricsData?.data?.data;

  const graphData: Record<string, GraphData> = {};
  const graphDataList = constructGraph(tokenNames, dailyMetricsResponse, graphData);

  return (
    <>
      <VaultTotalLockedCollateralChart
        data={graphDataList}
        tokenNames={tokenNames}
        isLoading={graphDataIsLoading}
        error={graphDataError}
      />
      <VaultTotalMintedISTChart
        data={graphDataList}
        tokenNames={tokenNames}
        isLoading={graphDataIsLoading}
        error={graphDataError}
      />
    </>
  );
}
