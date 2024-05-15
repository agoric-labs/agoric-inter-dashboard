import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { VaultsDashboardData } from '@/types/vault-types';
import { formatPrice } from '@/utils';

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

  const totalCollateralLocked = Object.values(data).reduce((totalCount, tokenData) => {
    const totalCollateral = tokenData?.totalCollateral || 0;
    const typeOutAmount = Number(tokenData?.typeOutAmount) || 0;
    return totalCount + (totalCollateral / 1_000_000) * (typeOutAmount / 1_000_000);
  }, 0);
  return <ValueCard title={title} value={formatPrice(totalCollateralLocked)} />;
}
