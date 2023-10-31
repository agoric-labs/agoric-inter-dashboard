import { useCubeQuery } from '@cubejs-client/react';
import { format } from 'date-fns';
import { LiquidatedVaultsTable } from '@/components/LiquidatedVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { getCubeQueryView, formatSecondsToHumanReadable } from '@/utils';

type Props = {
  title?: string;
};

const states: { [key: string]: string } = {
  // FARM_FINGERPRINT('liquidating')
  '5264610956617764810': 'Liquidated',
  '159334985254996322': 'Liquidating',
};

export function LiquidatedVaults({ title = 'Liquidated Vaults' }: Props) {
  const res = useCubeQuery({
    measures: [
      'vault_factory_liquidate_vaults.liquidating_collateral_amount_avg',
      'vault_factory_liquidate_vaults.liquidating_debt_amount_avg',
      'vault_factory_liquidate_vaults.liquidating_enter_time',
      'vault_factory_liquidate_vaults.liquidated_enter_time',
      'vault_factory_liquidate_vaults.liquidating_rate',
      'vault_factory_liquidate_vaults.last_state',
      'vault_factory_liquidate_vaults.liquidated_return_amount_avg',
      'vault_factory_liquidate_vaults.liquidated_return_amount_usd_avg',
      'vault_factory_governance.liquidation_margin_avg',
    ],
    timeDimensions: [
      {
        dimension: 'vault_factory_liquidate_vaults.day',
        granularity: 'day',
        dateRange: 'Today',
      },
    ],
    order: {
      'vault_factory_liquidate_vaults.manager_idx': 'asc',
      'vault_factory_liquidate_vaults.vault_idx': 'asc',
    },
    dimensions: [
      'vault_factory_liquidate_vaults.manager_idx',
      'vault_factory_liquidate_vaults.vault_idx',
      'vault_factory_liquidate_vaults.debt_type',
      'vault_factory_liquidate_vaults.collateral_type',
    ],
  });

  if (res.isLoading || !res.resultSet) {
    return (
      <>
        <SectionHeader>{title}</SectionHeader>
        <div>Loading...</div>
      </>
    );
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const rows = resultSet.tablePivot().map((row: any) => {
    const newRow: any = {};

    Object.keys(row).forEach((key) => {
      newRow[key.replace('vault_factory_liquidate_vaults.', '').replace('vault_factory_governance.', '')] = row[key];
    });

    newRow.state = states[newRow.last_state];

    // const starting = new Date(row['vault_factory_liquidate_vaults.liquidating_enter_time'] * 1000);
    const starting = new Date(row['vault_factory_liquidate_vaults.liquidating_enter_time'] * 1000);
    console.log(starting, row['vault_factory_liquidate_vaults.liquidating_enter_time']);
    newRow.liquidationStartTime = format(starting, 'MM/dd/yyyy HH:mm');

    if (row['vault_factory_liquidate_vaults.liquidated_enter_time']) {
      newRow.liquidationTime = formatSecondsToHumanReadable(
        row['vault_factory_liquidate_vaults.liquidated_enter_time'] -
          row['vault_factory_liquidate_vaults.liquidating_enter_time'],
      );
    } else {
      newRow.liquidationTime = '—';
    }

    return newRow;
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <LiquidatedVaultsTable data={rows} />
    </>
  );
}
