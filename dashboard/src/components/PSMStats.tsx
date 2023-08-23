import { formatPrice, formatPercent } from '@/utils';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from './ui/card';

type Props = {
  data: {
    coin: string;
    label: string;
    mint_limit: number;
    minted_pool_balance: number;
    utilized: number;
  };
};

export const PSMStats = ({ data }: Props) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="font-bold">{data.label}</CardTitle>
    </CardHeader>
    <CardContent className="flex-none md:flex flex-row items-center justify-between">
      <div className="text-2xl tracking-tight mt-4">
        <span className="font-bold">
          {formatPrice(data.minted_pool_balance)} of{' '}
          <span className="text-gray-400">{formatPrice(data.mint_limit)}</span>
        </span>
        <CardDescription>Minted IST / Limit</CardDescription>
      </div>
      <div className="text-2xl md:text-right mt-4">
        <span className="font-bold">{formatPercent(data.utilized)}</span>
        <CardDescription>Utilized</CardDescription>
      </div>
    </CardContent>
  </Card>
);
