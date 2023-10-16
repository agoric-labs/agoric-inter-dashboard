import { useCubeQuery } from '@cubejs-client/react';
import { format } from 'date-fns';
import { LiquidatedVaultsTable } from '@/components/LiquidatedVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useGranularity } from '@/components/CubeProvider';
import { getCubeQueryView, toTitleCase, formatSecondsToHumanReadable } from '@/utils';

type Props = {
  title?: string;
};

export function LiquidatedVaults({ title = 'Liquidated Vaults' }: Props) {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: [
      'liquidated_vaults.liquidating_locked_value',
      'liquidated_vaults.liquidation_token_price',
      'liquidated_vaults.current_collateral_price',
      'liquidated_vaults.liquidating_debt_amount',
      'liquidated_vaults.liquidation_margin',
      'liquidated_vaults.liquidating_start_time',
      'liquidated_vaults.liquidated_time',
    ],
    timeDimensions: [
      {
        dimension: 'liquidated_vaults.day',
        granularity,
        dateRange: 'Today',
      },
    ],
    order: {
      'liquidated_vaults.debt_type': 'asc',
      'liquidated_vaults.vault_ix': 'asc',
    },
    dimensions: [
      'liquidated_vaults.debt_type',
      'liquidated_vaults.vault_ix',
      'liquidated_vaults.collateral_type',
      'liquidated_vaults.vault_state',
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
      newRow[key.replace('liquidated_vaults.', '')] = row[key];
    });

    // published.vaultFactory.managers.manager0.vaults.vault10 -> 10
    newRow.vault_ix = newRow.vault_ix.replace(/.*?(\d+)$/, '$1');
    newRow.vault_state = toTitleCase(newRow.vault_state);
    newRow.liquidating_locked_value_usd = newRow.liquidating_locked_value * newRow.liquidation_token_price;

    const starting = new Date(row['liquidated_vaults.liquidating_start_time'] * 1000);
    newRow.liquidationStartTime = format(starting, 'MM/dd/yyyy HH:mm');

    if (row['liquidated_vaults.liquidated_time']) {
      const diff = row['liquidated_vaults.liquidated_time'] - row['liquidated_vaults.liquidating_start_time'];
      newRow.liquidationTime = formatSecondsToHumanReadable(diff);
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
