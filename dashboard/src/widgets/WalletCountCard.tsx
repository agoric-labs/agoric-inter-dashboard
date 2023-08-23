import { useCubeQuery } from '@cubejs-client/react';
import { ValueCard } from '@/components/ValueCard';
import { getCubeQueryView, formatIST } from '@/utils';

type Props = {
  title?: string;
};

export function WalletCountCard({ title = 'Smart Wallets Provisioned' }: Props) {
  const res = useCubeQuery({
    measures: ['wallets.address_count'],
  });

  if (res.isLoading || !res.resultSet) {
    return <ValueCard title={title} value="Loading..." />;
  }

  const [resultSet, requestView] = getCubeQueryView(res);
  if (!resultSet) {
    return requestView;
  }

  const rows = resultSet.tablePivot();
  if (rows.length === 0) {
    return null;
  }

  return <ValueCard title={title} value={formatIST(rows[0]['wallets.address_count'])} />;
}
