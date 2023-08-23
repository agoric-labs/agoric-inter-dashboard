import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

export function ReserveSummary() {
  const res = useCubeQuery({
    measures: ['reserve.shortfall_balance_avg', 'reserve.total_usd_avg'],
    timeDimensions: [{ dimension: 'reserve.day', granularity: 'day' }],
    order: {
      'reserve.day': 'desc',
    },
    limit: 1,
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const latest = resultSet.tablePivot()[0];
  if (!latest) {
    return <div>Nothing to show</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ValueCard title="Total Reserve Assets" value={formatPrice(latest['reserve.total_usd_avg'] || 0)} />
      <ValueCard title="Reserve Shortfall" value={formatPrice(latest['reserve.shortfall_balance_avg'] || 0)} />
    </div>
  );
}
