import { ValueCard } from '@/components/ValueCard';
import { GET_ACCOUNT_BALANCE_URL, UIST_DENOMINATION } from '@/constants';
import { fetchDataFromUrl, formatPrice, getTokenDivisor } from '@/utils';
import { AxiosResponse, AxiosError } from 'axios';
import useSWR from 'swr';
import DataStatus from '@/components/DataStatus';

type Props = {
  title?: string;
  isLoading: boolean;
  error: any;
  reserveAddress: string;
  boardAuxes: { [key: string]: number };
};

export function ReserveCosmosSummary({
  title = 'Cosmos Reserve',
  boardAuxes,
  isLoading,
  reserveAddress,
  error,
}: Props) {
  if (isLoading || error || !reserveAddress) {
    const errorMessage = !reserveAddress && 'Oops! Unable to show Cosmos Reserve';

    return (
      <DataStatus isLoading={isLoading} error={error || (errorMessage && { message: errorMessage })} title={title} />
    );
  }

  const {
    data: reserveBalance,
    isLoading: reserveBalanceLoading,
    error: reserveBalanceError,
  } = useSWR<AxiosResponse, AxiosError>(GET_ACCOUNT_BALANCE_URL(reserveAddress), fetchDataFromUrl);

  if (reserveBalanceLoading || reserveBalanceError) {
    return <DataStatus isLoading={reserveBalanceLoading} error={reserveBalanceError} title={title} />;
  }

  const istReserve: { amount: number } = reserveBalance?.data?.balances?.find(
    (balance: { denom: string }) => balance.denom === UIST_DENOMINATION,
  );

  const istDivisor = getTokenDivisor(boardAuxes, 'IST');
  const istReserveBalance = (istReserve?.amount || 0) / istDivisor;

  return <ValueCard title={title} value={formatPrice(istReserveBalance)} />;
}
