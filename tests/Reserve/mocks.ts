import { BoardAuxesMap } from '@/types/vault-types';

export const tokenNames: string[] = ['ATOM', 'stTIA', 'stkATOM', 'stOSMO', 'stATOM'];
export const dailyMetricsResponse = {
  ATOM: {
    nodes: [
      {
        id: 'ATOM:20220101',
        blockTimeLast: '2022-01-01T08:06:51',
        dateKey: 20220101,
        valueLast: '10265620',
        denom: 'ATOM',
      },
      {
        id: 'ATOM:20220102',
        blockTimeLast: '2022-01-02T13:06:50',
        dateKey: 20220102,
        valueLast: '10265620',
        denom: 'ATOM',
      },
    ],
  },
  ATOM_oracle: {
    nodes: [
      {
        dateKey: 20220101,
        blockTimeLast: '2022-01-01T00:00:27',
        typeInName: 'ATOM',
        typeInAmountLast: '1000000',
        typeOutAmountLast: '8373120',
      },
      {
        dateKey: 20220102,
        blockTimeLast: '2022-01-02T00:09:42',
        typeInName: 'ATOM',
        typeInAmountLast: '1000000',
        typeOutAmountLast: '8402990',
      },
    ],
  },
  ATOM_last: {
    nodes: [
      {
        id: 'ATOM:20240213',
        blockTimeLast: '2024-02-13T14:06:55',
        dateKey: 20240213,
        valueLast: '6587020',
        denom: 'ATOM',
      },
    ],
  },
  IST: {
    nodes: [
      {
        id: 'IST:20240513',
        blockTimeLast: '2024-05-13T08:06:51',
        dateKey: 20240513,
        valueLast: '68176486663',
        denom: 'IST',
      },
      {
        id: 'IST:20240512',
        blockTimeLast: '2024-05-12T13:06:50',
        dateKey: 20240512,
        valueLast: '68142083951',
        denom: 'IST',
      },
    ],
  },
  IST_oracle: {
    nodes: [],
  },
  IST_last: {
    nodes: [
      {
        id: 'IST:20240213',
        blockTimeLast: '2024-02-13T14:06:55',
        dateKey: 20240213,
        valueLast: '57445941663',
        denom: 'IST',
      },
    ],
  },
};

export const boardAuxes: BoardAuxesMap = {
  ATOM: 6,
  BLD: 6,
  DAI_axl: 18,
  DAI_grv: 18,
  IST: 6,
  KREAdCHARACTER: 0,
  KREAdITEM: 0,
  USDC_axl: 6,
  USDC_grv: 6,
  USDT_axl: 6,
  USDT_grv: 6,
  'Zoe Invitation': 0,
};
