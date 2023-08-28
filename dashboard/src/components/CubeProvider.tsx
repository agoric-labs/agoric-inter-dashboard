import { ReactNode, createContext, useMemo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import cubejs, { TimeDimensionGranularity } from '@cubejs-client/core';
import { CubeProvider as OriginalProvider } from '@cubejs-client/react';

type Props = {
  children: ReactNode;
};

const devToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTI4NDk5MDh9.ZhpE9wNivR17Ie4kyU6z10-YWHAWNpQspoZH4XyZMOI';

// @ts-ignore
const accessToken = import.meta.env.VITE_ACCESS_TOKEN || devToken;

const GranularityContext = createContext<TimeDimensionGranularity>('day');

export const useGranularity = () => useContext<TimeDimensionGranularity>(GranularityContext);

const ranges = ['day', 'week', 'month', 'year'];

export function CubeProvider({ children }: Props) {
  const location = useLocation();

  const sp = new URLSearchParams(location.search);
  const chain = sp.get('chain') || 'mainnet';
  const rangeRaw = sp.get('range') || 'day';
  const range = ranges.includes(rangeRaw) ? rangeRaw : 'day';

  const api = useMemo(() => cubejs(accessToken, { apiUrl: `/cubejs-api/agoric_${chain}/v1` }), [chain]);

  return (
    <OriginalProvider cubejsApi={api}>
      <GranularityContext.Provider value={range as TimeDimensionGranularity}>{children}</GranularityContext.Provider>
    </OriginalProvider>
  );
}
