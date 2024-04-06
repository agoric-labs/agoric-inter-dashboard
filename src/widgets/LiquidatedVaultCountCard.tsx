import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function LiquidatedVaultCountCard({ title = 'Total Liquidated Vaults' }: Props) {
  const res = useCubeQuery({
    measures: ['vault_factory_vaults.liquidated_count'],
    timeDimensions: [
      {
        dimension: 'vault_factory_vaults.day',
        dateRange: 'from 1 days ago to now',
        granularity: 'day',
      },
    ],
    order: {
      'vault_factory_vaults.day': 'desc',
    },
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

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

  return <ValueCard title={title} value={rows[0]['vault_factory_vaults.liquidated_count'] as string} />;
}