import { useCubeQuery } from '@cubejs-client/react';
import { OpenVaultsTable } from '@/components/OpenVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useGranularity } from '@/components/CubeProvider';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function LiquidatedVaults({ title = 'Liquidated Vaults' }: Props) {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: [
      'liquidated_vaults.collateral_amount',
      'liquidated_vaults.current_collateral_price',
      'liquidated_vaults.collateral_oracle_usd_value',
      'liquidated_vaults.ist_debt_amount',
      'liquidated_vaults.liquidation_margin',
      'liquidated_vaults.liquidation_price',
      'liquidated_vaults.liquidation_cushion',
      'liquidated_vaults.collateralization_ratio',
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
    dimensions: ['liquidated_vaults.debt_type', 'liquidated_vaults.vault_ix', 'liquidated_vaults.collateral_type'],
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

    Object.keys(row).forEach(key => {
      newRow[key.replace('liquidated_vaults.', '')] = row[key];
    });

    // published.vaultFactory.managers.manager0.vaults.vault10 -> 10
    newRow.vault_ix = newRow.vault_ix.replace(/.*?(\d+)$/, '$1');

    return newRow;
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <OpenVaultsTable data={rows} />
    </>
  );
}
