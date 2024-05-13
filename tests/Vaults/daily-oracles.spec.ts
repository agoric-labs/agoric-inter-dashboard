import { dailyMetricsResponse } from './mocks';
import { extractDailyOracles } from '@/utils';

describe('Tests for Daily Oracles', () => {
  it('should return an empty object when dailyMetricsResponse is undefined or null', () => {
    const tokenName = 'ATOM';
    let dailyMetricsResponse = undefined;

    let result = extractDailyOracles(tokenName, dailyMetricsResponse);
    expect(result).toEqual({});
    dailyMetricsResponse = null;
    result = extractDailyOracles(tokenName, dailyMetricsResponse);
    expect(result).toEqual({});
  });

  it('should return an empty object when dailyMetricsResponse has empty nodes array', () => {
    const tokenName = 'ATOM';
    const dailyMetricsResponse = {
      ATOM_oracle: {
        nodes: [],
      },
    };

    const result = extractDailyOracles(tokenName, dailyMetricsResponse);

    expect(result).toEqual({});
  });

  it('should return a DailyOracles object with the correct dateKey and data when dailyMetricsResponse has valid data', () => {
    const tokenName = 'ATOM';
    const result = extractDailyOracles(tokenName, dailyMetricsResponse);

    expect(result).toEqual({
      '20240511': {
        blockTimeLast: '2024-05-11T00:08:40',
        dateKey: 20240511,
        id: 'ATOM-USD:20240511',
        typeInAmountLast: 1000000,
        typeInName: 'ATOM',
        typeOutAmountLast: 8498855,
      },
      '20240512': {
        blockTimeLast: '2024-05-12T00:04:13',
        dateKey: 20240512,
        id: 'ATOM-USD:20240512',
        typeInAmountLast: 1000000,
        typeInName: 'ATOM',
        typeOutAmountLast: 8488890,
      },
      '20240513': {
        blockTimeLast: '2024-05-13T00:09:42',
        dateKey: 20240513,
        id: 'ATOM-USD:20240513',
        typeInAmountLast: 1000000,
        typeInName: 'ATOM',
        typeOutAmountLast: 8527726,
      },
    });
  });
});
