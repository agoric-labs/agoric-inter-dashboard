import axios, { AxiosResponse } from 'axios';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseISO, format } from 'date-fns';
import { UseCubeQueryResult } from '@cubejs-client/react';
import { ErrorAlert } from '@/components/ErrorAlert';
import { Loading } from '@/components/Loading';
import { SUBQUERY_URL } from './constants';

export const formatDay = (v: string) => format(parseISO(v), 'MM/dd');
export const formatDayAndTime = (v: string) => format(parseISO(v), 'MM/dd HH:mm');

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
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

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

export const extractFirst = (res: any, key: string) => {
  const { results } = res.resultSet.loadResponse;
  if (results.length === 0 || results[0].data.length === 0) {
    return 0;
  }

  return results[0].data[0][key] as string;
};

export const extractFirstFloat = (res: any, key: string) => parseFloat(extractFirst(res, key) || '0');

export interface RequestOptions {
  url: string;
  method: RequestMethod;
  data?: object;
  params?: object;
}

export const enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
}

export const fetchData = async (options: RequestOptions): Promise<AxiosResponse> => {
  const { url, method, data = {}, params = {} } = options;

  if (!url) {
    throw new Error('Invalid URL');
  }

  const axiosOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: method === RequestMethod.GET ? params : undefined,
    data: method === RequestMethod.POST ? data : undefined,
  };

  try {
    if (method === RequestMethod.GET) {
      return await axios.get(url, axiosOptions);
    } else if (method === RequestMethod.POST) {
      return await axios.post(url, data, axiosOptions);
    } else {
      throw new Error('Unsupported HTTP method');
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    throw error;
  }
};

export const subQueryFetcher = (query: string) => {
  const options = {
    url: SUBQUERY_URL,
    method: RequestMethod.POST,
    data: { query },
  };

  return fetchData(options);
};

export const fetchDataFromUrl = (url: string) => {
  const params: RequestOptions = {
    method: RequestMethod.GET,
    url,
  };
  return fetchData(params);
};

export const getDateKey = (date: Date, daysToSubtract: number = 0) => {
  const dateObject = new Date(date);
  dateObject.setDate(dateObject.getDate() - daysToSubtract);
  const startDateFormatDate = dateObject.toISOString().slice(0, 10);
  const startDateKey = Number(startDateFormatDate.replaceAll('-', ''));
  return {key: startDateKey, formattedDate: startDateFormatDate};
}

export const range = (stop: number) => [...Object(Array(stop)).keys()];

type GraphData = { key: number; x: string; [key: string]: any };
type FormattedGraphData = {
  x: string;
  key: number;
  active?: any
};

const fillMissingDays = (startDate: Date, endDate: Date, formattedData: FormattedGraphData[]): void => {
  const timeDifferenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const daysDifference = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

  if (daysDifference > 1) {
    for (let day = 1; day < daysDifference; day++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + day);
      const formattedDate = newDate.toISOString().slice(0, 10).replace(/-/g, '');
      const dateKey = Number(formattedDate);
      formattedData.push({ x: formattedDate, key: dateKey });
    }
  }
};
export const populateMissingDays = (graphDataMap: Record<string, GraphData>, GRAPH_DAYS: number): FormattedGraphData[] => {
  const sortedGraphDataList = Object.values(graphDataMap).sort((a, b) => a.key - b.key);

  const formattedData: FormattedGraphData[] = [];
  let prevDate: Date | null = null;

  for (const currentData of sortedGraphDataList) {
    const currentDate = new Date(currentData.x);

    prevDate && fillMissingDays(prevDate, currentDate, formattedData);
    formattedData.push(currentData);

    prevDate = currentDate;
  }

  return formattedData.slice(-GRAPH_DAYS);
};