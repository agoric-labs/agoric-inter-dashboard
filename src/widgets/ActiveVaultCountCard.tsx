import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { OpenVaultsData } from '@/pages/Vaults';

type Props = {
  title?: string;
  data: OpenVaultsData;
  isLoading: boolean;
};

export function ActiveVaultCountCard({ title = 'Total Active Vaults', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  return <ValueCard title={`${title}`} value={data.length} />;
}
