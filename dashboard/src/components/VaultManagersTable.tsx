import { DataTable, DataColumn } from './DataTable';

type Row = {
  collateral_type: string;
  total_collateral: number;
  total_collateral_usd: number;
  total_collateral_current_usd: number;
  total_debt: number;
  colletarization_ratio: number;
  debt_limit: number;
  utilization_rate: number;
};

type Props = {
  data: Row[];
};

export const columns: DataColumn<Row>[] = [
  {
    accessorKey: 'collateral_type',
    type: 'text',
    header: 'Collateral Type',
  },
  {
    accessorKey: 'debt_type',
    type: 'text',
    header: 'Debt Type',
  },
  {
    accessorKey: 'total_collateral',
    type: 'number',
    header: 'Total Locked Collateral',
  },
  {
    accessorKey: 'total_collateral_current_usd',
    type: 'usd',
    header: 'Total Locked Collateral Value ($USD)',
  },
  {
    accessorKey: 'total_debt',
    type: 'number',
    header: 'Total IST Minted',
  },
  {
    accessorKey: 'colletarization_ratio',
    type: 'percent',
    header: 'Colletarization Ratio',
  },
  {
    accessorKey: 'debt_limit',
    type: 'number',
    header: 'IST Minting Limit',
  },
  {
    accessorKey: 'utilization_rate',
    type: 'percent',
    header: 'Utilization Rate',
  },
];

export function VaultManagersTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
