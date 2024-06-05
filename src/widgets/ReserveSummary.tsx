import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { ReserveDashboardData } from '@/types/reserve-types';
import { formatPrice, getTokenDivisor } from '@/utils';

type Props = {
  title?: string;
  data: ReserveDashboardData;
  boardAuxes: { [key: string]: number };
  isLoading: boolean;
};

export function ReserveSummary({ title = 'Total Reserve Assets', data, boardAuxes, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />;
  }
  const totalReserve = data.reduce(
    (agg, node) =>
      agg +
      Object.values(node.allocations).reduce((agg_, node_) => {
        const tokenDivisor = getTokenDivisor(boardAuxes, node_.denom);
        const allocationInUsd =
          ((Number(node_.value) / tokenDivisor) * Number(node_.typeOutAmount || tokenDivisor)) / tokenDivisor;
        return agg_ + allocationInUsd;
      }, 0),
    0,
  );
  return <ValueCard title={title} value={formatPrice(totalReserve)} />;
}
