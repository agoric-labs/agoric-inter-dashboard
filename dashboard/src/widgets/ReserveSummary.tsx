import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

export function ReserveSummary() {
  const res = useCubeQuery({
    measures: ['reserve_allocations.amount_usd_sum'],
    timeDimensions: [
      {
        dimension: 'reserve_allocations.day',
        granularity: 'day',
        dateRange: 'Today',
      },
    ],
    order: {
      'reserve_allocations.day': 'desc',
    },
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const latest = resultSet.tablePivot()[0];
  if (!latest) {
    return <div>Nothing to show</div>;
  }

  return <ValueCard title="Total Reserve Assets" value={formatPrice(latest['reserve_allocations.amount_usd_sum'])} />;
}
