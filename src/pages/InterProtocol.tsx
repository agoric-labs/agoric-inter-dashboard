import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SectionHeader } from '@/components/SectionHeader';
import { ValueCard } from '@/components/ValueCard';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { colors } from '@/components/palette';
import {
  formatPercent,
  roundPrice,
  formatPrice,
  formatIST,
  subQueryFetcher,
  fetchDataFromUrl,
  getTokenDivisor,
} from '@/utils';
import { INTER_DASHBOARD_QUERY } from '@/queries';
import { GET_INTERCHAIN_BALANCES_URL } from '@/constants';
import InterProtocolSkeleton from '@/components/InterProtocolSkeleton';
import { AccountData, InterProtocolResponse } from '@/types/interprotocol-types';
import { OraclePriceNode } from '@/types/vault-types';

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

function getInterchainBalance(data: AccountData[]): number {
  const balanceList = data
    .map((account) => ({
      channel_id: account.channel_id,
      address: account.address,
      uist_balance: Number(account.balance.find((b) => b.denom === 'uist')?.amount || '0'),
    }))
    .filter((account) => account.uist_balance !== 0);
  return balanceList.reduce((acc, account) => acc + account.uist_balance, 0) / 1_000_000;
}
export function InterProtocol() {
  const {
    data: dashboardData,
    error: dashboardError,
    isLoading: isDashboardLoading,
  } = useSWR<AxiosResponse, AxiosError>(INTER_DASHBOARD_QUERY, subQueryFetcher);

  const {
    data: interchainBalanceData,
    error: interchainBalanceError,
    isLoading: isInterchainBalanceLoading,
  } = useSWR<AxiosResponse, AxiosError>(GET_INTERCHAIN_BALANCES_URL, fetchDataFromUrl);

  const error = dashboardError || interchainBalanceError;
  const isLoading = isDashboardLoading || isInterchainBalanceLoading;

  if (error || isLoading) {
    return <InterProtocolSkeleton error={error} isLoading={isLoading} />;
  }

  const ibcBalance = getInterchainBalance(interchainBalanceData?.data?.balances);
  const dashboardResponse: InterProtocolResponse = dashboardData?.data?.data;
  const walletCount = dashboardResponse?.wallets?.totalCount;

  const oraclePrices: { [key: string]: OraclePriceNode } = dashboardResponse?.oraclePrices?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.typeInName]: node }),
    {},
  );

  const boardAuxes: { [key: string]: number } = dashboardResponse.boardAuxes.nodes.reduce(
    (agg, node) => ({ ...agg, [node.allegedName]: node.decimalPlaces }),
    {},
  );

  const istTokenDivisor = getTokenDivisor(boardAuxes, 'IST');

  const psmMinted =
    dashboardResponse.psmMetrics.nodes.reduce((agg, node) => agg + Number(node.mintedPoolBalance), 0) / istTokenDivisor;

  const psmAnchor = dashboardResponse.psmMetrics.nodes.reduce((agg, node) => {
    const decimalPlaces = (boardAuxes && boardAuxes[node.denom]) || 6;
    const anchorPoolBalance = Number(node.anchorPoolBalance) / 10 ** decimalPlaces;
    return agg + anchorPoolBalance;
  }, 0);

  const vaultMinted = dashboardResponse.vaultManagerMetrics.nodes.reduce((agg, node) => {
    const tokenDivisor = getTokenDivisor(boardAuxes, node.liquidatingCollateralBrand);
    return agg + Number(node.totalDebt) / tokenDivisor;
  }, 0);

  const totalMinted = psmMinted + vaultMinted;

  const vaultMintLimit =
    dashboardResponse.vaultManagerGovernances.nodes.reduce((agg, node) => agg + Number(node.debtLimit), 0) /
    istTokenDivisor;

  const psmMintLimit =
    dashboardResponse.psmGovernances.nodes.reduce((agg, node) => agg + Number(node.mintLimit), 0) / istTokenDivisor;

  const totalMintLimit = vaultMintLimit + psmMintLimit;

  // bottom cards
  const totalReserve = dashboardResponse.reserveMetrics.nodes.reduce(
    (agg, node) =>
      agg +
      node.allocations.nodes.reduce((agg_, node_) => {
        const tokenDivisor = getTokenDivisor(boardAuxes, node_.denom);
        const allocationInUsd =
          ((Number(node_.value) / tokenDivisor) * Number(oraclePrices[node_.denom]?.typeOutAmount || tokenDivisor)) /
          tokenDivisor;
        return agg_ + allocationInUsd;
      }, 0),
    0,
  );
  const reserveShortfall =
    dashboardResponse.reserveMetrics.nodes.reduce((agg, node) => agg + Number(node.shortfallBalance), 0) /
    istTokenDivisor;
  const totalLockedCollateral = dashboardResponse.vaultManagerMetrics.nodes.reduce((agg, node) => {
    const tokenDivisor = getTokenDivisor(boardAuxes, node.liquidatingCollateralBrand);

    const collateralInUsd =
      ((Number(node.totalCollateral) / tokenDivisor) *
        Number(oraclePrices[node.liquidatingCollateralBrand]?.typeOutAmount) || 0) / tokenDivisor;
    return agg + collateralInUsd;
  }, 0);

  return (
    <>
      <PageHeader title="Summary" />
      <PageContent>
        <ValueCardGrid>
          <ValueCard title="IST in Circulation" value={formatIST(totalMinted)} testId="inter-protocol-minted" />
          <ValueCard
            title="Total Mint Limit"
            value={formatIST(vaultMintLimit + psmMintLimit)}
            testId="inter-protocol-mint-limit"
          />
          <ValueCard
            title="Total Mint Limit Utilized"
            value={formatPercent(totalMinted / totalMintLimit)}
            testId="inter-protocol-mint-limit-utilized"
          />
          <ValueCard title="Total Interchain IST" value={formatIST(ibcBalance)} />
          <ValueCard title="% of Interchain IST" value={formatPercent(ibcBalance / totalMinted)} />
          <ValueCard title="Smart Wallets Provisioned" value={walletCount} />
        </ValueCardGrid>

        <SectionHeader>Balances</SectionHeader>
        <div className="flex-none md:flex">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <ValueCard
              title="Total Reserve Assets"
              value={formatPrice(totalReserve)}
              testId="inter-protocol-total-reserve-assets"
            />
            <ValueCard title="Total Minted IST" value={formatIST(totalMinted)} testId="inter-protocol-total-minted" />
            <ValueCard
              title="Total Collateral Value Locked"
              value={formatPrice(totalLockedCollateral)}
              testId="inter-protocol-total-collateral-value-locked"
            />
            <ValueCard
              title="IST minted by Vaults"
              value={formatIST(vaultMinted)}
              testId="inter-protocol-ist-minted-vaults"
            />
            <ValueCard
              title="Total PSM Assets"
              value={formatPrice(psmAnchor)}
              testId="inter-protocol-total-psm-assets"
            />
            <ValueCard title="IST minted by PSM" value={formatIST(psmMinted)} testId="inter-protocol-ist-minted-psm" />
            <ValueCard
              title="Reserve Shortfall"
              value={formatPrice(reserveShortfall)}
              className="col-span-2"
              testId="inter-protocol-reserve-shortfall"
            />
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
