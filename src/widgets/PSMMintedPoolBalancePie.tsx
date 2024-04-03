import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadianTooltip } from '@/components/RadianTooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { colors } from '@/components/palette';
import { coinLabels } from '../coinLabels';

type Props = {
  title?: string;
  data: object;
  isLoading: boolean;
};

export function PSMMintedPoolBalancePie({ title = 'Total Minted IST Per Anchor', data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
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

  const pieChartData = Object.entries(data)
    .map(([coinName, coinData]) => ({
      value: parseFloat(coinData.mintedPoolBalance),
      label: coinLabels[coinName],
    }))
    .filter((row) => row.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={pieChartData}
                innerRadius={70}
                outerRadius={100}
                fill="green"
                nameKey="label"
                paddingAngle={3}
                minAngle={3}
                labelLine={false}
                label={RadianTooltip}
              >
                {pieChartData.map((item, idx) => (
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
