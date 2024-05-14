import { constructGraph } from '@/components/ReserveHistoryGraph';
import { GRAPH_DAYS } from '@/constants';
import { tokenNames, dailyMetricsResponse } from './mocks';
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
});
