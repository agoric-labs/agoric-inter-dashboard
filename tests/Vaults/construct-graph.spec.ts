import { constructGraph } from '@/components/VaultCharts';
import { tokenNames, dailyMetricsResponse, boardAuxes } from './mocks';
import * as utils from '@/utils';

describe('Tests for constructing graph', () => {
  it('should return a list of formatted graph data when given valid input', () => {
    const graphData = {};

    const expectedGraphDataList = [
      {
        'stTIA-total_collateral': 1063968.2624854103,
        'stTIA-total_minted': 334322.59104,
        key: 20240510,
        x: '2024-05-10',
      },
      {
        'ATOM-total_collateral': 17377.88560920964,
        'ATOM-total_minted': 1716.395996,
        key: 20240511,
        'stTIA-total_collateral': 1044051.9574665029,
        'stTIA-total_minted': 330447.863054,
        x: '2024-05-11',
      },
      {
        'ATOM-total_collateral': 17459.546306969518,
        'ATOM-total_minted': 1716.82738,
        key: 20240512,
        'stTIA-total_collateral': 1055757.6566123222,
        'stTIA-total_minted': 330454.604268,
        x: '2024-05-12',
      },
      {
        'ATOM-total_collateral': 17641.925616220367,
        'ATOM-total_minted': 1717.224228,
        key: 20240513,
        'stTIA-total_collateral': 1043693.2863557312,
        'stTIA-total_minted': 330990.866379,
        x: '2024-05-13',
      },
    ];

    const result = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes, graphData);

    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return an empty list when dailyMetricsResponse is undefined or null', () => {
    let dailyMetricsResponse = undefined;
    const graphData = {};

    const expectedGraphDataList: any = [];
    let result = constructGraph(tokenNames, dailyMetricsResponse as unknown as any, boardAuxes, graphData);
    expect(result).toEqual(expectedGraphDataList);

    dailyMetricsResponse = null;
    result = constructGraph(tokenNames, dailyMetricsResponse as unknown as any, boardAuxes, graphData);
    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return an empty list when tokenNames is undefined or null', () => {
    const graphData = {};
    let tokenNames = undefined;

    const expectedGraphDataList: any = [];
    let result = constructGraph(tokenNames as unknown as any, dailyMetricsResponse, boardAuxes, graphData);
    expect(result).toEqual(expectedGraphDataList);

    tokenNames = null;
    result = constructGraph(tokenNames as unknown as any, dailyMetricsResponse, boardAuxes, graphData);
    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return a list of formatted graph data when given valid input and extractDailyOracles returns an empty object', () => {
    const graphData = {};

    const expectedGraphDataList = [
      {
        'stTIA-total_collateral': 113147.464202,
        'stTIA-total_minted': 334322.59104,
        key: 20240510,
        x: '2024-05-10',
      },
      {
        'ATOM-total_collateral': 2044.732568,
        'ATOM-total_minted': 1716.395996,
        key: 20240511,
        'stTIA-total_collateral': 112152.560009,
        'stTIA-total_minted': 330447.863054,
        x: '2024-05-11',
      },
      {
        'ATOM-total_collateral': 2056.752568,
        'ATOM-total_minted': 1716.82738,
        key: 20240512,
        'stTIA-total_collateral': 112152.560009,
        'stTIA-total_minted': 330454.604268,
        x: '2024-05-12',
      },
      {
        'ATOM-total_collateral': 2068.772568,
        'ATOM-total_minted': 1717.224228,
        key: 20240513,
        'stTIA-total_collateral': 112320.327361,
        'stTIA-total_minted': 330990.866379,
        x: '2024-05-13',
      },
    ];

    jest.spyOn(utils, 'extractDailyOracles').mockReturnValue({});
    const result = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes, graphData);

    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return formatted graph data when given valid input and boardAuxes is an empty object', () => {
    const graphData = {};

    const expectedGraphDataList = [
      {
        'stTIA-total_collateral': 113147.464202,
        'stTIA-total_minted': 334322.59104,
        key: 20240510,
        x: '2024-05-10',
      },
      {
        'ATOM-total_collateral': 2044.732568,
        'ATOM-total_minted': 1716.395996,
        key: 20240511,
        'stTIA-total_collateral': 112152.560009,
        'stTIA-total_minted': 330447.863054,
        x: '2024-05-11',
      },
      {
        'ATOM-total_collateral': 2056.752568,
        'ATOM-total_minted': 1716.82738,
        key: 20240512,
        'stTIA-total_collateral': 112152.560009,
        'stTIA-total_minted': 330454.604268,
        x: '2024-05-12',
      },
      {
        'ATOM-total_collateral': 2068.772568,
        'ATOM-total_minted': 1717.224228,
        key: 20240513,
        'stTIA-total_collateral': 112320.327361,
        'stTIA-total_minted': 330990.866379,
        x: '2024-05-13',
      },
    ];

    jest.spyOn(utils, 'extractDailyOracles').mockReturnValue({});
    const result = constructGraph(tokenNames, dailyMetricsResponse, {}, graphData);

    expect(result).toEqual(expectedGraphDataList);
  });

  it('should return a list of formatted graph data when given valid input and extractDailyOracles returns an null or undefined object', () => {
    const graphData = {};

    const expectedGraphDataList = [
      {
        'stTIA-total_collateral': 113147.464202,
        'stTIA-total_minted': 334322.59104,
        key: 20240510,
        x: '2024-05-10',
      },
      {
        'ATOM-total_collateral': 2044.732568,
        'ATOM-total_minted': 1716.395996,
        key: 20240511,
        'stTIA-total_collateral': 112152.560009,
        'stTIA-total_minted': 330447.863054,
        x: '2024-05-11',
      },
      {
        'ATOM-total_collateral': 2056.752568,
        'ATOM-total_minted': 1716.82738,
        key: 20240512,
        'stTIA-total_collateral': 112152.560009,
        'stTIA-total_minted': 330454.604268,
        x: '2024-05-12',
      },
      {
        'ATOM-total_collateral': 2068.772568,
        'ATOM-total_minted': 1717.224228,
        key: 20240513,
        'stTIA-total_collateral': 112320.327361,
        'stTIA-total_minted': 330990.866379,
        x: '2024-05-13',
      },
    ];

    jest.spyOn(utils, 'extractDailyOracles').mockReturnValue(null as unknown as any);
    let result = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes, graphData);
    expect(result).toEqual(expectedGraphDataList);

    jest.spyOn(utils, 'extractDailyOracles').mockReturnValue(undefined as unknown as any);
    result = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes, graphData);
    expect(result).toEqual(expectedGraphDataList);
  });
});
