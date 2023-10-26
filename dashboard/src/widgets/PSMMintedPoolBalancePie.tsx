import { useCubeQuery } from '@cubejs-client/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadianTooltip } from '@/components/RadianTooltip';
import { colors } from '@/components/palette';
import { getCubeQueryView } from '@/utils';
import { coinLabels } from '../coinLabels';

export function PSMMintedPoolBalancePie() {
  const res = useCubeQuery({
    measures: ['psm_stats.minted_pool_balance_avg'],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        dateRange: 'Today',
        granularity: 'day',
      },
    ],
    order: [['psm_stats.minted_pool_balance_avg', 'asc']],
    dimensions: ['psm_stats.coin'],
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const data = resultSet
    .tablePivot()
    .map(row => ({
      value: parseFloat(row['psm_stats.last_minted_pool_balance'] as string),
      label: coinLabels[row['psm_stats.coin'] as string],
    }))
    .filter(row => row.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Minted IST Per Anchor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={data}
                innerRadius={70}
                outerRadius={100}
                fill="green"
                nameKey="label"
                paddingAngle={3}
                minAngle={3}
                labelLine={false}
                label={RadianTooltip}
              >
                {data.map((item, idx) => (
                  <Cell fill={colors[idx % colors.length]} key={item.label} name={item.label} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
