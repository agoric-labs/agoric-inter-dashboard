import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/components/SectionHeader';
import { TokenPricesTable } from '@/components/TokenPricesTable';
import { VaultsDashboardData } from '@/pages/Vaults';
import CollateralWithIcon from '@/components/ui/collateralWithIcon';

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
    // Determine 24h change in oracle price
    const sortedOracleDailyPrices = token?.oracleDailyPrices?.sort((a, b) => b.dateKey - a.dateKey);
    const changeValue = sortedOracleDailyPrices.length > 0 ? (() => {
      const oraclePriceYesterday = sortedOracleDailyPrices[0].typeOutAmountLast / 1_000_000;
      const oraclePriceToday = sortedOracleDailyPrices[1].typeOutAmountLast / 1_000_000;
      const change = 1 - (oraclePriceToday / oraclePriceYesterday);
      return Math.round(change * 10000) / 100
    })() : null;

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
      numActive: token.numActiveVaults,
      oraclePrice: token.typeOutAmount / 1_000_000,
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
