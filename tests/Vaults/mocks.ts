import { DailyOracles } from '@/types/common';
import { BoardAuxesMap, VaultDailyMetricsQueryResponse } from '@/types/vault-types';
export const tokenNames: string[] = ['ATOM', 'stTIA', 'stkATOM', 'stOSMO', 'stATOM'];
export const dailyMetricsResponse: VaultDailyMetricsQueryResponse = {
  ATOM: {
    nodes: [
      {
        id: 'published.vaultFactory.managers.manager0.metrics:20240513',
        dateKey: 20240513,
        liquidatingCollateralBrand: 'ATOM',
        blockTimeLast: '2024-05-13T00:30:05.84',
        totalCollateralLast: '2068772568',
        metricsCount: '18',
        totalDebtLast: '1717224228',
      },
      {
        id: 'published.vaultFactory.managers.manager0.metrics:20240512',
        dateKey: 20240512,
        liquidatingCollateralBrand: 'ATOM',
        blockTimeLast: '2024-05-12T00:30:01.276',
        totalCollateralLast: '2056752568',
        metricsCount: '26',
        totalDebtLast: '1716827380',
      },
      {
        id: 'published.vaultFactory.managers.manager0.metrics:20240511',
        dateKey: 20240511,
        liquidatingCollateralBrand: 'ATOM',
        blockTimeLast: '2024-05-11T00:30:04.776',
        totalCollateralLast: '2044732568',
        metricsCount: '24',
        totalDebtLast: '1716395996',
      },
    ],
  },
  ATOM_oracle: {
    nodes: [
      {
        id: 'ATOM-USD:20240513',
        dateKey: 20240513,
        blockTimeLast: '2024-05-13T00:09:42',
        typeInName: 'ATOM',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 8527726,
      },
      {
        id: 'ATOM-USD:20240512',
        dateKey: 20240512,
        blockTimeLast: '2024-05-12T00:04:13',
        typeInName: 'ATOM',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 8488890,
      },
      {
        id: 'ATOM-USD:20240511',
        dateKey: 20240511,
        blockTimeLast: '2024-05-11T00:08:40',
        typeInName: 'ATOM',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 8498855,
      },
    ],
  },
  stTIA: {
    nodes: [
      {
        id: 'published.vaultFactory.managers.manager3.metrics:20240513',
        dateKey: 20240513,
        liquidatingCollateralBrand: 'stTIA',
        blockTimeLast: '2024-05-13T00:30:05.84',
        totalCollateralLast: '112320327361',
        metricsCount: '17',
        totalDebtLast: '330990866379',
      },
      {
        id: 'published.vaultFactory.managers.manager3.metrics:20240512',
        dateKey: 20240512,
        liquidatingCollateralBrand: 'stTIA',
        blockTimeLast: '2024-05-12T00:30:01.276',
        totalCollateralLast: '112152560009',
        metricsCount: '24',
        totalDebtLast: '330454604268',
      },
      {
        id: 'published.vaultFactory.managers.manager3.metrics:20240511',
        dateKey: 20240511,
        liquidatingCollateralBrand: 'stTIA',
        blockTimeLast: '2024-05-11T00:30:04.776',
        totalCollateralLast: '112152560009',
        metricsCount: '38',
        totalDebtLast: '330447863054',
      },
      {
        id: 'published.vaultFactory.managers.manager3.metrics:20240510',
        dateKey: 20240510,
        liquidatingCollateralBrand: 'stTIA',
        blockTimeLast: '2024-05-10T00:30:08.856',
        totalCollateralLast: '113147464202',
        metricsCount: '32',
        totalDebtLast: '334322591040',
      },
    ],
  },
  stTIA_oracle: {
    nodes: [
      {
        id: 'stTIA-USD:20240513',
        dateKey: 20240513,
        blockTimeLast: '2024-05-13T00:08:41',
        typeInName: 'stTIA',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 9292114,
      },
      {
        id: 'stTIA-USD:20240512',
        dateKey: 20240512,
        blockTimeLast: '2024-05-12T00:07:31',
        typeInName: 'stTIA',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 9413585,
      },
      {
        id: 'stTIA-USD:20240511',
        dateKey: 20240511,
        blockTimeLast: '2024-05-11T00:00:36',
        typeInName: 'stTIA',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 9309212,
      },
      {
        id: 'stTIA-USD:20240510',
        dateKey: 20240510,
        blockTimeLast: '2024-05-10T00:00:00',
        typeInName: 'stTIA',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 9403377,
      },
      {
        id: 'stTIA-USD:20240509',
        dateKey: 20240509,
        blockTimeLast: '2024-05-09T00:00:13',
        typeInName: 'stTIA',
        typeInAmountLast: 1000000,
        typeOutAmountLast: 9909781,
      },
    ],
  },
};

export const dailyMetricsResponseNodes = [
  {
    id: 'published.vaultFactory.managers.manager0.metrics:20240306',
    dateKey: 20220101,
    liquidatingCollateralBrand: 'ATOM',
    blockTimeLast: '2022-01-01T00:30:12.551',
    totalCollateralLast: '2069253102',
    metricsCount: '24',
    totalDebtLast: '1847260002',
  },
  {
    id: 'published.vaultFactory.managers.manager0.metrics:20240305',
    dateKey: 20240305,
    liquidatingCollateralBrand: 'ATOM',
    blockTimeLast: '2024-03-05T00:30:00.025',
    totalCollateralLast: '2069253102',
    metricsCount: '25',
    totalDebtLast: '1847222298',
  },
];

export const oracleDailies: DailyOracles = {
  '20220101': {
    id: 'ATOM-USD:20220101',
    dateKey: '20220101',
    blockTimeLast: '2022-01-01T00:00:58',
    typeInName: 'ATOM',
    typeInAmountLast: '1000000',
    typeOutAmountLast: '10334934',
  },
  '20240305': {
    id: 'ATOM-USD:20240305',
    dateKey: '20240305',
    blockTimeLast: '2024-03-05T00:06:13',
    typeInName: 'ATOM',
    typeInAmountLast: '1000000',
    typeOutAmountLast: '10238759',
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
