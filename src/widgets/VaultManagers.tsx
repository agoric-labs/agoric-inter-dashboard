import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { VaultManagersTable } from '@/components/VaultManagersTable';
import { SectionHeader } from '@/components/SectionHeader';
import { getCubeQueryView, extractFirst } from '@/utils';
import { useGetTokenPrice } from '@/components/OraclePrices';

type Props = {
  title?: string;
};

export function VaultManagers({ title = 'Collateral Type' }: Props) {
  const getTokenPrice = useGetTokenPrice();

  const res = useCubeQuery({
    measures: [
      'vault_factory_metrics.total_collateral_avg',
      'vault_factory_metrics.total_collateral_usd_avg',
      'vault_factory_metrics.total_debt_avg',
      'vault_factory_metrics.colletarization_ratio_avg',
      'vault_factory_governance.debt_limit_avg',
      'vault_factory_metrics.utilization_rate_avg',
    ],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        dateRange: 'from 1 days ago to now',
        granularity: 'day',
      },
    ],
    order: [
      ['vault_factory_metrics.day', 'desc'],
      ['vault_factory_metrics.manager_idx', 'asc'],
    ],
    dimensions: [
      'vault_factory_metrics.collateral_type',
      'vault_factory_metrics.debt_type',
      'vault_factory_metrics.manager_idx',
    ],
  });

  if (res.isLoading || !res.resultSet) {
    return (
      <>
        <SectionHeader>{title}</SectionHeader>
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
      </>
    );
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const firstDay = extractFirst(res, 'vault_factory_metrics.day.day');

  const rows = resultSet
    .tablePivot()
    .filter((row) => row['vault_factory_metrics.day.day'] === firstDay)
    .map((row: any) => {
      const newRow: any = {};

      Object.keys(row).forEach((key) => {
        newRow[key.replace('vault_factory_metrics.', '').replace('vault_factory_governance.', '').replace('_avg', '')] =
          row[key];
      });

      newRow.total_collateral_current_usd = getTokenPrice(newRow.collateral_type, newRow.total_collateral);

      return newRow;
    });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <VaultManagersTable data={rows} />
    </>
  );
}
