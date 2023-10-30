import { useCubeQuery } from '@cubejs-client/react';
import { OpenVaultsTable } from '@/components/OpenVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useGranularity } from '@/components/CubeProvider';
import { getCubeQueryView } from '@/utils';

type Props = {
  title?: string;
};

export function OpenVaults({ title = 'Open Vaults' }: Props) {
  const granularity = useGranularity();
  const res = useCubeQuery({
    measures: [
      'vault_factory_vaults.collateral_amount_avg',
      'oracle_prices.rate_avg',
      'vault_factory_vaults.collateral_amount_usd_avg',
      'vault_factory_vaults.debt_amount_avg',
      'vault_factory_governance.liquidation_margin_avg',
      'vault_factory_vaults.liquidation_price_avg',
      'vault_factory_vaults.liquidation_cushion_avg',
      'vault_factory_vaults.collateralization_ratio_avg',
    ],
    timeDimensions: [
      {
        dimension: 'vault_factory_vaults.day',
        granularity,
        dateRange: 'Today',
      },
    ],
    order: {
      'vault_factory_vaults.manager_idx': 'asc',
      'vault_factory_vaults.vault_idx': 'asc',
    },
    dimensions: [
      'vault_factory_vaults.debt_type',
      'vault_factory_vaults.vault_idx',
      'vault_factory_vaults.manager_idx',
      'vault_factory_vaults.collateral_type',
    ],
    filters: [
      {
        member: 'vault_factory_vaults.last_state',
        operator: 'contains',
        values: ['active'],
      },
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

    Object.keys(row).forEach(key => {
      newRow[
        key
          .replace('vault_factory_vaults.', '')
          .replace('vault_factory_governance.', '')
          .replace('oracle_prices.', '')
          .replace('_avg', '')
      ] = row[key];
    });

    return newRow;
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <OpenVaultsTable data={rows} />
    </>
  );
}
