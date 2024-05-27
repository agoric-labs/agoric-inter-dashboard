import React from 'react';
import useSWR from 'swr';
import { render } from '@testing-library/react';
import { Vaults } from '@/pages/Vaults';
import { OPEN_VAULTS_NEXT_PAGES_QUERY, VAULTS_DAILY_METRICS_QUERY, VAULTS_DASHBOARD_QUERY } from '@/queries';
import { graphDataMock, dashboardDataMock, vaults100Mock, nextPagesMock } from './__mocks__/Vaults';

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

describe('Vaults Dashboard Snapshot tests', () => {
  it('should match snapshot when data is loaded', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const tokenNames = dashboardDataMock.data.data.vaultManagerMetrics.nodes.map(
        (node) => node.liquidatingCollateralBrand,
      );
      const pageCount = Math.ceil(dashboardDataMock.data.data.vaults.totalCount / 100) - 1;
      const mockData = {
        [VAULTS_DASHBOARD_QUERY]: dashboardDataMock,
        [OPEN_VAULTS_NEXT_PAGES_QUERY(pageCount)]: null,
        [VAULTS_DAILY_METRICS_QUERY(tokenNames)]: graphDataMock,
      }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Vaults />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', async () => {
    (useSWR as any).mockImplementation(() => ({ data: undefined, error: null, isLoading: true }));

    const { container } = render(<Vaults />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when openVaults are less than 100', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const modifiedDashboardDataMock: typeof dashboardDataMock = JSON.parse(JSON.stringify(dashboardDataMock));
      modifiedDashboardDataMock.data.data.vaults.nodes = modifiedDashboardDataMock.data.data.vaults.nodes.slice(0, 99);
      expect(modifiedDashboardDataMock.data.data.vaults.nodes.length).toBeLessThanOrEqual(100);

      const tokenNames = modifiedDashboardDataMock.data.data.vaultManagerMetrics.nodes.map(
        (node) => node.liquidatingCollateralBrand,
      );
      const pageCount = Math.ceil(modifiedDashboardDataMock.data.data.vaults.totalCount / 100) - 1;
      expect(pageCount).toBe(0);
      const mockData = {
        [VAULTS_DASHBOARD_QUERY]: modifiedDashboardDataMock,
        [OPEN_VAULTS_NEXT_PAGES_QUERY(pageCount)]: null,
        [VAULTS_DAILY_METRICS_QUERY(tokenNames)]: graphDataMock,
      }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Vaults />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when openVaults are less greater than 100', async () => {
    (useSWR as any).mockImplementation((query: string) => {
      const modifiedDashboardDataMock: typeof dashboardDataMock = JSON.parse(JSON.stringify(dashboardDataMock));
      modifiedDashboardDataMock.data.data.vaults = vaults100Mock;
      expect(modifiedDashboardDataMock.data.data.vaults.nodes.length).toEqual(100);

      const tokenNames = modifiedDashboardDataMock.data.data.vaultManagerMetrics.nodes.map(
        (node) => node.liquidatingCollateralBrand,
      );
      const pageCount = Math.ceil(modifiedDashboardDataMock.data.data.vaults.totalCount / 100) - 1;
      expect(pageCount).toBeGreaterThan(0);
      const mockData = {
        [VAULTS_DASHBOARD_QUERY]: modifiedDashboardDataMock,
        [OPEN_VAULTS_NEXT_PAGES_QUERY(pageCount)]: nextPagesMock,
        [VAULTS_DAILY_METRICS_QUERY(tokenNames)]: graphDataMock,
      }[query];
      return { data: mockData, error: null, isLoading: false };
    });

    const { container } = render(<Vaults />);
    expect(container).toMatchSnapshot();
  });
});
