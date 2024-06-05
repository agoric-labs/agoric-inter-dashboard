import { populateGraphData } from '@/components/VaultCharts';
import { boardAuxes, dailyMetricsResponseNodes, oracleDailies } from './mocks';

describe('Tests for constructing graph', () => {
  it('should populate graphData object with expected keys and values when dailyOracles and nodes are provided', () => {
    const graphData = {};

    populateGraphData(oracleDailies, dailyMetricsResponseNodes, boardAuxes, graphData);

    expect(graphData).toEqual({
      '20220101': {
        'ATOM-total_collateral': 21385.59423846527,
        'ATOM-total_minted': 1847.260002,
        key: 20220101,
        x: '2022-01-01',
      },
      '20240305': {
        'ATOM-total_collateral': 21186.58382138042,
        'ATOM-total_minted': 1847.222298,
        key: 20240305,
        x: '2024-03-05',
      },
    });
  });

  it('should use fallback for oracleDailies when it is null or undefined', () => {
    let dailyOracles = null;
    let graphData = {};

    populateGraphData(dailyOracles as unknown as any, dailyMetricsResponseNodes, boardAuxes, graphData);
    expect(graphData).toEqual({
      '20220101': {
        'ATOM-total_collateral': 2069.253102,
        'ATOM-total_minted': 1847.260002,
        key: 20220101,
        x: '2022-01-01',
      },
      '20240305': {
        'ATOM-total_collateral': 2069.253102,
        'ATOM-total_minted': 1847.222298,
        key: 20240305,
        x: '2024-03-05',
      },
    });

    dailyOracles = undefined;
    graphData = {};

    populateGraphData(dailyOracles as unknown as any, dailyMetricsResponseNodes, boardAuxes, graphData);
    expect(graphData).toEqual({
      '20220101': {
        'ATOM-total_collateral': 2069.253102,
        'ATOM-total_minted': 1847.260002,
        key: 20220101,
        x: '2022-01-01',
      },
      '20240305': {
        'ATOM-total_collateral': 2069.253102,
        'ATOM-total_minted': 1847.222298,
        key: 20240305,
        x: '2024-03-05',
      },
    });
  });

  it('should not add data in graphData if nodes array is undefined or null', () => {
    let graphData = {};

    populateGraphData(oracleDailies, null as unknown as any, boardAuxes, graphData);
    expect(graphData).toEqual({});

    graphData = {};

    populateGraphData(oracleDailies, undefined as unknown as any, boardAuxes, graphData);
    expect(graphData).toEqual({});
  });

  it('should not add data in graphData if nodes array is empty', () => {
    let graphData = {};

    populateGraphData(oracleDailies, [], boardAuxes, graphData);
    expect(graphData).toEqual({});

    graphData = {};
  });
});
