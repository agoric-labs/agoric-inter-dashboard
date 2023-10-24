import { useCubeQuery } from '@cubejs-client/react';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PSMStats as Item } from '@/components/PSMStats';
import { getCubeQueryView } from '@/utils';
import { coinLabels } from '../coinLabels';

export function PSMStats() {
  const res = useCubeQuery({
    measures: [
      'psm_stats.last_minted_pool_balance',
      'psm_stats.last_utilization_rate',
      'psm_governance.last_mint_limit',
    ],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        dateRange: 'Today',
        granularity: 'day',
      },
    ],
    order: [['psm_stats.coin', 'asc']],
    dimensions: ['psm_stats.coin'],
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const rows = resultSet.tablePivot();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {rows.map((s: any) => (
        <Item
          data={{
            coin: s['psm_stats.coin'],
            label: coinLabels[s['psm_stats.coin']] || s['psm_stats.coin'],
            mint_limit: s['psm_governance.last_mint_limit'],
            minted_pool_balance: s['psm_stats.last_minted_pool_balance'],
            utilized: s['psm_stats.last_utilization_rate'] / 100,
          }}
          key={s['psm_stats.coin']}
        />
      ))}
    </div>
  );
}
