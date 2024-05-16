import { Skeleton } from '@/components/ui/skeleton';
import { VaultManagersTable } from '@/components/VaultManagersTable';
import { SectionHeader } from '@/components/SectionHeader';
import CollateralWithIcon from '@/components/ui/collateralWithIcon';
import { VaultsDashboardData } from '@/types/vault-types';
import { createNumberWithLeadingZeroes } from '@/utils';

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

  const entries = Object.entries(data);
  const sortedEntries = entries.sort(([keyA], [keyB]) => {
    const nameA: string = keyA.toLowerCase();
    const nameB: string = keyB.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const rows = sortedEntries.map(([coinName, coinData]) => {
    const tokenDivisor = createNumberWithLeadingZeroes(coinData?.decimalPlaces);
    const totalCollateral = (coinData?.totalCollateral || 0) / tokenDivisor;
    const typeOutAmount = Number(coinData?.typeOutAmount) || 0;
    const typeInAmount = Number(coinData?.typeInAmount) || 1;
    const oraclePrice = typeOutAmount / typeInAmount;
    const totalCollateralUsd = totalCollateral * oraclePrice;
    const totalDebt = coinData?.totalDebt || 0;
    const totalIstMinted = totalDebt / tokenDivisor;
    const colletarizationRatio = totalCollateralUsd / totalIstMinted;
    const debtLimit = coinData.debtLimit / tokenDivisor;
    return {
      collateral_type: <CollateralWithIcon collateralType={coinName} />,
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
