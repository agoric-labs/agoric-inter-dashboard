import { useCubeQuery } from '@cubejs-client/react';
import { PSMStats as Item, Skeleton } from '@/components/PSMStats';
import { ErrorAlert } from '@/components/ErrorAlert';
import { coinLabels } from '../coinLabels';
import { extractFirst } from '@/utils';

export function PSMStats() {
  const res = useCubeQuery({
    measures: ['psm_stats.minted_pool_balance_avg', 'psm_stats.utilization_rate_avg', 'psm_governance.mint_limit_avg'],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        dateRange: 'from 1 days ago to now',
        granularity: 'day',
      },
    ],
    order: [['psm_stats.day', 'desc']],
    dimensions: ['psm_stats.coin'],
  });

  if (res.error) {
    return <ErrorAlert value={res.error} title="Request Error" />;
  }

  if (!res.resultSet || res.isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...new Array(6)].map((n) => (
          <Skeleton key={n} />
        ))}
      </div>
    );
  }

  const firstDay = extractFirst(res, 'psm_stats.day.day');
  const rows = res.resultSet.tablePivot().filter((s: any) => s['psm_stats.day.day'] === firstDay);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {rows.map((s: any) => (
        <Item
          data={{
            coin: s['psm_stats.coin'],
            label: coinLabels[s['psm_stats.coin']] || s['psm_stats.coin'],
            mint_limit: s['psm_governance.mint_limit_avg'],
            minted_pool_balance: s['psm_stats.minted_pool_balance_avg'],
            utilized: s['psm_stats.utilization_rate_avg'] / 100,
          }}
          key={s['psm_stats.coin']}
        />
      ))}
    </div>
  );
}
