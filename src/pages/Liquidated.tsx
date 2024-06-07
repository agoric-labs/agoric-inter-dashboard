import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { LiquidatedVaultCountCard } from '@/widgets/LiquidatedVaultCountCard';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { populateMissingDays, subQueryFetcher } from '@/utils';
import { LIQUIDATIONS_DASHBOARD, LIQUIDATION_GRAPH_TOKENS_QUERY, LIQUIDATION_DAILY_METRICS_QUERY } from '@/queries';
import {
  GraphData,
  LiquidationDashboardResponse,
  LiquidationMetricsDailyResponse,
  TokenNamesResponse,
} from '@/types/liquidation-types';
import { GRAPH_DAYS, SUBQUERY_STAGING_URL } from '@/constants';

const sum = (items: Array<string>) => items.reduce((agg, next) => agg + Number(next), 0);

export function Liquidated() {
  const { data, isLoading } = useSWR<AxiosResponse, AxiosError>(LIQUIDATIONS_DASHBOARD, (query: string) =>
    subQueryFetcher(query, SUBQUERY_STAGING_URL),
  );
  const response: LiquidationDashboardResponse = data?.data?.data;

  const boardAuxes: { [key: string]: number } = response?.boardAuxes?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.allegedName]: node.decimalPlaces }),
    {},
  );

  const liquidationDashboardData = {
    vaultLiquidations: response?.vaultLiquidations?.nodes,
  };

  //  Queries for graph
  const { data: tokenNamesData } = useSWR<AxiosResponse, AxiosError>(LIQUIDATION_GRAPH_TOKENS_QUERY, subQueryFetcher);
  const tokenNamesResponse: TokenNamesResponse = tokenNamesData?.data.data;
  const tokenNames = tokenNamesResponse?.vaultManagerMetrics.nodes.map((node) => node.liquidatingCollateralBrand) || [];

  const { data: dailyMetricsData, isLoading: graphDataIsLoading } = useSWR<AxiosResponse, AxiosError>(
    LIQUIDATION_DAILY_METRICS_QUERY(tokenNames),
    subQueryFetcher,
  );
  const dailyMetricsResponse: LiquidationMetricsDailyResponse = dailyMetricsData?.data?.data;
  const graphDataMap: { [key: number]: GraphData } = {};
  Object.values(dailyMetricsResponse || {}).forEach((tokenDataList) => {
    tokenDataList?.nodes.forEach((dailyTokenMetrics) => {
      graphDataMap[dailyTokenMetrics.dateKey] = {
        ...graphDataMap[dailyTokenMetrics.dateKey],
        x: dailyTokenMetrics.blockTimeLast.split('T')[0],
        key: dailyTokenMetrics.dateKey,
        active: {
          ...graphDataMap[dailyTokenMetrics.dateKey]?.active,
          [dailyTokenMetrics.liquidatingCollateralBrand]: dailyTokenMetrics.numActiveVaultsLast,
        },
        liquidated: {
          ...graphDataMap[dailyTokenMetrics.dateKey]?.liquidated,
          [dailyTokenMetrics.liquidatingCollateralBrand]: dailyTokenMetrics.numLiquidationsCompletedLast,
        },
      };
    });
  });

  const graphDataList = populateMissingDays(graphDataMap, GRAPH_DAYS);

  const summedGraphDataList = graphDataList.map((item) => {
    const totalActive = item.active ? sum(Object.values(item.active)) : NaN;
    const totalLiquidated = item.liquidated ? sum(Object.values(item.liquidated)) : NaN;

    return {
      ...item,
      active: totalActive,
      liquidated: totalLiquidated,
    };
  });

  return (
    <>
      <PageHeader title="Liquidated Vaults" />
      <PageContent>
        <ValueCardGrid>
          <LiquidatedVaultCountCard data={response?.vaultManagerMetrics?.nodes} isLoading={isLoading} />
        </ValueCardGrid>
        <VaultStatesChart data={summedGraphDataList} isLoading={graphDataIsLoading} />
        <hr className="my-5" />
        <LiquidatedVaults data={liquidationDashboardData} boardAuxes={boardAuxes} isLoading={isLoading} />
      </PageContent>
    </>
  );
}
