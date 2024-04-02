import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { LiquidatedVaultCountCard } from '@/widgets/LiquidatedVaultCountCard';

export function Liquidated() {
  return (
    <>
      <PageHeader title="Liquidated Vaults" />
      <PageContent>
        <ValueCardGrid>
          <LiquidatedVaultCountCard />
        </ValueCardGrid>
        <VaultStatesChart />
        <hr className="my-5" />
        <LiquidatedVaults />
      </PageContent>
    </>
  );
}
