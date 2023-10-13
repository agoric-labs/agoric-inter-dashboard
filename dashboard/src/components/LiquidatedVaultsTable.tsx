import { DataTable, DataColumn } from './DataTable';

type Row = {
  vault_ix: string;
  collateral_type: string;
  liquidating_locked_value: number;
  current_collateral_price: number;
  collateral_oracle_usd_value: number;
  ist_debt_amount: number;
  liquidation_margin: number;
  liquidation_price: number;
  liquidation_cushion: number;
  liquidation_token_price: number;
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
    size: 50,
  },
  {
    accessorKey: 'collateral_type',
    type: 'text',
    header: 'Vault Manager',
    size: 300,
  },
  {
    accessorKey: 'vault_state',
    type: 'text',
    header: 'State',
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
    accessorKey: 'liquidating_debt_amount',
    type: 'number',
    header: 'IST Debt Amount',
  },
  {
    accessorKey: 'liquidation_margin',
    type: 'percent',
    header: 'Liquidation Ratio',
  },
  {
    accessorKey: 'liquidation_token_price',
    type: 'usd',
    header: 'Liquidation Price',
  },
  {
    accessorKey: 'liquidating_locked_value',
    type: 'number',
    header: 'Collateral Returned Amount',
  },
  {
    accessorKey: 'liquidating_locked_value_usd',
    type: 'usd',
    header: 'Collateral Returned ($USD)',
  },
];

export function LiquidatedVaultsTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
