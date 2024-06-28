import { DataTable, DataColumn } from './DataTable';

type Row = {
  vault_idx: string;
  collateral_type: JSX.Element;
  debt_type: string;
  collateral_amount: number;
  current_collateral_price: number;
  collateral_oracle_usd_value: number;
  collateral_amount_current_usd: number;
  debt_amount: number;
  liquidation_margin: number;
  liquidation_price: number;
  liquidation_cushion: number;
  collateralization_ratio: number;
};

type Props = {
  data: Row[];
};

export const columns: DataColumn<Row>[] = [
  {
    accessorKey: 'vault_idx',
    type: 'text',
    header: 'ID',
  },
  {
    accessorKey: 'collateral_type',
    type: 'markup',
    header: 'Collateral Type',
  },
  {
    accessorKey: 'vault_created_time',
    type: 'text',
    header: 'Date Opened',
  },
  {
    accessorKey: 'debt_type',
    type: 'text',
    header: 'Debt Type',
  },
  {
    accessorKey: 'collateral_amount',
    type: 'number',
    header: 'Collateral Amount',
  },
  {
    accessorKey: 'current_collateral_price',
    type: 'usd',
    header: 'Current Collateral Price',
  },
  {
    accessorKey: 'collateral_amount_current_usd',
    type: 'usd',
    header: 'Collateral Value ($USD)',
  },
  {
    accessorKey: 'debt_amount',
    type: 'number',
    header: 'IST Debt Amount',
  },
  {
    accessorKey: 'liquidation_margin',
    type: 'percent',
    header: 'Liquidation Ratio',
  },
  {
    accessorKey: 'liquidation_price',
    type: 'usd',
    header: 'Liquidation Price',
  },
  {
    accessorKey: 'liquidation_cushion',
    type: 'number',
    header: 'Liquidation Cushion',
  },
  {
    accessorKey: 'collateralization_ratio',
    type: 'percent',
    header: 'Collateralization Ratio',
  },
];

export function OpenVaultsTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
