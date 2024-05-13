import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr/immutable';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { VAULTS_DAILY_METRICS_QUERY } from '@/queries';
import { extractDailyOracles, populateMissingDays, subQueryFetcher } from '@/utils';
import ChartsSkeleton from './ChartsSkeleton';
import { GRAPH_DAYS } from '@/constants';

type Props = {
  tokenNames: Array<string>;
  vaultsDataIsLoading: boolean;
  error: any;
};

type GraphData = { key: number; x: string };
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
 
  const dailyMetricsResponse = dailyMetricsData?.data?.data;

  const graphDataMap: { [key: number]: GraphData } = {};

  
  tokenNames.forEach((tokenName) => {
    const dailyOracles = extractDailyOracles(tokenName, dailyMetricsResponse);

    dailyMetricsResponse?.[tokenName]?.nodes.forEach((dailyTokenMetrics: any) => {
      const dateKey = dailyTokenMetrics?.dateKey;

      const oracle = (dailyOracles && dailyOracles[dateKey]) || { typeOutAmountLast: 1, typeInAmountLast: 1 };
      const blockTime = dailyTokenMetrics?.blockTimeLast?.slice(0, 10);
      const liquidatingCollateralBrand = dailyTokenMetrics?.liquidatingCollateralBrand;
      const totalCollateralLast = dailyTokenMetrics?.totalCollateralLast;
      const totalDebtLast = dailyTokenMetrics?.totalDebtLast;
      const typeOutAmountLast = Number(oracle.typeOutAmountLast);
      const typeInAmountLast = Number(oracle.typeInAmountLast);
      const totalCollateral = (totalCollateralLast / 1_000_000) * (typeOutAmountLast / typeInAmountLast);

      graphDataMap[dateKey] = {
        ...graphDataMap[dateKey],
        x: blockTime,
        key: dateKey,
        [`${liquidatingCollateralBrand}-total_collateral`]: totalCollateral,
        [`${liquidatingCollateralBrand}-total_minted`]: totalDebtLast,
      };
    });
  });

  const graphDataList = populateMissingDays(graphDataMap, GRAPH_DAYS);

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
