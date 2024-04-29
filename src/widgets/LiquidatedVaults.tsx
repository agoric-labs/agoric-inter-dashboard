import { Skeleton } from '@/components/ui/skeleton';
import { LiquidatedVaultsTable } from '@/components/LiquidatedVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { LiquidationDashboardData } from '@/pages/Liquidated';

type Props = {
  title?: string;
  data: LiquidationDashboardData;
  isLoading: boolean;
};

export function LiquidatedVaults({ title = 'Liquidated Vaults', data, isLoading }: Props) {
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

  const rows = data.vaults.map((vaultData) => {
    const splitVaultId = vaultData?.id?.split('.');
    const vaultIdx = splitVaultId.at(-1)?.split('vault')[1] || '';
    const vaultState = vaultData?.state?.charAt(0).toUpperCase() + vaultData?.state?.slice(1);
    const vaultManager = splitVaultId?.slice(0, 4).join('.');
    const vaultManagerGovernance = data.vaultManagerGovernances[vaultManager];
    const liquidationRatio =
      vaultManagerGovernance.liquidationMarginNumerator / vaultManagerGovernance.liquidationMarginDenominator;

    const istDebtAmount = vaultData.debt / 1_000_000;
    const collateralAmount = vaultData.balance / 1_000_000;
    const liquidationPrice = (istDebtAmount * liquidationRatio) / collateralAmount;
    return {
      vault_idx: vaultIdx,
      collateral_type: vaultData.token,
      state: vaultState,
      liquidating_debt_amount_avg: istDebtAmount,
      liquidation_margin_avg: liquidationRatio,
      liquidating_rate: liquidationPrice,
      liquidationStartTime: '',
      liquidationTime: '',
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <LiquidatedVaultsTable data={rows} />
    </>
  );
}
