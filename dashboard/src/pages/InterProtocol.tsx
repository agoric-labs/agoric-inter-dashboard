import { useCubeQuery } from '@cubejs-client/react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/components/SectionHeader';
import { ValueCard } from '@/components/ValueCard';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { colors } from '@/components/palette';
import { formatPercent, roundPrice, formatPrice, formatIST, extractFirstFloat } from '@/utils';
import { ErrorAlert } from '@/components/ErrorAlert';

const firstCards = [
  'IST in Circulation',
  'Total Mint Limit',
  'Total Mint Limit Utilized',
  'Total Interchain IST',
  '% of Interchain IST',
  'Smart Wallets Provisioned',
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN) - 5;

  return (
    <>
      <text x={x} y={y - 8} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {payload.name}
      </text>
      <text x={x} y={y + 8} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </>
  );
};

export function InterProtocol() {
  const wcRes = useCubeQuery({
    measures: ['wallets.address_count'],
  });

  const ibcRes = useCubeQuery({
    measures: ['balances.amount_sum'],
    timeDimensions: [
      {
        dimension: 'balances.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: { 'balances.day': 'desc' },
    segments: ['balances.interchain_ist'],
  });

  const vgRes = useCubeQuery({
    measures: ['vault_factory_governance.debt_limit_sum'],
    timeDimensions: [
      {
        dimension: 'vault_factory_governance.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: [['vault_factory_governance.day', 'desc']],
  });

  const vmRes = useCubeQuery({
    measures: ['vault_factory_metrics.total_debt_sum', 'vault_factory_metrics.total_collateral_usd_sum'],
    timeDimensions: [
      {
        dimension: 'vault_factory_metrics.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: [['vault_factory_metrics.day', 'desc']],
  });

  const psmGovRes = useCubeQuery({
    measures: ['psm_governance.mint_limit_sum'],
    timeDimensions: [
      {
        dimension: 'psm_governance.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: [['psm_governance.day', 'desc']],
  });

  const psmRes = useCubeQuery({
    measures: ['psm_stats.minted_pool_balance_sum'],
    timeDimensions: [
      {
        dimension: 'psm_stats.day',
        granularity: 'day',
        dateRange: 'from 1 days ago to now',
      },
    ],
    order: [['psm_stats.day', 'desc']],
  });

  const reserveRes = useCubeQuery({
    measures: ['reserve.shortfall_balance_avg'],
    timeDimensions: [{ dimension: 'reserve.day', granularity: 'day' }],
    order: {
      'reserve.day': 'desc',
    },
    limit: 1,
  });

  const reserveAllocRes = useCubeQuery({
    measures: ['reserve_allocations.amount_usd_sum'],
    timeDimensions: [{ dimension: 'reserve_allocations.day', granularity: 'day', dateRange: 'from 1 days ago to now' }],
    order: {
      'reserve_allocations.day': 'desc',
    },
  });

  if (reserveAllocRes.error) {
    return <ErrorAlert value={reserveAllocRes.error} />;
  }

  if (wcRes.error) {
    return <ErrorAlert value={wcRes.error} />;
  }

  if (ibcRes.error) {
    return <ErrorAlert value={ibcRes.error} />;
  }

  if (vmRes.error) {
    return <ErrorAlert value={vmRes.error} />;
  }

  if (vgRes.error) {
    return <ErrorAlert value={vgRes.error} />;
  }

  if (psmGovRes.error) {
    return <ErrorAlert value={psmGovRes.error} />;
  }

  if (psmRes.error) {
    return <ErrorAlert value={psmRes.error} />;
  }

  if (reserveRes.error) {
    return <ErrorAlert value={reserveRes.error} />;
  }

  if (
    wcRes.isLoading ||
    !wcRes.resultSet ||
    ibcRes.isLoading ||
    !ibcRes.resultSet ||
    vmRes.isLoading ||
    !vmRes.resultSet ||
    vgRes.isLoading ||
    !vgRes.resultSet ||
    psmRes.isLoading ||
    !psmRes.resultSet ||
    reserveRes.isLoading ||
    !reserveRes.resultSet ||
    reserveAllocRes.isLoading ||
    !reserveAllocRes.resultSet ||
    psmGovRes.isLoading ||
    !psmGovRes.resultSet
  ) {
    return (
      <>
        <PageHeader title="Summary" />
        <PageContent>
          <ValueCardGrid>
            {firstCards.map(title => (
              <ValueCard title={title} key={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />
            ))}
          </ValueCardGrid>
          <SectionHeader>Balances</SectionHeader>
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        </PageContent>
      </>
    );
  }

  // top cards
  const ibcBalance = extractFirstFloat(ibcRes, 'balances.amount_sum');
  const walletCount = extractFirstFloat(wcRes, 'wallets.address_count');

  const psmMinted = extractFirstFloat(psmRes, 'psm_stats.minted_pool_balance_sum');
  const vaultMinted = extractFirstFloat(vmRes, 'vault_factory_metrics.total_debt_sum');
  const totalMinted = psmMinted + vaultMinted;

  const vaultMintLimit = extractFirstFloat(vgRes, 'vault_factory_governance.debt_limit_sum');
  const psmMintLimit = extractFirstFloat(psmGovRes, 'psm_governance.mint_limit_sum');
  const totalMintLimit = vaultMintLimit + psmMintLimit;

  // bottom cards
  const totalReserve = extractFirstFloat(reserveAllocRes, 'reserve_allocations.amount_usd_sum');
  const reserveShortfall = extractFirstFloat(reserveRes, 'reserve.shortfall_balance_avg');
  const totalLockedCollateral = extractFirstFloat(vmRes, 'vault_factory_metrics.total_collateral_usd_sum');

  return (
    <>
      <PageHeader title="Summary" />
      <PageContent>
        <ValueCardGrid>
          <ValueCard title="IST in Circulation" value={formatIST(totalMinted)} />
          <ValueCard title="Total Mint Limit" value={formatIST(vaultMintLimit + psmMintLimit)} />
          <ValueCard title="Total Mint Limit Utilized" value={formatPercent(totalMinted / totalMintLimit)} />
          <ValueCard title="Total Interchain IST" value={formatIST(ibcBalance)} />
          <ValueCard title="% of Interchain IST" value={formatPercent(ibcBalance / totalMinted)} />
          <ValueCard title="Smart Wallets Provisioned" value={walletCount} />
        </ValueCardGrid>

        <SectionHeader>Balances</SectionHeader>
        <div className="flex-none md:flex">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <ValueCard title="Total Reserve Assets" value={formatPrice(totalReserve)} />
            <ValueCard title="Total Minted IST" value={formatIST(totalMinted)} />
            <ValueCard title="Total Collateral Value Locked" value={formatPrice(totalLockedCollateral)} />
            <ValueCard title="IST minted by Vaults" value={formatIST(vaultMinted)} />
            <ValueCard title="Total PSM Assets" value={formatPrice(psmMinted)} />
            <ValueCard title="IST minted by PSM" value={formatIST(psmMinted)} />
            <ValueCard title="Reserve Shortfall" value={formatPrice(reserveShortfall)} className="col-span-2" />
          </div>
          <div className="w-[400px] ml-5">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={[
                  {
                    name: 'Vaults',
                    value: roundPrice(vaultMinted),
                  },
                  {
                    name: 'PSM',
                    value: roundPrice(psmMinted),
                  },
                ]}
                outerRadius={100}
                fill="green"
                labelLine={false}
                label={renderCustomizedLabel}
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
