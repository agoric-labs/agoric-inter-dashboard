import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { VaultManagersTable } from '@/components/VaultManagersTable';
import { SectionHeader } from '@/components/SectionHeader';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function VaultManagers({ title = 'Collateral Type' }: Props) {
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
        dateRange: 'Today',
        granularity: 'day',
      },
    ],
    order: {
      'vault_factory_metrics.manager_idx': 'asc',
    },
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
        <Skeleton className="w-max-64 h-[50px] rounded mb-2" />
      </>
    );
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const rows = resultSet.tablePivot().map((row: any) => {
    const newRow: any = {};

    Object.keys(row).forEach((key) => {
      newRow[key.replace('vault_factory_metrics.', '').replace('vault_factory_governance.', '').replace('_avg', '')] =
        row[key];
    });

    return newRow;
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <VaultManagersTable data={rows} />
    </>
  );
}
