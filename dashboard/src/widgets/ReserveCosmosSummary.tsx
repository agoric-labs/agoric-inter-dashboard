import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

export function ReserveCosmosSummary() {
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

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const latest = resultSet.tablePivot()[0];
  if (!latest) {
    return <div>Nothing to show</div>;
  }

  return <ValueCard title="Total Reserve Assets (Cosmos Layer)" value={formatPrice(latest['balances.amount_sum'])} />;
}
