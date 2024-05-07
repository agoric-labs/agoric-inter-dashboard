import axios from 'axios';
import useSWR from 'swr';
import { AxiosError, AxiosResponse } from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/components/SectionHeader';
import { ValueCard } from '@/components/ValueCard';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { colors } from '@/components/palette';
import { formatPercent, roundPrice, formatPrice, formatIST, subQueryFetcher } from '@/utils';
import { ErrorAlert } from '@/components/ErrorAlert';
import { INTER_DASHBOARD_QUERY } from '@/queries';
import {
  GET_INTERCHAIN_BALANCES_URL,
} from '@/constants';

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

type OraclePriceNode = {
  priceFeedName: string;
  typeInAmount: number;
  typeOutAmount: number;
  typeInName: string;
  typeOutName: string;
  id: string;
};
type PsmGovernancesNode = { token: string; mintLimit: number };
type PsmMetricsNode = { token: string; anchorPoolBalance: number; mintedPoolBalance: number };
type AllocationsNode = { id: string; token: string; value: number };
type ReserveMetricsNode = {
  allocations: { nodes: Array<AllocationsNode> };
  shortfallBalance: number;
  totalFeeBurned: number;
};
type VaultManagerGovernancesNode = {
  id: string;
  debtLimit: number;
};
type VaultManagerMetricsNode = {
  id: string;
  liquidatingCollateralBrand: string;
  liquidatingDebtBrand: string;
  totalCollateral: number;
  totalDebt: number;
};
type BoardAuxesNode = { allegedName: string; decimalPlaces: number };

type InterProtocolResponse = {
  oraclePrices: { nodes: Array<OraclePriceNode> };
  psmGovernances: { nodes: Array<PsmGovernancesNode> };
  psmMetrics: { nodes: Array<PsmMetricsNode> };
  reserveMetrics: { nodes: Array<ReserveMetricsNode> };
  vaultManagerGovernances: {
    nodes: Array<VaultManagerGovernancesNode>;
  };
  vaultManagerMetrics: {
    nodes: Array<VaultManagerMetricsNode>;
  };
  wallets: { totalCount: number };
  boardAuxes: { nodes: Array<BoardAuxesNode> };
};

type Balance = {
  denom: string;
  amount: string;
};

type AccountData = {
  channel_id: string;
  address: string;
  balance: Balance[];
};

function getInterchainBalance(data: AccountData[]): number {
  const balanceList = data?.map(account => ({
      channel_id: account.channel_id,
      address: account.address,
      uist_balance: Number(account.balance.find(b => b.denom === "uist")?.amount || "0")
  })).filter(account => account.uist_balance !== 0);
  // sum up the balances
  return balanceList.reduce((acc, account) => acc + account.uist_balance, 0) / 1_000_000;
}

export function InterProtocol() {
  const { data, error, isLoading } = useSWR<AxiosResponse, AxiosError>(INTER_DASHBOARD_QUERY, subQueryFetcher);
  const { data: balances } = useSWR<AxiosResponse, AxiosError>(GET_INTERCHAIN_BALANCES_URL, axios.get);
  const ibcBalance = getInterchainBalance(balances?.data?.balances);
  const response: InterProtocolResponse = data?.data?.data;

  const oraclePrices: { [key: string]: OraclePriceNode } = response?.oraclePrices?.nodes?.reduce(
    (agg, node) => ({ ...agg, [node.typeInName]: node }),
    {},
  );

  if (error) {
    return <ErrorAlert value={error} />;
  }
  if (isLoading) {
    return (
      <>
        <PageHeader title="Summary" />
        <PageContent>
          <ValueCardGrid>
            {firstCards.map((title) => (
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

  const walletCount = response.wallets.totalCount;

  const boardAuxes: { [key: string]: number } = response.boardAuxes.nodes.reduce(
    (agg, node) => ({ ...agg, [node.allegedName]: node.decimalPlaces }),
    {},
  );

  const psmMinted =
    response.psmMetrics.nodes.reduce((agg, node) => agg + Number(node.mintedPoolBalance), 0) / 1_000_000;
  const psmAnchor = response.psmMetrics.nodes.reduce(
    (agg, node) => agg + Number(node.anchorPoolBalance) / 10 ** (boardAuxes[node.token] || 6),
    0,
  );
  const vaultMinted =
    response.vaultManagerMetrics.nodes.reduce((agg, node) => agg + Number(node.totalDebt), 0) / 1_000_000;
  const totalMinted = psmMinted + vaultMinted;

  const vaultMintLimit =
    response.vaultManagerGovernances.nodes.reduce((agg, node) => agg + Number(node.debtLimit), 0) / 1_000_000;
  const psmMintLimit = response.psmGovernances.nodes.reduce((agg, node) => agg + Number(node.mintLimit), 0) / 1_000_000;
  const totalMintLimit = vaultMintLimit + psmMintLimit;

  // bottom cards
  const totalReserve = response.reserveMetrics.nodes.reduce(
    (agg, node) =>
      agg +
      node.allocations.nodes.reduce((agg_, node_) => {
        const allocationInUsd =
          ((Number(node_.value) / 1_000_000) * Number(oraclePrices[node_.token]?.typeOutAmount || 1_000_000)) / 1_000_000;
        return agg_ + allocationInUsd;
      }, 0),
    0,
  );
  const reserveShortfall =
    response.reserveMetrics.nodes.reduce((agg, node) => agg + Number(node.shortfallBalance), 0) / 1_000_000;
  const totalLockedCollateral = response.vaultManagerMetrics.nodes.reduce((agg, node) => {
    const collateralInUsd =
      ((Number(node.totalCollateral) / 1_000_000) *
        Number(oraclePrices[node.liquidatingCollateralBrand]?.typeOutAmount) || 0) / 1_000_000;
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
