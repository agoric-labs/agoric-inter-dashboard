import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function ActiveVaultCountCard({ title = 'Total Active Vaults' }: Props) {
  const res = useCubeQuery({
    measures: ['vault_factory_metrics.num_active_vaults_last'],
    dimensions: [
      'vault_factory_metrics.collateral_type',
      'vault_factory_metrics.manager_idx',
      'vault_factory_metrics.debt_type',
    ],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        dateRange: 'Today',
        granularity: 'day',
      },
    ],
    order: {},
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value="Loading..." />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const rows = resultSet.tablePivot();
  if (rows.length === 0) {
    return null;
  }

  return (
    <>
      {rows.map(r => (
        <ValueCard
          key={r['vault_factory_metrics.collateral_type'] as string}
          title={`${title} (${r['vault_factory_metrics.collateral_type']})`}
          value={r['vault_factory_metrics.num_active_vaults_last'] as string}
        />
      ))}
    </>
  );
}
