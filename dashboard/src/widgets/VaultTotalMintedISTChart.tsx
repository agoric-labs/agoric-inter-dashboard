import { useCubeQuery } from '@cubejs-client/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    measures: ['vault_metrics.avg_total_ist_minted'],
    timeDimensions: [
      {
        dimension: 'vault_metrics.date',
        granularity,
      },
    ],
    dimensions: ['vault_metrics.collateral_type', 'vault_metrics.debt_type'],
  });

  if (res.isLoading || !res.resultSet) {
    return (
      <Card className="my-4 mb-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
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
        <YAxis stroke="#666" tickFormatter={(v) => formatIST(v / 1000000)} />
        <YAxis />
        <Tooltip />
        <Legend />
        {resultSet.seriesNames().map((col, idx) => (
          <Bar key={col.key} stackId="a" dataKey={col.key} name={col.shortTitle} fill={colors[idx % colors.length]} />
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