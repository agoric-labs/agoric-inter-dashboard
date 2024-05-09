import { ValueCard } from '@/components/ValueCard';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  title?: string;
  totalCollateralTypes: number;
  isLoading: boolean;
};

export function VaultManagerCountCard({
  title = 'Total Collateral Types',
  totalCollateralTypes = 0,
  isLoading,
}: Props) {
  if (isLoading) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  return <ValueCard title={title} value={totalCollateralTypes} />;
}
