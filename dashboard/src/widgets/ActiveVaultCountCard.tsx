import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function ActiveVaultCountCard({ title = 'Total Active Vaults' }: Props) {
  const res = useCubeQuery({
    measures: ['open_vaults.count'],
    dimensions: ['open_vaults.debt_type', 'open_vaults.collateral_type'],
    timeDimensions: [
      {
        dimension: 'open_vaults.day',
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
          key={r['open_vaults.debt_type'] as string}
          title={`${title} (${r['open_vaults.collateral_type']})`}
          value={r['open_vaults.count'] as string}
        />
      ))}
    </>
  );
}
