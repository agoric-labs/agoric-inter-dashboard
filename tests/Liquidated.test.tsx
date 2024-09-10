import React from 'react';
import useSWR from 'swr';
import { render } from '@testing-library/react';
import { Liquidated } from '@/pages/Liquidated';
import {
  LIQUIDATED_VAULTS_NEXT_PAGES_QUERY,
  LIQUIDATIONS_DASHBOARD,
  VAULT_STATE_DAILIES_QUERY,
} from '@/queries';
import { graphDataMock, dashboardDataMock, nextPagesMock, liquidatedVaults100Mock } from './__mocks__/Liquidated';

jest.mock('swr', () => ({
  default: jest.fn(),
}));

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

describe('Liquidation Dashboard Snapshot tests', () => {
  it('should match snapshot when data is loaded', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const pageCount = Math.ceil(dashboardDataMock.data.data.vaultLiquidations.totalCount / 100) - 1;
      const mockData =
        {
          [LIQUIDATIONS_DASHBOARD]: dashboardDataMock,
          [LIQUIDATED_VAULTS_NEXT_PAGES_QUERY(pageCount)]: nextPagesMock,
          [VAULT_STATE_DAILIES_QUERY]: graphDataMock,
        }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Liquidated />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', async () => {
    (useSWR as any).mockImplementation(() => ({ data: undefined, error: null, isLoading: true }));

    const { container } = render(<Liquidated />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when liquidatedVaults are less than 100', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const modifiedDashboardDataMock: typeof dashboardDataMock = JSON.parse(JSON.stringify(dashboardDataMock));
      modifiedDashboardDataMock.data.data.vaultLiquidations.nodes = modifiedDashboardDataMock.data.data.vaultLiquidations.nodes.slice(0, 99);
      expect(modifiedDashboardDataMock.data.data.vaultLiquidations.nodes.length).toBeLessThanOrEqual(100);

      const pageCount = Math.ceil(modifiedDashboardDataMock.data.data.vaultLiquidations.totalCount / 100) - 1;
      expect(pageCount).toBe(0);
      const mockData =
        {
          [LIQUIDATIONS_DASHBOARD]: dashboardDataMock,
          [LIQUIDATED_VAULTS_NEXT_PAGES_QUERY(pageCount)]: nextPagesMock,
          [VAULT_STATE_DAILIES_QUERY]: graphDataMock,
        }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Liquidated />);
    expect(container).toMatchSnapshot();
  });
  it('should match snapshot when liquidatedVaults are greater than 100', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const modifiedDashboardDataMock: typeof dashboardDataMock = JSON.parse(JSON.stringify(dashboardDataMock));
      modifiedDashboardDataMock.data.data.vaultLiquidations = liquidatedVaults100Mock;
      expect(modifiedDashboardDataMock.data.data.vaultLiquidations.nodes.length).toEqual(100);

      const pageCount = Math.ceil(modifiedDashboardDataMock.data.data.vaultLiquidations.totalCount / 100) - 1;
      expect(pageCount).toBeGreaterThan(0);
      const mockData =
        {
          [LIQUIDATIONS_DASHBOARD]: dashboardDataMock,
          [LIQUIDATED_VAULTS_NEXT_PAGES_QUERY(pageCount)]: nextPagesMock,
          [VAULT_STATE_DAILIES_QUERY]: graphDataMock,
        }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Liquidated />);
    expect(container).toMatchSnapshot();
  });
});
