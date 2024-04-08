import useSWR from 'swr';
import { render } from '@testing-library/react';
import { InterProtocol } from '@/pages/InterProtocol';
import { data as mockData } from './__mocks__/InterProtocol';

jest.mock('swr', () => {
  const originalModule = jest.requireActual('@/utils');
  return {
    ...originalModule,
    default: jest.fn(),
  };
});

describe('InterProtocol Snapshot tests', () => {
  it('should match snapshot when data is loaded', async () => {
    (useSWR as any).mockImplementation(() => ({ data: mockData, error: null, isLoading: false }));

    const { container } = render(<InterProtocol />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', async () => {
    (useSWR as any).mockImplementation(() => ({ data: undefined, error: null, isLoading: true }));

    const { container } = render(<InterProtocol />);
    expect(container).toMatchSnapshot();
  });
});
