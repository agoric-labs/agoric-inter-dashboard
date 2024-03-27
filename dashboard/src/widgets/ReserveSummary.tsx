import { Skeleton } from '@/components/ui/skeleton';
import { ValueCard } from '@/components/ValueCard';
import axios from 'axios';
import useSWR from 'swr';

type Props = {
  title?: string;
};

async function fetchFromSubQuery(url: string) {
  const query = `
  query {
    boardAuxes(first: 5) {
      nodes {
        id
        blockHeight
        blockTime
        allegedName
      }
    }
    messages(first: 5) {
      nodes {
        id
        blockHeight
        txHash
        from
      }
    }
  }
`;

  const response = axios.post(
    url,
    { query },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response;
}

export function ReserveSummary({ title = 'Total Reserve Assets' }: Props) {
  const { data, error, isLoading } = useSWR('https://api.subquery.network/sq/agoric-labs/mainnet', fetchFromSubQuery);

  if (isLoading) {
    return <ValueCard title={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />;
  }

  return <ValueCard title={title} value={data?.data.data.messages.nodes[0].blockHeight} />;
}
