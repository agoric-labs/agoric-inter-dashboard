export type GraphData = { key: number; x: string; [key: string]: any };
export type FormattedGraphData = {
  x: string;
  key: number;
  active?: any;
  liquidated?: any;
};

export type DailyOracles = {
  [key: string]: {
    dateKey: string;
    id: string;
    blockTimeLast: string;
    typeInName: string;
    typeInAmountLast: string;
    typeOutAmountLast: string;
  };
};
