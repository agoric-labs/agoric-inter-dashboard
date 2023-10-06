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
    header: 'Vault Manager',
  },
  {
    accessorKey: 'liquidation_margin',
    type: 'number',
    header: 'Liquidation Ratio',
  },
  {
    accessorKey: 'liquidationStartTime',
    type: 'text',
    header: 'Liquidation Start Time',
  },
  {
    accessorKey: 'liquidationTime',
    type: 'text',
    header: 'Liquidation Time',
  },
  {
    accessorKey: 'vault_state',
    type: 'text',
    header: 'State',
  },
  {
    accessorKey: 'collateral_amount',
    type: 'number',
    header: 'Collateral Amount',
  },
  {
    accessorKey: 'liquidation_price',
    type: 'number',
    header: 'Liquidation Price',
  },
];

export function LiquidatedVaultsTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
