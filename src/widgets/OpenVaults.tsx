import { Skeleton } from '@/components/ui/skeleton';
import { OpenVaultsTable } from '@/components/OpenVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { OpenVaultsData } from '@/pages/Vaults';

type Props = {
  title?: string;
  data: OpenVaultsData;
  isLoading: boolean;
};

export function OpenVaults({ title = 'Open Vaults', data, isLoading }: Props) {
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

  data.sort((a, b) => {
    const nameA: string = a.token?.toLowerCase();
    const nameB: string = b.token?.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const rows = data.map((vaultData) => {
    const vaultIdx = vaultData.id.split('.').at(-1)?.split('vault')[1] || '';
    const collateralValueUsd = ((vaultData.typeOutAmount / 1_000_000) * vaultData.balance) / 1_000_000;
    const liquidationRatio = vaultData?.liquidationMarginNumerator / vaultData?.liquidationMarginDenominator;
    const istDebtAmount = vaultData.debt / 1_000_000;
    const collateralAmount = vaultData.balance / 1_000_000;
    const liquidationPrice = (istDebtAmount * liquidationRatio) / collateralAmount;
    const currentCollateralPrice = vaultData.typeOutAmount / 1_000_000;
    return {
      vault_idx: vaultIdx,
      collateral_type: vaultData.token,
      debt_type: 'IST',
      collateral_amount: collateralAmount,
      current_collateral_price: currentCollateralPrice,
      collateral_oracle_usd_value: vaultData.typeOutAmount / 1_000_000,
      collateral_amount_current_usd: collateralValueUsd,
      debt_amount: istDebtAmount,
      liquidation_margin: liquidationRatio,
      liquidation_price: liquidationPrice,
      liquidation_cushion: currentCollateralPrice / (liquidationPrice - 1),
      collateralization_ratio: collateralValueUsd / (vaultData.debt / 1_000_000),
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <OpenVaultsTable data={rows} />
    </>
  );
}
