import { DataTable, DataColumn } from './DataTable';

type Row = {
  vault_idx: string;
  collateral_type: string;
  state: string;
  liquidationStartTime: string;
  liquidationTime: string;
  liquidating_debt_amount_avg: number;
  liquidation_margin_avg: number;
  liquidating_rate: number;
  liquidated_return_amount: number;
  liquidated_return_amount_usd: number;
};

type Props = {
  data: Row[];
};

export const columns: DataColumn<Row>[] = [
  {
    accessorKey: 'vault_idx',
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
    accessorKey: 'state',
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
    accessorKey: 'liquidating_debt_amount_avg',
    type: 'number',
    header: 'IST Debt Amount',
  },
  // {
  //   accessorKey: 'liquidation_margin_avg',
  //   type: 'percent',
  //   header: 'Liquidation Ratio',
  // },
  // {
  //   accessorKey: 'liquidating_rate',
  //   type: 'usd',
  //   header: 'Liquidation Price',
  // },
  {
    accessorKey: 'liquidated_return_amount',
    type: 'number',
    header: 'Collateral Returned Amount',
  },
  {
    accessorKey: 'liquidated_return_amount_usd',
    type: 'usd',
    header: 'Collateral Returned ($USD)',
  },
];

export function LiquidatedVaultsTable({ data }: Props) {
  return <DataTable data={data} columns={columns} />;
}
