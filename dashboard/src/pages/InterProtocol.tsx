import { useLoaderData } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SectionHeader } from '@/components/SectionHeader';
import { ValueCard } from '@/components/ValueCard';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { colors } from '@/components/palette';
import { formatPercent, roundPrice, formatPrice, formatIST } from '@/utils';

export function InterProtocol() {
  const data: any = useLoaderData();

  let totalMintLimit = data.psm_stats.reduce((s: any, i: any) => s + i.mint_limit, 0);
  let totalMinted = data.psm_stats.reduce((s: any, i: any) => s + i.minted_pool_balance, 0);

  if (data.vault_total_minted[0]?.value) {
    totalMinted += data.vault_total_minted[0].value;
  }

  if (data.managers.length > 0) {
    data.managers.forEach((m: any) => {
      totalMintLimit += m.ist_minting_limit;
    });
  }

  const interchanIST = data.ibc_balances[0]?.total || 0;

  return (
    <>
      <PageHeader title="Summary" />
      <PageContent>
        <ValueCardGrid>
          <ValueCard title="IST in Circulation" value={formatIST(totalMinted)} />
          <ValueCard title="Total Mint Limit" value={formatIST(totalMintLimit)} />
          <ValueCard title="Total Mint Limit Utilized" value={formatPercent(totalMinted / totalMintLimit)} />
          <ValueCard title="Total Interchain IST" value={formatIST(interchanIST)} />
          <ValueCard title="% of Interchain IST" value={formatPercent(interchanIST / totalMinted)} />
          <ValueCard title="Smart Wallets Provisioned" value={data.smart_wallet_provisioned[0].value} />
        </ValueCardGrid>

        <SectionHeader>Balances</SectionHeader>
        <div className="flex-none md:flex">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <ValueCard title="Total Reserve Assets" value={formatPrice(data.total_reserve_assets[0]?.value)} />
            <ValueCard title="Total Minted IST" value={formatIST(data.total_minted_ist[0]?.value)} />
            <ValueCard title="Total Vault Assets" value={formatPrice(data.vault_total_assets[0]?.value)} />
            <ValueCard title="Minted by Vaults" value={formatIST(data.vault_total_minted[0]?.value)} />
            <ValueCard title="Total PSM Assets" value={formatPrice(data.psm_total_assets[0]?.value)} />
            <ValueCard title="Minted by PSM" value={formatIST(data.psm_total_minted[0]?.value)} />
            <ValueCard
              title="Reserve Shortfall"
              value={formatPrice(data.reserve_shortfall[0]?.value)}
              className="col-span-2"
            />
          </div>
          <div className="w-[400px] ml-5">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={[
                  {
                    name: 'Vaults',
                    value: roundPrice(data.vault_total_minted[0]?.value || 0),
                  },
                  {
                    name: 'PSM',
                    value: roundPrice(data.psm_total_minted[0]?.value || 0),
                  },
                ]}
                outerRadius={100}
                fill="green"
                label={false}
              >
                <Cell fill={colors[0]} />
                <Cell fill={colors[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </PageContent>
    </>
  );
}

export const interProtocolLoader = () => fetch('/data/ollinet.json').then((r) => r.json());
