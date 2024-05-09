import { ReactNode } from 'react';
import { DataTable, DataColumn } from './DataTable';

export type Row = {
  token: ReactNode;
  name: string;
  numActive: number;
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
    header: 'Collateral Type',
    size: 200,
  },
  {
    accessorKey: 'numActive',
    type: 'number',
    header: 'Active Vaults',
    size: 50,
  },
  {
    accessorKey: 'oraclePrice',
    type: 'usd',
    header: 'Oracle Price, USD',
    size: 50,
  },
  {
    accessorKey: 'dayChange',
    type: 'markupRight',
    header: 'Daily Change',
    size: 50,
  },
];

export function TokenPricesTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
