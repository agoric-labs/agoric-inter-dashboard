import { useCubeQuery } from '@cubejs-client/react';
import { VaultManagersTable } from '@/components/VaultManagersTable';
import { SectionHeader } from '@/components/SectionHeader';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function VaultManagers({ title = 'Collateral Type' }: Props) {
  const res = useCubeQuery({
    measures: [
      'vault_managers.total_locked_collateral_avg',
      'vault_managers.total_locked_collateral_usd_avg',
      'vault_managers.total_ist_minted_avg',
      'vault_managers.colletarization_ratio_avg',
      'vault_managers.ist_minting_limit_avg',
      'vault_managers.utilization_rate_avg',
    ],
    timeDimensions: [
      {
        dimension: 'vault_managers.day',
        dateRange: 'Today',
      },
    ],
    order: {
      'vault_managers.collateral_type': 'desc',
    },
    dimensions: ['vault_managers.collateral_type'],
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
      newRow[key.replace('vault_managers.', '').replace('_avg', '')] = row[key];
    });

    return newRow;
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <VaultManagersTable data={rows} />
    </>
  );
}
