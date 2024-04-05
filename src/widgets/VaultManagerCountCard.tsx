import { ValueCard } from '@/components/ValueCard';
import { Skeleton } from '@/components/ui/skeleton';
import { VaultsDashboardData } from '@/pages/Vaults';

type Props = {
  title?: string;
  data: VaultsDashboardData;
  isLoading: boolean;
};

export function VaultManagerCountCard({ title = 'Total Collateral Types', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  return <ValueCard title={title} value={Object.keys(data).length} />;
}
