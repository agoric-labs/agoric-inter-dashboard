import { useCubeQuery } from '@cubejs-client/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

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
        dateRange: 'Today',
      },
    ],
    filters: [
      {
        member: 'balances.denom',
        operator: 'equals',
        values: ['uist'],
      },
      {
        member: 'balances.address',
        operator: 'contains',
        values: ['agoric1ae0lmtzlgrcnla9xjkpaarq5d5dfez63h3nucl'],
      },
    ],
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value={<Skeleton className="w-[120px] h-[32px] rounded-full" />} />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const latest = resultSet.tablePivot()[0];
  if (!latest) {
    return <div>Nothing to show</div>;
  }

  return <ValueCard title={title} value={formatPrice(latest['balances.amount_sum'])} />;
}
