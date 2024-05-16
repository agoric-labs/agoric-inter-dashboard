import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr/immutable';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { VAULTS_DAILY_METRICS_QUERY } from '@/queries';
import { createNumberWithLeadingZeroes, extractDailyOracles, populateMissingDays, subQueryFetcher } from '@/utils';
import ChartsSkeleton from './ChartsSkeleton';
import { GRAPH_DAYS } from '@/constants';
import { DailyOracles, FormattedGraphData } from '@/types/common';
import { GraphData } from '@/types/psm-types';
import { BoardAuxesMap, VaultDailyMetricsQueryResponse, VaultManagerMetricsNode } from '@/types/vault-types';

type Props = {
  tokenNames: Array<string>;
  vaultsDataIsLoading: boolean;
  boardAuxes: BoardAuxesMap;
  error: any;
};

export function populateGraphData(
  dailyOracles: DailyOracles,
  nodes: any,
  boardAuxes: BoardAuxesMap,
  graphData: Record<string, GraphData>,
): void {
  for (let j = 0; j < nodes?.length; j++) {
    const dailyTokenMetrics = nodes[j];
    const dateKey = dailyTokenMetrics?.dateKey;

    const oracle = (dailyOracles && dailyOracles[dateKey]) || { typeOutAmountLast: 1, typeInAmountLast: 1 };
    const blockTime = dailyTokenMetrics?.blockTimeLast?.slice(0, 10);
    const liquidatingCollateralBrand = dailyTokenMetrics?.liquidatingCollateralBrand;
    const decimalPlaces = (boardAuxes && boardAuxes[liquidatingCollateralBrand]) || 6;
    const divisor = createNumberWithLeadingZeroes(decimalPlaces);

    const totalCollateralLast = Number(dailyTokenMetrics?.totalCollateralLast);
    const totalDebtLast = Number(dailyTokenMetrics?.totalDebtLast) / divisor;
    const typeOutAmountLast = Number(oracle.typeOutAmountLast);
    const typeInAmountLast = Number(oracle.typeInAmountLast);
    const totalCollateral = (totalCollateralLast / divisor) * (typeOutAmountLast / typeInAmountLast);

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
  boardAuxes: BoardAuxesMap,
  graphData: Record<string, GraphData>,
): FormattedGraphData[] {
  for (let i = 0; i < tokenNames?.length; i++) {
    const tokenName = tokenNames[i];
    const dailyOracles = extractDailyOracles(tokenName, dailyMetricsResponse);

    const nodes = dailyMetricsResponse?.[tokenName]?.nodes;
    if (nodes) {
      populateGraphData(dailyOracles, nodes, boardAuxes, graphData);
    }
  }

  const graphDataList = populateMissingDays(graphData, GRAPH_DAYS);
  return graphDataList;
}

export function VaultCharts({ tokenNames, vaultsDataIsLoading, error, boardAuxes }: Props) {
  const {
    data: dailyMetricsData,
    isLoading: graphDataIsLoading,
    error: graphDataError,
  } = useSWR<AxiosResponse, AxiosError>(tokenNames.length ? VAULTS_DAILY_METRICS_QUERY(tokenNames) : null, subQueryFetcher);

  if (vaultsDataIsLoading || error) {
    return (
      <>
        <ChartsSkeleton title="Total Locked Collateral" isLoading={vaultsDataIsLoading} error={error} />
        <ChartsSkeleton title="Total Minted IST" isLoading={vaultsDataIsLoading} error={error} />
      </>
    );
  }

  const dailyMetricsResponse: VaultDailyMetricsQueryResponse = dailyMetricsData?.data?.data;

  const graphData: Record<string, GraphData> = {};
  const graphDataList = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes, graphData);

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
