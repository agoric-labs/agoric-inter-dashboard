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
    const oraclePriceYesterday = sortedOracleDailyPrices[0].typeOutAmountLast / 1_000_000;
    const oraclePriceToday = sortedOracleDailyPrices[1].typeOutAmountLast / 1_000_000;
    const change = 1 - (oraclePriceToday / oraclePriceYesterday);
    const changeValue = Math.round(change * 10000) / 100;

    return {
      token: <CollateralWithIcon collateralType={token.liquidatingCollateralBrand} />,
      name: token.liquidatingCollateralBrand,
      numActive: token.numActiveVaults,
      oraclePrice: token.typeOutAmount / 1_000_000,
      dayChange:
        changeValue >= 0 ? (
          <div className="text-right text-green-500">+{changeValue}%</div>
        ) : (
          <div className="text-right text-red-500">{changeValue}%</div>
        ),
    };
  });

  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <TokenPricesTable data={oraclePrices} />
    </>
  );
}
