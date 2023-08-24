import { useLoaderData } from 'react-router-dom';
import { VaultManagersTable } from '@/components/VaultManagersTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ValueCard } from '@/components/ValueCard';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { OpenVaultsTable } from '@/components/OpenVaultsTable';
import { SectionHeader } from '@/components/SectionHeader';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { BarChart } from '@/components/BarChart';
import { OraclePriceCards } from '@/widgets/OraclePriceCards';
import { ActiveVaultCountCard } from '@/widgets/ActiveVaultCountCard';
import { VaultTotalLockedCollateralChart } from '@/widgets/VaultTotalLockedCollateralChart';
import { VaultTotalMintedISTChart } from '@/widgets/VaultTotalMintedISTChart';
import { OpenVaults } from '@/widgets/OpenVaults';
import { formatPrice } from '@/utils';

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
        <hr className="my-5" />
        <hr className="my-5" />
        <OpenVaults />
      </PageContent>
    </>
  );
}

export function OldVaults() {
  const data: any = useLoaderData();
  // const atomPrice

  return (
    <>
      <PageHeader title="Vaults" />
      <PageContent>
        <ValueCardGrid>
          {data.oracle_prices.map((p: any) => (
            <ValueCard
              title={`Oracle Price, ${p.type_in_name} ↔︎ ${p.type_out_name}`}
              value={p.type_out_name === 'USD' ? formatPrice(p.rate) : p.rate}
            />
          ))}
          <ValueCard title="Total Active Vaults" value={data.open_vaults.length.toString()} />
        </ValueCardGrid>
        <Card>
          <CardHeader>
            <CardTitle>Total Locked Collateral</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.vaults_metrics}
              xKey="date"
              y2Key="collateral_type"
              valueKey="avg_total_locked_collateral"
            />
          </CardContent>
        </Card>

        <Card className="my-4 mb-4">
          <CardHeader>
            <CardTitle>Total Minted IST</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={data.vaults_metrics} xKey="date" y2Key="debt_type" valueKey="avg_total_ist_minted" />
          </CardContent>
        </Card>

        <hr className="my-5" />

        <SectionHeader>Collateral Type</SectionHeader>
        <VaultManagersTable data={data.managers} />

        <hr className="my-5" />

        <SectionHeader>Open vaults</SectionHeader>
        <OpenVaultsTable data={data.open_vaults} />
      </PageContent>
    </>
  );
}
