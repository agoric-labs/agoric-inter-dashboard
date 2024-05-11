import { AxiosError, AxiosResponse } from 'axios';
import useSWR from 'swr/immutable';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { VAULTS_DAILY_METRICS_QUERY } from '@/queries';
import { populateMissingDays, subQueryFetcher } from '@/utils';
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
    const dailyOracles = dailyMetricsResponse?.[`${tokenName}_oracle`]?.nodes.reduce(
      (agg: object, dailyOracleData: { dateKey: string }) => ({ ...agg, [dailyOracleData?.dateKey]: dailyOracleData }),
      {},
    );

    dailyMetricsResponse?.[tokenName]?.nodes.forEach((dailyTokenMetrics: any) => {
      let oracle;

      if (dailyTokenMetrics?.dateKey in dailyOracles) {
        oracle = dailyOracles[dailyTokenMetrics.dateKey];
      } else {
        oracle = { typeOutAmountLast: 0, typeInAmountLast: 1 };
      }

      graphDataMap[dailyTokenMetrics?.dateKey] = {
        ...graphDataMap[dailyTokenMetrics?.dateKey],
        x: dailyTokenMetrics?.blockTimeLast?.slice(0, 10),
        key: dailyTokenMetrics?.dateKey,
        [`${dailyTokenMetrics?.liquidatingCollateralBrand}-total_collateral`]:
          (dailyTokenMetrics?.totalCollateralLast / 1_000_000) * (oracle.typeOutAmountLast / oracle.typeInAmountLast),
        [`${dailyTokenMetrics?.liquidatingCollateralBrand}-total_minted`]:
          dailyTokenMetrics?.totalDebtLast,
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
