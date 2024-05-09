import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';

type Props = {
  title?: string;
  activeVaults: number;
  isLoading: boolean;
};

export function ActiveVaultCountCard({ title = 'Total Active Vaults', activeVaults = 0, isLoading }: Props) {
  if (isLoading) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  return <ValueCard title={`${title}`} value={activeVaults} />;
}
