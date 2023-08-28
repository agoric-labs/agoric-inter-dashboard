import { useCubeQuery } from '@cubejs-client/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCubeQueryView, formatDay } from '@/utils';
import { colors } from '@/components/palette';
import { useGranularity } from '@/components/CubeProvider';
import { formatCoinLabels } from '../coinLabels';

export function PSMHistory() {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: ['psm_stats.last_total_minted_provided'],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        granularity,
      },
    ],
    order: [['psm_stats.coin', 'asc']],
    dimensions: ['psm_stats.coin'],
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const barChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={resultSet.chartPivot()}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" stroke="#666" tickFormatter={formatDay} />
        <YAxis stroke="#666" />
        <YAxis />
        <Tooltip />
        <Legend />
        {resultSet.seriesNames().map((col, idx) => (
          <Bar
            key={col.key}
            stackId="a"
            name={formatCoinLabels(col.yValues[0]).replace('IST ↔ ', '')}
            dataKey={col.key}
            fill={colors[idx % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="my-4 mb-4">
      <CardHeader>
        <CardTitle>Total Minted IST</CardTitle>
      </CardHeader>
      <CardContent>{barChart}</CardContent>
    </Card>
  );
}
