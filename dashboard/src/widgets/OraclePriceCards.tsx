import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function OraclePriceCards({ title = 'Smart Wallets Provisioned' }: Props) {
  const res = useCubeQuery({
    measures: ['oracle_prices.rate_avg'],
    timeDimensions: [
      {
        dimension: 'oracle_prices.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: {
      'oracle_prices.day': 'desc',
    },
    dimensions: ['oracle_prices.price_feed_name'],
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value="Loading..." />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  return (
    <>
      {resultSet.tablePivot().map((row) => {
        const rawLabel = row['oracle_prices.price_feed_name'].toString();
        const value = row['oracle_prices.rate_avg'].toString();

        const label = rawLabel.replace(/(\w+)-(\w+?)_.*/g, '$1 ↔︎ $2');

        return (
          <ValueCard title={`Oracle Price, ${label}`} value={rawLabel.includes('USD') ? formatPrice(value) : value} />
        );
      })}
    </>
  );
}
