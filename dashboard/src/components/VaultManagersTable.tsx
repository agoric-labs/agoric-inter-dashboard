import { DataTable, DataColumn } from './DataTable';

type Row = {
  collateral_type: string;
  total_locked_collateral: number;
  total_locked_collateral_usd: number;
  total_ist_minted: number;
  colletarization_ratio: number;
  ist_minting_limit: number;
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
    accessorKey: 'total_locked_collateral',
    type: 'number',
    header: 'Total Locked Collateral (ATOM)',
  },
  {
    accessorKey: 'total_locked_collateral_usd',
    type: 'usd',
    header: 'Total Locked Collateral Value ($USD)',
  },
  {
    accessorKey: 'total_ist_minted',
    type: 'number',
    header: 'Total IST Minted',
  },
  {
    accessorKey: 'colletarization_ratio',
    type: 'percent',
    header: 'Colletarization Ratio',
  },
  {
    accessorKey: 'ist_minting_limit',
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
