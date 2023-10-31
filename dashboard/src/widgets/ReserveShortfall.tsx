import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function ReserveShortfall({ title = 'Reserve Shortfall' }: Props) {
  const res = useCubeQuery({
    measures: ['reserve.shortfall_balance_avg'],
    timeDimensions: [{ dimension: 'reserve.day', granularity: 'day' }],
    order: {
      'reserve.day': 'desc',
    },
    limit: 1,
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const latest = resultSet.tablePivot()[0];
  if (!latest) {
    return <div>Nothing to show</div>;
  }

  return <ValueCard title={title} value={formatPrice(latest['reserve.shortfall_balance_avg'] || 0)} />;
}
