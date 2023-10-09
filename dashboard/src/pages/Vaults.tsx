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
import { VaultManagerCountCard } from '@/widgets/VaultManagerCountCard';
import { VaultTotalLockedCollateralValueCard } from '@/widgets/VaultTotalLockedCollateralValueCard';

export function Vaults() {
  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <VaultManagerCountCard />
          <ActiveVaultCountCard />
          <VaultTotalLockedCollateralValueCard />
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
