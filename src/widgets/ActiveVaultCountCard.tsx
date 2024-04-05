import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { VaultsDashboardData } from '@/pages/Vaults';

type Props = {
  title?: string;
  data: VaultsDashboardData;
  isLoading: boolean;
};

export function ActiveVaultCountCard({ title = 'Total Active Vaults', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  const activeVaultCount = Object.values(data).reduce(
    (totalCount, tokenData) => totalCount + Number(tokenData.numActiveVaults),
    0,
  );

  return <ValueCard title={`${title}`} value={activeVaultCount} />;
}
