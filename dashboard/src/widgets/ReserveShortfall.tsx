import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

export function ReserveShortfall() {
  const res = useCubeQuery({
    measures: ['reserve.shortfall_balance_avg'],
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

  return <ValueCard title="Reserve Shortfall" value={formatPrice(latest['reserve.shortfall_balance_avg'] || 0)} />;
}
