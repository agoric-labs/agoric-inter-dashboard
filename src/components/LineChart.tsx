import { parseISO, format } from 'date-fns';
import {
  LineChart as BaseLineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  data: any[];
  xKey: string;
  y2Key: string;
  valueKey: string;
};

const formatDay = (v: string) => format(parseISO(v), 'MM/dd');

export function LineChart({ data, xKey, y2Key, valueKey }: Props) {
  if (data.length === 0) {
    return <div>Nothing to show</div>;
  }

  const rows: any[] = [];
  const seriesNames: string[] = [];

  // kostil
  data.sort((a, b) => a[xKey].localeCompare(b[xKey]));

  data.forEach((item: any) => {
    const row: any = {
      date: formatDay(item[xKey]),
    };

    row[item[y2Key]] = item[valueKey];
    rows.push(row);

    if (!seriesNames.includes(item[y2Key])) {
      seriesNames.push(item[y2Key]);
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BaseLineChart
        width={500}
        height={300}
        data={rows}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#DFE2E6" />
        <XAxis dataKey="date" stroke="#666" />
        <YAxis stroke="#666" />
        <Area dataKey="amt" fill="#7DB3FF" stroke="#7DB3FF" />
        <Tooltip />
        <Legend />
        {seriesNames.map((n) => (
          <Line key={n} dataKey={n} fill="#8884d8" />
        ))}
      </BaseLineChart>
    </ResponsiveContainer>
  );
}
