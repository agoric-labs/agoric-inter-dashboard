import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function ReserveSummary({ title = 'Total Reserve Assets' }: Props) {
  const res = useCubeQuery({
    measures: ['reserve_allocations.amount_usd_sum'],
    timeDimensions: [
      {
        dimension: 'reserve_allocations.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: {
      'reserve_allocations.day': 'desc',
    },
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

  return <ValueCard title={title} value={formatPrice(latest['reserve_allocations.amount_usd_sum'])} />;
}
