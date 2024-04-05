import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/components/SectionHeader';
import { TokenPricesTable } from '@/components/TokenPricesTable';
import { icons } from '@/components/OraclePrices';
import { VaultsDashboardData } from '@/pages/Vaults';

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

  const oraclePrices = Object.values(data).map((token) => {
    const change = 1 - token.typeOutAmount / token.typeInAmount;
    const changeValue = Math.round(change * 10000) / 100;
    return {
      token: (
        <span className="flex">
          <img
            src={icons[token.liquidatingCollateralBrand.toLowerCase()] || icons.unknown}
            alt={token.liquidatingCollateralBrand}
            className="w-4 h-4"
          />{' '}
          <span className="flex-1 ml-2">{token.liquidatingCollateralBrand}</span>
        </span>
      ),
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
