import React from 'react';
import useSWR from 'swr';
import { render } from '@testing-library/react';
import { Vaults } from '@/pages/Vaults';
import { VAULTS_DASHBOARD_QUERY } from '@/queries';
import { graphDataMock, dashboardDataMock } from './__mocks__/Vaults';

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
      const mockData =
        {
          [VAULTS_DASHBOARD_QUERY]: dashboardDataMock,
        }[query] || graphDataMock;
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
});