import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { OraclePriceCards } from '@/widgets/OraclePriceCards';
import { ActiveVaultCountCard } from '@/widgets/ActiveVaultCountCard';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { VaultStatesChart } from '@/widgets/VaultStatesChart';
import { OpenVaults } from '@/widgets/OpenVaults';
import { VaultManagers } from '@/widgets/VaultManagers';

export function Vaults() {
  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          <OraclePriceCards />
          <ActiveVaultCountCard />
        </ValueCardGrid>
        <VaultTotalLockedCollateralChart />
        <VaultTotalMintedISTChart />
        <VaultStatesChart />
        <hr className="my-5" />
        <VaultManagers />
        <hr className="my-5" />
        <OpenVaults />
      </PageContent>
    </>
  );
}
