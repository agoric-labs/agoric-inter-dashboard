import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice } from '@/utils';
import { VaultsDashboardData } from '@/pages/Vaults';

type Props = {
  title?: string;
  data: VaultsDashboardData;
  isLoading: boolean;
};

export function VaultTotalLockedCollateralValueCard({
  title = 'Total Locked Collateral Value',
  data,
  isLoading,
}: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  const totalCollateralLocked = Object.values(data).reduce(
    (totalCount, tokenData) =>
      totalCount + (tokenData.totalCollateral / 1_000_000) * (tokenData.typeOutAmount / 1_000_000),
    0,
  );
  return <ValueCard title={title} value={formatPrice(totalCollateralLocked)} />;
}
