import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseISO, format } from 'date-fns';
import { UseCubeQueryResult } from '@cubejs-client/react';
import { ErrorAlert } from '@/components/ErrorAlert';
import { Loading } from '@/components/Loading';

export const formatDay = (v: string) => format(parseISO(v), 'MM/dd');
export const formatDayAndTime = (v: string) =>
  format(parseISO(v), 'MM/dd HH:mm');

export const getCubeQueryView = ({
  resultSet,
  error,
  isLoading,
}: UseCubeQueryResult<unknown>):
  | [NonNullable<UseCubeQueryResult<unknown>['resultSet']>, null]
  | [null, JSX.Element] => {
  if (isLoading) {
    return [null, <Loading />];
  }

  if (error) {
    return [null, <ErrorAlert value={error} title="Request Error" />];
  }

  // skip the cube flash
  if (!resultSet) {
    return [null, <Loading />];
  }

  return [resultSet, null];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const roundPrice = (v: string | number) => {
  const vv = typeof v === 'string' ? parseFloat(v) : v;

  return Math.round(vv * 100) / 100;
};

const M = 10 ** 6;
const K = 10 ** 3;

export const formatUSD = (val: any) => {
  const amount = parseFloat(val);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatISTRaw = (val: any) => {
  const amount = parseFloat(val);

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(amount);
};

const LONG_DASH = '—';

export const makeCoinFormatter = (formatFn: any) => (v: any) => {
  if (!v && v !== 0) {
    return LONG_DASH;
  }

  if (v >= M) {
    return `${formatFn(roundPrice(v / M))}M`;
  }

  if (v >= K) {
    return `${formatFn(roundPrice(v / K))}K`;
  }

  return `${formatFn(roundPrice(v))}`;
};

export const formatPrice = makeCoinFormatter(formatUSD);
export const formatIST = makeCoinFormatter(formatISTRaw);

export const formatPercent = (v: any) => `${roundPrice(v * 100)}%`;

export const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );

export const formatSecondsToHumanReadable = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  const days = Math.floor(seconds / 86400);
  return `${days} day${days !== 1 ? 's' : ''}`;
};
