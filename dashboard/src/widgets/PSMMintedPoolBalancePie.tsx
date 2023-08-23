import { useCubeQuery } from '@cubejs-client/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadianTooltip } from '@/components/RadianTooltip';
import { colors } from '@/components/palette';
import { getCubeQueryView } from '@/utils';
import { coinLabels } from '../coinLabels';

export function PSMMintedPoolBalancePie() {
  const res = useCubeQuery({
    measures: ['psm_stats.last_minted_pool_balance'],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        dateRange: 'Today',
      },
    ],
    order: [['psm_stats.coin', 'asc']],
    dimensions: ['psm_stats.coin'],
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const data = resultSet.chartPivot();

  return (
    <Card>
      <CardHeader>
        <CardTitle>IST Utilization Per Anchor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={400}>
              <Pie
                dataKey="psm_stats.last_minted_pool_balance"
                data={data}
                innerRadius={70}
                outerRadius={100}
                fill="green"
                nameKey="label"
                paddingAngle={3}
                minAngle={15}
                labelLine={false}
                label={RadianTooltip}
              >
                {Object.keys(coinLabels).map((key, idx) => (
                  <Cell fill={colors[idx % colors.length]} key={key} name={coinLabels[key]} />
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
