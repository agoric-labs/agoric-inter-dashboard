import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { TokenPrices } from '@/widgets/TokenPrices';
import { ActiveVaultCountCard } from '@/widgets/ActiveVaultCountCard';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { OpenVaults } from '@/widgets/OpenVaults';
import { LiquidatedVaults } from '@/widgets/LiquidatedVaults';
import { VaultManagers } from '@/widgets/VaultManagers';

export function Vaults() {
  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <ActiveVaultCountCard />
        </ValueCardGrid>
        <TokenPrices />
        <VaultTotalLockedCollateralChart />
        <VaultTotalMintedISTChart />
        <hr className="my-5" />
        <VaultManagers />
        <hr className="my-5" />
        <OpenVaults />
        <hr className="my-5" />
        <LiquidatedVaults />
      </PageContent>
    </>
  );
}
