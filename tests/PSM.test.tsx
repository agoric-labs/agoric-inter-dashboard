import React from 'react';
import useSWR from 'swr';
import { render } from '@testing-library/react';
import { PSM } from '@/pages/PSM';
import { PSM_DASHBOARD_QUERY, PSM_GRAPH_TOKENS_QUERY } from '@/queries';
import { graphDataMock, dashboardDataMock, graphNodesDataMock } from './__mocks__/PSM';

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

describe('PSM Dashboard Snapshot tests', () => {
  it('should match snapshot when data is loaded', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const mockData =
        {
          [PSM_DASHBOARD_QUERY]: dashboardDataMock,
          [PSM_GRAPH_TOKENS_QUERY]: graphNodesDataMock,
        }[query] || graphDataMock;
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<PSM />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', async () => {
    (useSWR as any).mockImplementation(() => ({ data: undefined, error: null, isLoading: true }));

    const { container } = render(<PSM />);
    expect(container).toMatchSnapshot();
  });
});
