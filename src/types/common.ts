export type GraphData = { key: number; x: string; [key: string]: any };
export type FormattedGraphData = {
  x: string;
  key: number;
  active?: any;
};

export type DailyMetricsResponse = {
  [key: string]: {
    nodes?: { dateKey: number; [key: string]: any }[] | null;
  };
};

export type DailyOracles = {
  [key: string]: { [date: string]: { dateKey: string; [key: string]: any } };
};

export type TokenDailyOracles = { [date: string]: { dateKey: string; [key: string]: any } };
