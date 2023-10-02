import { useCubeQuery } from '@cubejs-client/react';
import { OpenVaultsTable } from '@/components/OpenVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useGranularity } from '@/components/CubeProvider';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function OpenVaults({ title = 'Open vaults' }: Props) {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: [
      'open_vaults.collateral_amount',
      'open_vaults.current_collateral_price',
      'open_vaults.collateral_oracle_usd_value',
      'open_vaults.ist_debt_amount',
      'open_vaults.liquidation_margin',
      'open_vaults.liquidation_price',
      'open_vaults.liquidation_cushion',
      'open_vaults.collateralization_ratio',
    ],
    timeDimensions: [
      {
        dimension: 'open_vaults.day',
        granularity,
        dateRange: 'Today',
      },
    ],
    order: {
      'open_vaults.debt_type': 'asc',
      'open_vaults.vault_ix': 'asc',
    },
    dimensions: ['open_vaults.debt_type', 'open_vaults.vault_ix', 'open_vaults.collateral_type'],
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
      newRow[key.replace('open_vaults.', '')] = row[key];
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
