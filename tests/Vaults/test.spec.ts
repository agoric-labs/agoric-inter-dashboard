import { constructGraph } from '@/components/VaultCharts';
import { tokenNames, dailyMetricsResponse } from './mocks';

describe('Tests for constructing graph', () => {
  it('should return a list of formatted graph data when given valid input', () => {
    const graphData = {};

    const expectedGraphDataList = [
      {
        'stTIA-total_collateral': 1063968.2624854103,
        'stTIA-total_minted': '334322591040',
        key: 20240510,
        x: '2024-05-10',
      },
      {
        'ATOM-total_collateral': 17377.88560920964,
        'ATOM-total_minted': '1716395996',
        key: 20240511,
        'stTIA-total_collateral': 1044051.9574665029,
        'stTIA-total_minted': '330447863054',
        x: '2024-05-11',
      },
      {
        'ATOM-total_collateral': 17459.546306969518,
        'ATOM-total_minted': '1716827380',
        key: 20240512,
        'stTIA-total_collateral': 1055757.6566123222,
        'stTIA-total_minted': '330454604268',
        x: '2024-05-12',
      },
      {
        'ATOM-total_collateral': 17641.925616220367,
        'ATOM-total_minted': '1717224228',
        key: 20240513,
        'stTIA-total_collateral': 1043693.2863557312,
        'stTIA-total_minted': '330990866379',
        x: '2024-05-13',
      },
    ];

    const result = constructGraph(tokenNames, dailyMetricsResponse, graphData);

    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return an empty list when dailyMetricsResponse is undefined or null', () => {
    let dailyMetricsResponse = undefined;
    const graphData = {};

    const expectedGraphDataList: any = [];
    let result = constructGraph(tokenNames, dailyMetricsResponse as unknown as any, graphData);
    expect(result).toEqual(expectedGraphDataList);

    dailyMetricsResponse = null;
    result = constructGraph(tokenNames, dailyMetricsResponse as unknown as any, graphData);
    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return an empty list when tokenNames is undefined or null', () => {
    const graphData = {};
    let tokenNames = undefined;

    const expectedGraphDataList: any = [];
    let result = constructGraph(tokenNames as unknown as any, dailyMetricsResponse, graphData);
    expect(result).toEqual(expectedGraphDataList);

    tokenNames = null;
    result = constructGraph(tokenNames as unknown as any, dailyMetricsResponse, graphData);
    expect(result).toEqual(expectedGraphDataList);
  });
});
