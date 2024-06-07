import { format, differenceInSeconds } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { LiquidatedVaultsTable } from '@/components/LiquidatedVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatSecondsToHumanReadable, getTokenDivisor, parseBigInt } from '@/utils';
import { VAULT_STATES } from '@/constants';
import { LiquidationDashboardData } from '@/types/liquidation-types';

type Props = {
  title?: string;
  data: LiquidationDashboardData;
  isLoading: boolean;
  boardAuxes: { [key: string]: number };
};

export function LiquidatedVaults({ title = 'Liquidated Vaults', data, boardAuxes, isLoading }: Props) {
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

  data.vaultLiquidations?.sort((a, b) => {
    const nameA: string = a.denom?.toLowerCase();
    const nameB: string = b.denom?.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const rows = data.vaultLiquidations?.map((vaultData) => {
    const vaultIdRegex = /^(published\.vaultFactory\.managers\.manager\d+)\.vaults\.vault(\d+)-liquidated$/g;
    const vaultIdRegexMatch = vaultIdRegex.exec(vaultData?.id);
    if (vaultIdRegexMatch === null) throw new Error('Vault ID format invalid');

    const vaultIdx = vaultIdRegexMatch[2];

    const vaultStateSuffix = vaultData?.currentState?.state === VAULT_STATES.CLOSED ? ' (Closed)' : '';
    const vaultState = vaultData.state[0].toUpperCase() + vaultData.state.slice(1) + vaultStateSuffix;
    const liquidationRatio =
      parseBigInt(vaultData.vaultManagerGovernance?.liquidationMarginNumerator) /
      parseBigInt(vaultData.vaultManagerGovernance?.liquidationMarginDenominator);

    const istDivisor = getTokenDivisor(boardAuxes, 'IST');
    const tokenDivisor = getTokenDivisor(boardAuxes, vaultData.denom);

    const istDebtAmount = vaultData.liquidatingState.debt / istDivisor;
    const collateralAmount = vaultData.liquidatingState.balance / tokenDivisor;
    const liquidationPrice = (istDebtAmount * liquidationRatio) / collateralAmount;
    const collateralAmountReturned = (vaultData.liquidatingState.balance - vaultData.balance) / tokenDivisor;
    const oraclePriceRatio =
      parseBigInt(vaultData.oraclePrice?.typeOutAmount) / parseBigInt(vaultData.oraclePrice?.typeInAmount);
    const collateralAmountReturnedUsd = collateralAmountReturned * oraclePriceRatio;
    let liquidationTime = '';
    let liquidationStartTime = '';

    if (vaultData?.liquidatingState) {
      liquidationStartTime = format(new Date(vaultData?.liquidatingState.blockTime), 'yyyy-MM-dd HH:mm');
    }

    if (vaultData?.liquidatingState) {
      const seconds: number = differenceInSeconds(
        new Date(vaultData.blockTime),
        new Date(vaultData?.liquidatingState.blockTime),
        {
          roundingMethod: 'ceil',
        },
      );
      liquidationTime = formatSecondsToHumanReadable(seconds);
    }

    return {
      vault_idx: vaultIdx,
      collateral_type: vaultData.denom,
      state: vaultState,
      liquidating_debt_amount_avg: istDebtAmount,
      liquidation_margin_avg: liquidationRatio,
      liquidating_rate: liquidationPrice,
      liquidationStartTime,
      liquidationTime,
      liquidated_return_amount: collateralAmountReturned,
      liquidated_return_amount_usd: collateralAmountReturnedUsd,
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <LiquidatedVaultsTable data={rows} />
    </>
  );
}
