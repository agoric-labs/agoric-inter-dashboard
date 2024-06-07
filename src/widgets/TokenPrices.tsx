import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/components/SectionHeader';
import { TokenPricesTable } from '@/components/TokenPricesTable';
import CollateralWithIcon from '@/components/ui/collateralWithIcon';
import { VaultsDashboardData } from '@/types/vault-types';
import { createNumberWithLeadingZeroes } from '@/utils';

type Props = {
  title?: string;
  data: VaultsDashboardData;
  isLoading: boolean;
};

export function TokenPrices({ title = 'Summary', data, isLoading }: Props) {
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
  const entries = Object.values(data);
  const sortedEntries = entries.sort((a, b) => {
    const nameA: string = a.liquidatingCollateralBrand?.toLowerCase();
    const nameB: string = b.liquidatingCollateralBrand?.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const oraclePrices = sortedEntries.map((token) => {
    const typeOutAmount = Number(token?.typeOutAmount) || 0;
    const typeInAmount = Number(token?.typeInAmount) || 0;

    const tokenDivisor = createNumberWithLeadingZeroes(token?.decimalPlaces);
    // Determine 24h change in oracle price
    const sortedOracleDailyPrices = token?.oracleDailyPrices?.sort((a, b) => b.dateKey - a.dateKey);
    const changeValue =
      sortedOracleDailyPrices.length >= 2
        ? (() => {
            const oraclePriceYesterday =
              sortedOracleDailyPrices[0].typeOutAmountLast / sortedOracleDailyPrices[0].typeInAmountLast;
            const oraclePriceToday =
              sortedOracleDailyPrices[1].typeOutAmountLast / sortedOracleDailyPrices[1].typeInAmountLast;
            const change = 1 - oraclePriceToday / oraclePriceYesterday;
            return Math.round(change * 10000) / 100;
          })()
        : null;

    let dayChange;
    if (changeValue === null) {
      dayChange = <div className="text-right text-blue-500">N/A</div>;
    } else if (changeValue >= 0) {
      dayChange = <div className="text-right text-green-500">+{changeValue}%</div>;
    } else {
      dayChange = <div className="text-right text-red-500">{changeValue}%</div>;
    }

    return {
      token: <CollateralWithIcon collateralType={token.liquidatingCollateralBrand} />,
      name: token.liquidatingCollateralBrand,
      numActive: token?.numActiveVaults || 0,
      oraclePrice: typeOutAmount / typeInAmount,
      dayChange,
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <TokenPricesTable data={oraclePrices} />
    </>
  );
}
