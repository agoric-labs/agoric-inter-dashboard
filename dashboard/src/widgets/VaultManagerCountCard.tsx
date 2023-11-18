import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function VaultManagerCountCard({ title = 'Total Collateral Types' }: Props) {
  const res = useCubeQuery({
    measures: ['vault_factory_metrics.manager_idx_count'],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const rows = resultSet.tablePivot();
  if (rows.length === 0) {
    return null;
  }

  return <ValueCard title={title} value={rows[0]['vault_factory_metrics.manager_idx_count'] as string} />;
}
