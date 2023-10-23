import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function VaultTotalLockedCollateralValueCard({ title = 'Total Locked Collateral Value' }: Props) {
  const res = useCubeQuery({
    measures: ['vault_managers.total_locked_collateral_usd_sum'],
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

  return (
    <ValueCard title={title} value={formatPrice(rows[0]['vault_managers.total_locked_collateral_usd_sum'] as string)} />
  );
}
