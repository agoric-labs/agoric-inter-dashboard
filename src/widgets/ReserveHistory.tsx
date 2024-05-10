import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDay } from '@/utils';
import { colors } from '@/components/palette';
import ChartsSkeleton from '@/components/ChartsSkeleton';

type Props = {
  title?: string;
  data: Array<object>;
  tokenNames: Array<string>;
  isLoading: boolean;
  error: string | undefined;
};

export function ReserveHistory({ title = 'History', data, tokenNames, isLoading, error }: Props) {
  if (isLoading || error) {
    return <ChartsSkeleton title="Total Locked Collateral" isLoading={isLoading} error={error} />;
  }

  const barChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
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
        {tokenNames.map((token, idx) => (
          <Bar key={token} stackId="a" name={token} dataKey={token} fill={colors[idx % colors.length]} />
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
