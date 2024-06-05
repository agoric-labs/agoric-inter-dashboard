import {
  constructGraph,
  generateGraphDataForDateRange,
  updateGraphDataForToken,
} from '@/components/ReserveHistoryGraph';
import { GRAPH_DAYS } from '@/constants';
import { tokenNames, dailyMetricsResponse, boardAuxes } from './mocks';
import { ReserveAllocationMetricsDailyNode } from '@/types/reserve-types';

describe('Tests for constructing graph', () => {
  // Tests for constructGraph
  it('should return a list of graph data with length equal to GRAPH_DAYS when given valid tokenNames and dailyMetricsResponse', () => {
    const result = constructGraph(tokenNames, dailyMetricsResponse, boardAuxes);
    expect(result).toHaveLength(GRAPH_DAYS);
  });

  it('should return an empty list when given empty tokenNames and dailyMetricsResponse', () => {
    const dailyMetricsResponse = {};
    const result = constructGraph([], dailyMetricsResponse, boardAuxes);
    expect(result).toHaveLength(0);
  });

  it('should return an empty list when given tokenNames, dailyMetricsResponse and boardAuxes object is null or undefined', () => {
    let result = constructGraph(null as any, null, null as any);
    expect(result).toHaveLength(0);

    result = constructGraph(undefined as any, undefined, undefined as any);
    expect(result).toHaveLength(0);
  });

  // Tests for generateGraphDataForDateRange
  it('should return an empty object if dayRange is an empty array', () => {
    const result = generateGraphDataForDateRange([]);
    const expected = {};
    expect(result).toEqual(expected);
  });

  it('should return an empty object if dayRange is null or undefined', () => {
    let result = generateGraphDataForDateRange(null as any);
    expect(result).toEqual({});

    result = generateGraphDataForDateRange(undefined as any);
    expect(result).toEqual({});
  });

  // Tests for updateGraphDataForToken
  it('should update the graph data for a token when given valid inputs', () => {
    const tokenName = 'ATOM';
    const graphData = {
      '20220101': { key: 1, x: '2022-01-01', ATOM: 0 },
      '20220102': { key: 2, x: '2022-01-02', ATOM: 0 },
    };

    let lastTokenMetric: ReserveAllocationMetricsDailyNode = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];

    updateGraphDataForToken(tokenName, graphData, dailyMetricsResponse, lastTokenMetric, boardAuxes);

    expect(graphData).toEqual({
      '20220101': { key: 1, x: '2022-01-01', ATOM: 85.9552681344 },
      '20220102': { key: 2, x: '2022-01-02', ATOM: 86.2619022038 },
    });
  });
  it('should update the graph data by using defaults for dailyOracles and dailyMetrics', () => {
    const tokenName = 'ATOM';
    const graphData = {
      '20220103': { key: 3, x: '2022-01-03', ATOM: 0 },
    };

    let lastTokenMetric: ReserveAllocationMetricsDailyNode = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];

    updateGraphDataForToken(tokenName, graphData, dailyMetricsResponse, lastTokenMetric, boardAuxes);

    expect(graphData).toEqual({
      '20220103': { key: 3, x: '2022-01-03', ATOM: 6.58702 },
    });
  });

  it('should update the graph data by using lastTokenMetric when dailyMetrics undefined', () => {
    const tokenName = 'ATOM';
    const graphData = {
      '20220103': { key: 3, x: '2022-01-03', ATOM: 0 },
    };

    let lastTokenMetric: ReserveAllocationMetricsDailyNode = dailyMetricsResponse?.[`${tokenName}_last`]?.nodes[0];

    updateGraphDataForToken(tokenName, graphData, undefined, lastTokenMetric, boardAuxes);

    expect(graphData).toEqual({
      '20220103': { key: 3, x: '2022-01-03', ATOM: 6.58702 },
    });
  });
});
