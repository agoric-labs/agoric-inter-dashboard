import { format, differenceInSeconds } from 'date-fns';
import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { LiquidatedVaultsTable } from '@/components/LiquidatedVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { LiquidationDashboardData } from '@/pages/Liquidated';
import { LIQUIDATION_ORACLE_PRICES_DAILIES_QUERY } from '@/queries';
import { formatSecondsToHumanReadable, getDateKey, subQueryFetcher } from '@/utils';
import { VAULT_STATES } from '@/constants';

type Props = {
  title?: string;
  data: LiquidationDashboardData;
  isLoading: boolean;
};

type OraclePriceDailiesNode = {
  typeInAmountLast: number;
  typeOutAmountLast: number;
  dateKey: number;
};

type OraclePriceNode = {
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
};

type OraclePriceDailiesResponse = { [key: string]: { nodes: Array<OraclePriceDailiesNode> } };

export function LiquidatedVaults({ title = 'Liquidated Vaults', data, isLoading }: Props) {
  const oraclePricesDatekeyMap: { [key: string]: Array<number> } = data.vaultLiquidations?.reduce(
    (agg: { [key: string]: Array<number> }, vault) => {
      const { denom } = vault;
      const prevDenomKeys = agg[denom] || [];
      return { ...agg, [denom]: [...prevDenomKeys, getDateKey(new Date(vault.blockTime)).key] };
    },
    {},
  );

  const { data: oraclePricesDailiesData } = useSWR<AxiosResponse, AxiosError>(
    oraclePricesDatekeyMap ? LIQUIDATION_ORACLE_PRICES_DAILIES_QUERY(oraclePricesDatekeyMap) : null,
    subQueryFetcher,
  );

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

  const oraclePricesDailiesResponse: OraclePriceDailiesResponse = oraclePricesDailiesData?.data.data;
  const oraclePricesDailies: { [key: string]: { [key: number]: OraclePriceNode } } =
    oraclePricesDailiesResponse &&
    Object.fromEntries(
      Object.entries(oraclePricesDailiesResponse).map(([denom, oraclePrices]) => [
        denom,
        oraclePrices.nodes.reduce(
          (agg, oracle) => ({
            ...agg,
            [oracle.dateKey]: {
              ...oracle,
              typeInAmount: oracle.typeInAmountLast,
              typeOutAmount: oracle.typeOutAmountLast,
            },
          }),
          {},
        ),
      ]),
    );

  data.vaultLiquidations?.sort((a, b) => {
    const nameA: string = a.denom?.toLowerCase();
    const nameB: string = b.denom?.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const rows = data.vaultLiquidations?.map((vaultData) => {
    const vaultIdRegex = /^(published\.vaultFactory\.managers\.manager\d+)\.vaults\.vault(\d+)-liquidated$/g;
    const vaultIdRegexMatch = vaultIdRegex.exec(vaultData?.id);
    if (vaultIdRegexMatch === null) throw new Error('Vault ID format invalid');

    const { key: dateKey } = getDateKey(new Date(vaultData.blockTime));
    const oraclePriceToday = data.oraclePrices[vaultData.denom];
    const oraclePriceSnapshot = oraclePricesDailies?.[vaultData.denom]?.[dateKey];
    const oraclePrice = oraclePriceSnapshot || oraclePriceToday;

    const [, vaultManager, vaultIdx] = vaultIdRegexMatch;
    
    const vaultStateSuffix = vaultData?.currentState?.state === VAULT_STATES.CLOSED ? ' (Closed)' : '';
    const vaultState = vaultData.state[0].toUpperCase() + vaultData.state.slice(1) + vaultStateSuffix;
    const vaultManagerGovernance = data.vaultManagerGovernances[vaultManager];
    const liquidationRatio =
      vaultManagerGovernance.liquidationMarginNumerator / vaultManagerGovernance.liquidationMarginDenominator;
    const istDebtAmount = vaultData.liquidatingState.debt / 1_000_000;
    const collateralAmount = vaultData.liquidatingState.balance / 1_000_000;
    const liquidationPrice = (istDebtAmount * liquidationRatio) / collateralAmount;
    const collateralAmountReturned = (vaultData.liquidatingState.balance - vaultData.balance) / 1_000_000;
    const oraclePriceRatio = oraclePrice.typeOutAmount / oraclePrice.typeInAmount;
    const collateralAmountReturnedUsd = collateralAmountReturned * oraclePriceRatio;
    let liquidationTime = '';
    let liquidationStartTime = '';

    if (vaultData?.liquidatingState) {
      liquidationStartTime = format(new Date(vaultData?.liquidatingState.blockTime), 'yyyy-MM-dd HH:mm');
    }


    if (vaultData?.liquidatingState) {
      const seconds: number = differenceInSeconds(new Date(vaultData.blockTime), new Date(vaultData?.liquidatingState.blockTime), {
        roundingMethod: 'ceil',
      });
      liquidationTime = formatSecondsToHumanReadable(seconds);
    }

    return {
      vault_idx: vaultIdx,
      collateral_type: vaultData.denom,
      state: vaultState,
      liquidating_debt_amount_avg: istDebtAmount,
      liquidation_margin_avg: liquidationRatio, // ??
      liquidating_rate: liquidationPrice,
      liquidationStartTime,
      liquidationTime,
      liquidated_return_amount: collateralAmountReturned,
      liquidated_return_amount_usd: collateralAmountReturnedUsd, // oracle price too high?
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <LiquidatedVaultsTable data={rows} />
    </>
  );
}
