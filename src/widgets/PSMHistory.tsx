import { useCubeQuery } from '@cubejs-client/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCubeQueryView, formatDay } from '@/utils';
import { colors } from '@/components/palette';
import { useGranularity } from '@/components/CubeProvider';
import { formatCoinLabels } from '../coinLabels';

type Props = {
  title?: string;
};

export function PSMHistory({ title = 'Total Minted IST' }: Props) {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: ['psm_stats.total_minted_provided_avg'],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        granularity,
        dateRange: granularity === 'day' ? 'Last 90 days' : undefined,
      },
    ],
    order: [['psm_stats.coin', 'asc']],
    dimensions: ['psm_stats.coin'],
  });

  if (res.isLoading) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        </CardContent>
      </Card>
    );
  }

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
