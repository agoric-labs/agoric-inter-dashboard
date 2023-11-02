import { ReactNode, createContext, useMemo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import cubejs, { TimeDimensionGranularity } from '@cubejs-client/core';
import { CubeProvider as OriginalProvider } from '@cubejs-client/react';
import WebSocketTransport from '@cubejs-client/ws-transport';

type Props = {
  children: ReactNode;
};

const devWsUrl = `ws://localhost:4000/cubejs-api/agoric_mainnet/v1/load/websocket`;

const devToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTI4NDk5MDh9.ZhpE9wNivR17Ie4kyU6z10-YWHAWNpQspoZH4XyZMOI';

// @ts-ignore
const accessToken = import.meta.env.VITE_ACCESS_TOKEN || devToken;

const GranularityContext = createContext<TimeDimensionGranularity>('day');

export const useGranularity = () => useContext<TimeDimensionGranularity>(GranularityContext);

const ranges = ['day', 'week', 'month', 'year'];

let wsBaseUrl = '';

if (window.location.protocol === 'https:') {
  wsBaseUrl += 'wss://';
} else if (window.location.protocol === 'http:') {
  wsBaseUrl += 'ws://';
}

wsBaseUrl += window.location.host;

export function CubeProvider({ children }: Props) {
  const location = useLocation();

  const sp = new URLSearchParams(location.search);
  const chain = sp.get('chain') || 'mainnet';
  const rangeRaw = sp.get('range') || 'day';
  const range = ranges.includes(rangeRaw) ? rangeRaw : 'day';

  const api = useMemo(() => {
    const apiUrl = `/cubejs-api/agoric_${chain}/v1`;
    // @ts-ignore
    const wsUrl = import.meta.env.MODE === 'development' ? devWsUrl : `${wsBaseUrl}${apiUrl}/v1/load/websocket`;

    return cubejs(accessToken, {
      apiUrl,
      transport: new WebSocketTransport({
        authorization: accessToken,
        apiUrl: wsUrl,
      }),
    });
  }, [chain]);

  return (
    <OriginalProvider cubejsApi={api}>
      <GranularityContext.Provider value={range as TimeDimensionGranularity}>{children}</GranularityContext.Provider>
    </OriginalProvider>
  );
}
