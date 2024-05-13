import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { ReserveDashboardData } from '@/types/reserve-types';
import { formatPrice } from '@/utils';

type Props = {
  title?: string;
  data: ReserveDashboardData;
  isLoading: boolean;
};

export function ReserveSummary({ title = 'Total Reserve Assets', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />;
  }
  const totalReserve = data.reduce(
    (agg, node) =>
      agg +
      Object.values(node.allocations).reduce((agg_, node_) => {
        const allocationInUsd = ((Number(node_.value) / 1_000_000) * Number(node_.typeOutAmount || 1_000_000)) / 1_000_000;
        return agg_ + allocationInUsd;
      }, 0),
    0,
  );
  return <ValueCard title={title} value={formatPrice(totalReserve)} />;
}
