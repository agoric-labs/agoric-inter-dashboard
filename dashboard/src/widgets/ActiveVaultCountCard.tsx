import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function ActiveVaultCountCard({ title = 'Total Active Vaults' }: Props) {
  const res = useCubeQuery({
    measures: ['open_vaults.count'],
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

  return <ValueCard title={title} value={rows[0]['open_vaults.count'] as string} />;
}
