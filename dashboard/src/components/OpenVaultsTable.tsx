import { DataTable, DataColumn } from './DataTable';

type Row = {
  vault_ix: string;
  collateral_type: string;
  collateral_amount: number;
  current_collateral_price: number;
  collateral_oracle_usd_value: number;
  ist_debt_amount: number;
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
    accessorKey: 'vault_ix',
    type: 'text',
    header: 'ID',
  },
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
    accessorKey: 'collateral_oracle_usd_value',
    type: 'usd',
    header: 'Collateral Oracle Price',
  },
  {
    accessorKey: 'ist_debt_amount',
    type: 'number',
    header: 'IST Debt Amount',
  },
  {
    accessorKey: 'liquidation_margin',
    type: 'number',
    header: 'Liquidation Margin',
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
