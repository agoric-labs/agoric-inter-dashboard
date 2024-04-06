import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice } from '@/utils';
import { ReserveDashboardData } from '@/pages/Reserve';

type Props = {
  title?: string;
  data: ReserveDashboardData;
  isLoading: boolean;
};

export function ReserveShortfall({ title = 'Reserve Shortfall', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />;
  }
  const shortfall = data.reduce((agg, node) => agg + Number(node.shortfallBalance), 0) / 1_000_000;
  return <ValueCard title={title} value={formatPrice(shortfall)} />;
}
