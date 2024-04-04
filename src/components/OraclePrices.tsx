import { useCubeQuery } from '@cubejs-client/react';
import { createContext, useContext, useMemo, useCallback, ReactNode } from 'react';
import { Row } from './TokenPricesTable';

import atom from '../icons/atom.svg';
import statom from '../icons/statom.svg';
import unknown from '../icons/unknown.svg';
import osmosis from '../icons/osmosis.svg';
import sttia from '../icons/sttia.svg';
import stkdydx from '../icons/stkdydx.svg';
import stkatom from '../icons/stkatom.svg';

const Context = createContext<Row[] | null>(null);

export const icons: { [key: string]: string } = {
  atom,
  statom1: atom,
  statom,
  stosmo: osmosis,
  sttia,
  stkatom,
  stkdydx,
  unknown,
};

export function OraclePriceProvider({ children }: { children: ReactNode }) {
  const priceRes = useCubeQuery({
    measures: ['oracle_prices.rate_avg'],
    timeDimensions: [
      {
        dimension: 'oracle_prices.day',
        granularity: 'day',
        dateRange: 'Last 2 days',
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
        dateRange: 'from 1 days ago to now',
        granularity: 'day',
      },
    ],
  });

  const memoRows = useMemo(() => {
    if (priceRes.isLoading || !priceRes.resultSet || numRes.isLoading || !numRes.resultSet) {
      return null;
    }

    const { resultSet } = priceRes;
    const { resultSet: resultNumSet } = numRes;

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

    Object.keys(tokenData).forEach((feed) => {
      if (tokenData[feed].length === 0) {
        return;
      }

      const label = feed.replace(/(\w+)-(\w+?)_.*/g, '$1');

      const change = 1 - tokenData[feed][1] / tokenData[feed][0];
      const changeValue = Math.round(change * 10000) / 100;

      rows.push({
        name: label.toLowerCase(),
        token: (
          <span className="flex">
            <img src={icons[label.toLowerCase()] || icons.unknown} alt={label} className="w-4 h-4" />{' '}
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

    return rows;
  }, [priceRes, numRes]);

  return <Context.Provider value={memoRows}>{children}</Context.Provider>;
}

export const useOraclePrices = () => useContext(Context);

export const useGetTokenPrice = () => {
  const prices = useOraclePrices();

  return useCallback(
    (name: string, value: number) => {
      if (!prices) {
        return 0;
      }

      const row = prices.find((r) => r.name === name.toLowerCase());
      if (!row) {
        return 0;
      }

      return value * row.oraclePrice;
    },
    [prices],
  );
};
