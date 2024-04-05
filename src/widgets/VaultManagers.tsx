import { Skeleton } from '@/components/ui/skeleton';
import { VaultManagersTable } from '@/components/VaultManagersTable';
import { SectionHeader } from '@/components/SectionHeader';
import { VaultsDashboardData } from '@/pages/Vaults';

type Props = {
  title?: string;
  data: VaultsDashboardData;
  isLoading: boolean;
};

export function VaultManagers({ title = 'Collateral Type', data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <>
        <SectionHeader>{title}</SectionHeader>
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        <Skeleton className="w-full h-[20px] rounded-full mb-2" />
      </>
    );
  }

  const rows = Object.entries(data).map(([coinName, coinData]) => {
    const totalCollateral = coinData.totalCollateral / 1_000_000;
    const oraclePrice = coinData.typeOutAmount / 1_000_000;
    const totalCollateralUsd = totalCollateral * oraclePrice;
    const totalIstMinted = coinData.totalDebt / 1_000_000;
    const colletarizationRatio = totalCollateralUsd / totalIstMinted;
    const debtLimit = coinData.debtLimit / 1_000_000;
    return {
      collateral_type: coinName,
      debt_type: 'IST',
      total_collateral: totalCollateral,
      total_collateral_current_usd: totalCollateralUsd,
      total_debt: totalIstMinted,
      colletarization_ratio: colletarizationRatio,
      debt_limit: debtLimit,
      utilization_rate: totalIstMinted / debtLimit,
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <VaultManagersTable data={rows} />
    </>
  );
}
