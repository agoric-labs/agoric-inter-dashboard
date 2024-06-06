import { PSMStats as Item, Skeleton } from '@/components/PSMStats';
import { ErrorAlert } from '@/components/ErrorAlert';
import { coinLabels } from '../coinLabels';
import { getTokenDivisor, range } from '@/utils';

export function PSMStats({
  data,
  error,
  boardAuxes,
  isLoading,
}: {
  data: object;
  boardAuxes: { [key: string]: number };
  error?: Error;
  isLoading: boolean;
}) {
  if (error) {
    return <ErrorAlert value={error} title="Request Error" />;
  }

  if (!data || isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {range(6).map((n) => (
          <Skeleton key={n} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {Object.entries(data).map(([coinName, coinData]) => {
        const tokenDivisor = getTokenDivisor(boardAuxes, 'IST');

        const formattedMintLimit = coinData.mintLimit / tokenDivisor;
        const formattedPoolBalance = coinData.mintedPoolBalance / tokenDivisor;

        return (
          <Item
            data={{
              coin: coinName,
              label: coinLabels[coinName] || coinName,
              mint_limit: formattedMintLimit,
              minted_pool_balance: formattedPoolBalance,
              utilized: formattedPoolBalance / formattedMintLimit,
            }}
            key={coinName}
          />
        );
      })}
    </div>
  );
}
