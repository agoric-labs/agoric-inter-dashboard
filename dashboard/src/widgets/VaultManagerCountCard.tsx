import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function VaultManagerCountCard({ title = 'Total Collateral Types' }: Props) {
  const res = useCubeQuery({
    measures: ['vault_managers.count'],
    order: {
      'vault_managers.count': 'desc',
    },
    timeDimensions: [
      {
        dimension: 'vault_managers.day',
        granularity: 'day',
        dateRange: 'Today',
      },
    ],
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

  return <ValueCard title={title} value={rows[0]['vault_managers.count'] as string} />;
}
