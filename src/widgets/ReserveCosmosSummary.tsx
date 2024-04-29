import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice } from '@/utils';

type Props = {
  title?: string;
  data: number;
  isLoading: boolean;
};

export function ReserveCosmosSummary({ title = 'Cosmos Reserve', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[120px] h-[32px] rounded-full" />} />;
  }

  return <ValueCard title={title} value={formatPrice(data)} />;
}
