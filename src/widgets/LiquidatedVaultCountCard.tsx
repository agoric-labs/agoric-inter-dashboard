import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import { VaultManagerMetricsNode } from '@/pages/Liquidated';

type Props = {
  title?: string;
  data: Array<VaultManagerMetricsNode>;
  isLoading: boolean;
};

export function LiquidatedVaultCountCard({ title = 'Total Liquidated Vaults', data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ValueCard title={title} value={<Skeleton className="w-[50px] h-[32px] rounded-full" />} />;
  }

  const liquidatedCount = data.reduce((agg, vaultMetric) => agg + Number(vaultMetric.numLiquidationsCompleted), 0);
  return <ValueCard title={title} value={liquidatedCount} />;
}
