import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice, getTokenDivisor } from '@/utils';
import { ReserveDashboardData } from '@/types/reserve-types';

type Props = {
  title?: string;
  data: ReserveDashboardData;
  isLoading: boolean;
  boardAuxes: { [key: string]: number };
};

export function ReserveShortfall({ title = 'Reserve Shortfall', data, boardAuxes, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />;
  }
  const istDivisor = getTokenDivisor(boardAuxes, 'IST');
  const shortfall = data.reduce((agg, node) => agg + Number(node.shortfallBalance), 0) / istDivisor;
  return <ValueCard title={title} value={formatPrice(shortfall)} />;
}
