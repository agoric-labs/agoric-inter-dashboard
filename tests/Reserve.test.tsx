import React from 'react';
import useSWR from 'swr';
import { render } from '@testing-library/react';
import { Reserve } from '@/pages/Reserve';
import { RESERVE_DASHBOARD_QUERY, RESERVE_GRAPH_TOKENS_QUERY } from '@/queries';
import {
  graphDataMock,
  dashboardDataMock,
  graphNodesDataMock,
  moduleAccountsMock,
  reserveBalanceMock,
} from './__mocks__/Reserve';
import { GET_ACCOUNT_BALANCE_URL, GET_MODULE_ACCOUNTS_URL } from '@/constants';

jest.mock('swr', () => ({
  default: jest.fn(),
}));


global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
jest.useFakeTimers().setSystemTime(new Date('2024-06-07'));

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
      const reserveAddress =
        moduleAccountsMock.data.accounts.find((account) => account.name === 'vbank/reserve')?.base_account.address ||
        '';
      const mockData =
        {
          [RESERVE_DASHBOARD_QUERY]: dashboardDataMock,
          [RESERVE_GRAPH_TOKENS_QUERY]: graphNodesDataMock,
          [GET_MODULE_ACCOUNTS_URL]: moduleAccountsMock,
          [GET_ACCOUNT_BALANCE_URL(reserveAddress)]: reserveBalanceMock,
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
