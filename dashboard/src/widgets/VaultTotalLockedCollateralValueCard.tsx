import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function VaultTotalLockedCollateralValueCard({ title = 'Total Locked Collateral Value' }: Props) {
  const res = useCubeQuery({
    measures: ['vault_factory_metrics.total_collateral_usd_sum'],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: {
      'vault_factory_metrics.day': 'desc',
    },
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

  return (
    <ValueCard title={title} value={formatPrice(rows[0]['vault_factory_metrics.total_collateral_usd_sum'] as string)} />
  );
}
