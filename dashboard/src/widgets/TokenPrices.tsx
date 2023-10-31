import { useCubeQuery } from '@cubejs-client/react';
import { SectionHeader } from '@/components/SectionHeader';
import { TokenPricesTable, Row } from '@/components/TokenPricesTable';
import { getCubeQueryView } from '@/utils';

import atom from '../icons/atom.svg';
import statom from '../icons/statom.svg';
import unknown from '../icons/unknown.svg';

type Props = {
  title?: string;
};

const icons: { [key: string]: string } = {
  ATOM: atom,
  STATOM1: atom,
  stATOM: statom,
  unknown,
};

export function TokenPrices({ title = 'Summary' }: Props) {
  const priceRes = useCubeQuery({
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

  const numRes = useCubeQuery({
    measures: ['vault_factory_metrics.num_active_vaults_last'],
    dimensions: [
      'vault_factory_metrics.collateral_type',
      'vault_factory_metrics.manager_idx',
      'vault_factory_metrics.debt_type',
    ],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        dateRange: 'Today',
        granularity: 'day',
      },
    ],
  });

  if (priceRes.isLoading || !priceRes.resultSet || numRes.isLoading || !numRes.resultSet) {
    return (
      <>
        <SectionHeader>{title}</SectionHeader>
        <div>Loading...</div>
      </>
    );
  }

  const [resultSet, requestView] = getCubeQueryView(priceRes);
  if (!resultSet) {
    return requestView;
  }

  const [resultNumSet, requestNumView] = getCubeQueryView(numRes);
  if (!resultNumSet) {
    return requestNumView;
  }

  const nums: { [key: string]: number } = {};

  resultNumSet.tablePivot().forEach((row: any) => {
    nums[row['vault_factory_metrics.collateral_type']] = row['vault_factory_metrics.num_active_vaults_last'];
  });

  const tokenData: { [key: string]: number[] } = {};

  resultSet.tablePivot().forEach((row: any) => {
    const feed = row['oracle_prices.price_feed_name'];

    if (!tokenData[feed]) {
      tokenData[feed] = [];
    }

    tokenData[feed].push(row['oracle_prices.rate_avg']);
  });

  const rows: Row[] = [];

  Object.keys(tokenData).forEach(feed => {
    if (tokenData[feed].length === 0) {
      return;
    }

    const label = feed.replace(/(\w+)-(\w+?)_.*/g, '$1');

    const change = 1 - tokenData[feed][1] / tokenData[feed][0];
    const changeValue = Math.round(change * 10000) / 100;

    rows.push({
      token: (
        <span className="flex">
          <img src={icons[label] || icons.unknown} alt={label} width="w-4 h-4" />{' '}
          <span className="flex-1 ml-2">{label}</span>
        </span>
      ),
      numActive: nums[label],
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
