import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView, extractFirstFloat } from '@/utils';

type Props = {
  title?: string;
};

export function ReserveCosmosSummary({ title = 'Cosmos Reserve' }: Props) {
  const res = useCubeQuery({
    measures: ['balances.amount_sum'],
    timeDimensions: [
      {
        dimension: 'balances.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    segments: ['balances.cosmos_reserve'],
    order: {
      'balances.day': 'desc',
    },
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value={<Skeleton className="w-[120px] h-[32px] rounded-full" />} />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const latest = extractFirstFloat(res, 'balances.amount_sum');

  return <ValueCard title={title} value={formatPrice(latest)} />;
}
