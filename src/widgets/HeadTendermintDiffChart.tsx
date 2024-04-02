import { useCubeQuery } from '@cubejs-client/react';
import {
  ReferenceLine,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCubeQueryView, formatDayAndTime } from '@/utils';
import { colors } from '@/components/palette';

export function HeadTendermintDiffChart() {
  const res = useCubeQuery({
    measures: ['head_tendermint_slo_metrics.max_latest_block_height_diff'],
    timeDimensions: [
      {
        dimension: 'head_tendermint_slo_metrics.extracted_at',
        granularity: 'hour',
        dateRange: 'This week',
      },
    ],
    order: {
      'head_tendermint_slo_metrics.extracted_at': 'asc',
    },
  });

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const chart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={resultSet.chartPivot({ fillMissingDates: false })}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" stroke="#666" tickFormatter={formatDayAndTime} />
        <YAxis stroke="#666" />
        <ReferenceLine y={800} label="Threshold" stroke="red" strokeDasharray="3 3" />
        <YAxis />
        <Tooltip />
        <Legend />
        {resultSet.seriesNames().map((col, idx) => (
          <Line key={col.key} dataKey={col.key} name={col.shortTitle} fill={colors[idx % colors.length]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="my-4 mb-4">
      <CardHeader>
        <CardTitle>Head Latest Block Height Diff</CardTitle>
        <CardDescription>SLO metrics are designed to exclude the last 600 blocks.</CardDescription>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  );
}
