import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDay, toTitleCase } from '@/utils';
import { colors } from '@/components/palette';

type Props = {
  title?: string;
  isLoading: boolean;
  data: Array<object>;
};

export function VaultStatesChart({ title = 'Vault States', data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <Card className="my-4 mb-4">
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
        {['active', 'liquidated'].map((col, idx) => (
          <Bar key={col} stackId="a" dataKey={col} name={toTitleCase(col)} fill={colors[idx % colors.length]} />
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
