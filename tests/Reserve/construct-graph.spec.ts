import { constructGraph, generateGraphDataForDateRange } from '@/components/ReserveHistoryGraph';
import { GRAPH_DAYS } from '@/constants';
import { tokenNames, dailyMetricsResponse } from './mocks';
import { getDateKey } from '@/utils';

describe('Tests for constructing graph', () => {
  it('should return a list of graph data with length equal to GRAPH_DAYS when given valid tokenNames and dailyMetricsResponse', () => {
    const result = constructGraph(tokenNames, dailyMetricsResponse);
    expect(result).toHaveLength(GRAPH_DAYS);
  });

  it('should return an empty list when given empty tokenNames and dailyMetricsResponse', () => {
    const dailyMetricsResponse = {};
    const result = constructGraph([], dailyMetricsResponse);
    expect(result).toHaveLength(0);
  });

  it('should return an empty list when given tokenNames and dailyMetricsResponse are null or undefined', () => {
    let result = constructGraph(null as any, null);
    expect(result).toHaveLength(0);

    result = constructGraph(undefined as any, undefined);
    expect(result).toHaveLength(0);
  });

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
});
