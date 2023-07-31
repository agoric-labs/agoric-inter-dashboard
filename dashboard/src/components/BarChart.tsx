import { parseISO, format } from 'date-fns';
import {
  BarChart as BaseBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { colors } from './palette';

type Props = {
  data: any[];
  xKey: string;
  y2Key: string;
  valueKey: string;
};

const formatDay = (v: string) => format(parseISO(v), 'MM/dd');

export function BarChart({ data, xKey, y2Key, valueKey }: Props) {
  if (data.length === 0) {
    return <div>Nothing to show</div>;
  }

  const rows: any = {};
  const seriesNames: string[] = [];

  // kostil
  data.sort((a, b) => a[xKey].localeCompare(b[xKey]));

  data.forEach((item: any) => {
    const key = formatDay(item[xKey]);

    if (!rows[key]) {
      rows[key] = { date: key };
    }

    rows[key] = {
      ...rows[key],
      [item[y2Key]]: item[valueKey],
    };

    if (!seriesNames.includes(item[y2Key])) {
      seriesNames.push(item[y2Key]);
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BaseBarChart
        width={500}
        height={300}
        data={Object.values(rows)}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#666" />
        <YAxis stroke="#666" />
        <YAxis />
        <Tooltip />
        <Legend />
        {seriesNames.map((n, idx) => (
          <Bar key={n} stackId="a" dataKey={n} fill={colors[idx % colors.length]} />
        ))}
      </BaseBarChart>
    </ResponsiveContainer>
  );
}
