import React from 'react';
import useSWR from 'swr';
import { render } from '@testing-library/react';
import { Reserve } from '@/pages/Reserve';
import { RESERVE_DASHBOARD_QUERY, RESERVE_GRAPH_TOKENS_QUERY } from '@/queries';
import { graphDataMock, dashboardDataMock, graphNodesDataMock } from './__mocks__/Reserve';

jest.mock('swr', () => {
  const originalModule = jest.requireActual('@/utils');
  return {
    ...originalModule,
    default: jest.fn(),
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: typeof React.Children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});
describe('Reserve Dashboard Snapshot tests', () => {
  it('should match snapshot when data is loaded', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const mockData =
        {
          [RESERVE_DASHBOARD_QUERY]: dashboardDataMock,
          [RESERVE_GRAPH_TOKENS_QUERY]: graphNodesDataMock,
        }[query] || graphDataMock;
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Reserve />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', async () => {
    (useSWR as any).mockImplementation(() => ({ data: undefined, error: null, isLoading: true }));

    const { container } = render(<Reserve />);
    expect(container).toMatchSnapshot();
  });
});
