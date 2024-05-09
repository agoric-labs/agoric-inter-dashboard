import useSWR from 'swr';
import { render } from '@testing-library/react';
import { InterProtocol } from '@/pages/InterProtocol';
import { dashboardDataMock, interchainBalancesMock } from './__mocks__/InterProtocol';
import { INTER_DASHBOARD_QUERY } from '@/queries';
import { GET_INTERCHAIN_BALANCES_URL } from '@/constants';

jest.mock('swr', () => {
  const originalModule = jest.requireActual('@/utils');
  return {
    ...originalModule,
    default: jest.fn(),
  };
});

describe('InterProtocol Snapshot tests', () => {
  it('should match snapshot when data is loaded', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const mockData = {
        [INTER_DASHBOARD_QUERY]: dashboardDataMock,
        [GET_INTERCHAIN_BALANCES_URL]: interchainBalancesMock,
      }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<InterProtocol />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', async () => {
    (useSWR as any).mockImplementation(() => ({ data: undefined, error: null, isLoading: true }));

    const { container } = render(<InterProtocol />);
    expect(container).toMatchSnapshot();
  });
});
