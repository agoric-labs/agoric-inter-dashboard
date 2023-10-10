import { ReactNode } from 'react';
import { DataTable, DataColumn } from './DataTable';

export type Row = {
  token: ReactNode;
  dayChange: ReactNode;
  oraclePrice: number;
};

type Props = {
  data: Row[];
};

export const columns: DataColumn<Row>[] = [
  {
    accessorKey: 'token',
    type: 'markup',
    header: 'Token',
    size: 200,
  },
  {
    accessorKey: 'dayChange',
    type: 'markupRight',
    header: '24h change',
    size: 50,
  },
  {
    accessorKey: 'oraclePrice',
    type: 'usd',
    header: 'Oracle Price, USD',
    size: 50,
  },
];

export function TokenPricesTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
