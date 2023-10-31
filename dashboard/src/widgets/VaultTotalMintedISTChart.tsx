import { useCubeQuery } from '@cubejs-client/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCubeQueryView, formatDay, formatIST } from '@/utils';
import { colors } from '@/components/palette';
import { useGranularity } from '@/components/CubeProvider';

type Props = {
  title?: string;
};

export function VaultTotalMintedISTChart({ title = 'Total Minted IST' }: Props) {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: ['vault_factory_metrics.total_debt_avg'],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        granularity,
        dateRange: granularity === 'day' ? 'Last 90 days' : undefined,
      },
    ],
    dimensions: [
      'vault_factory_metrics.collateral_type',
      'vault_factory_metrics.manager_idx',
      'vault_factory_metrics.debt_type',
    ],
  });

  if (res.isLoading || !res.resultSet) {
    return (
      <Card className="my-4 mb-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-max-64 h-[50px] rounded" />
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
        <YAxis stroke="#666" tickFormatter={(v) => formatIST(v)} />
        <YAxis />
        <Tooltip />
        <Legend />
        {resultSet.seriesNames().map((col, idx) => (
          <Bar
            key={col.key}
            stackId="a"
            dataKey={col.key}
            name={col.shortTitle.replace(/, \d+,/, '') /* hide manager numbers */}
            fill={colors[idx % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="my-4 mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{barChart}</CardContent>
    </Card>
  );
}
