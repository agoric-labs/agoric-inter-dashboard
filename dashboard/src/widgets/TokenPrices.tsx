import { useCubeQuery } from '@cubejs-client/react';
import { SectionHeader } from '@/components/SectionHeader';
import { TokenPricesTable, Row } from '@/components/TokenPricesTable';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function TokenPrices({ title = 'Token Prices' }: Props) {
  const res = useCubeQuery({
    measures: ['oracle_prices.rate_avg'],
    timeDimensions: [
      {
        dimension: 'oracle_prices.day',
        granularity: 'day',
        dateRange: 'Last 7 days',
      },
    ],
    order: [['oracle_prices.day', 'desc']],
    dimensions: ['oracle_prices.price_feed_name'],
  });

  if (res.isLoading || !res.resultSet) {
    return (
      <>
        <SectionHeader>{title}</SectionHeader>
        <div>Loading...</div>
      </>
    );
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const tokenData: { [key: string]: number[] } = {};

  resultSet.tablePivot().forEach((row: any) => {
    const feed = row['oracle_prices.price_feed_name'];

    if (!tokenData[feed]) {
      tokenData[feed] = [];
    }

    tokenData[feed].push(row['oracle_prices.rate_avg']);
  });

  const rows: Row[] = [];

  Object.keys(tokenData).forEach((feed) => {
    if (tokenData[feed].length === 0) {
      return;
    }

    const label = feed.replace(/(\w+)-(\w+?)_.*/g, '$1');

    const change = 1 - tokenData[feed][1] / tokenData[feed][0];
    const changeValue = Math.round(change * 10000) / 100;

    rows.push({
      token: label,
      dayChange:
        changeValue >= 0 ? (
          <div className="text-right text-green-500">+{changeValue}%</div>
        ) : (
          <div className="text-right text-red-500">{changeValue}%</div>
        ),
      oraclePrice: tokenData[feed][0],
    });
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <TokenPricesTable data={rows} />
    </>
  );
}
