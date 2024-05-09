export const dashboardDataMock = {
  data: {
    data: {
      psmMetrics: {
        nodes: [
          {
            token: 'USDC',
            mintedPoolBalance: '2726778',
            anchorPoolBalance: '2726778',
          },
          {
            token: 'DAI_grv',
            mintedPoolBalance: '4295',
            anchorPoolBalance: '4300252747114492',
          },
          {
            token: 'USDT_axl',
            mintedPoolBalance: '26256741',
            anchorPoolBalance: '26256741',
          },
          {
            token: 'USDT_grv',
            mintedPoolBalance: '73613215',
            anchorPoolBalance: '73613215',
          },
          {
            token: 'USDC_grv',
            mintedPoolBalance: '0',
            anchorPoolBalance: '0',
          },
          {
            token: 'DAI_axl',
            mintedPoolBalance: '32688346767',
            anchorPoolBalance: '28665200952699824182815',
          },
          {
            token: 'USDT',
            mintedPoolBalance: '987777',
            anchorPoolBalance: '987777',
          },
          {
            token: 'USDC_axl',
            mintedPoolBalance: '2382941',
            anchorPoolBalance: '2382941',
          },
        ],
      },
      psmGovernances: {
        nodes: [
          {
            token: 'USDC_axl',
            mintLimit: '1500000000000',
          },
          {
            token: 'USDT_axl',
            mintLimit: '975000000000',
          },
          {
            token: 'USDC',
            mintLimit: '1000000000000',
          },
          {
            token: 'DAI_axl',
            mintLimit: '1100000000000',
          },
          {
            token: 'USDC_grv',
            mintLimit: '1500000000000',
          },
          {
            token: 'USDT_grv',
            mintLimit: '1125000000000',
          },
          {
            token: 'DAI_grv',
            mintLimit: '500000000000',
          },
          {
            token: 'USDT',
            mintLimit: '1000000000000',
          },
        ],
      },
      vaultManagerMetrics: {
        nodes: [
          {
            id: 'published.vaultFactory.managers.manager0.metrics',
            liquidatingCollateralBrand: 'ATOM',
            liquidatingDebtBrand: 'IST',
            totalDebt: '1716290948',
            totalCollateral: '2044732568',
          },
          {
            id: 'published.vaultFactory.managers.manager4.metrics',
            liquidatingCollateralBrand: 'stkATOM',
            liquidatingDebtBrand: 'IST',
            totalDebt: '402232019',
            totalCollateral: '105000000',
          },
          {
            id: 'published.vaultFactory.managers.manager1.metrics',
            liquidatingCollateralBrand: 'stATOM',
            liquidatingDebtBrand: 'IST',
            totalDebt: '785570108561',
            totalCollateral: '192336762635',
          },
          {
            id: 'published.vaultFactory.managers.manager2.metrics',
            liquidatingCollateralBrand: 'stOSMO',
            liquidatingDebtBrand: 'IST',
            totalDebt: '413454649407',
            totalCollateral: '1434282769721',
          },
          {
            id: 'published.vaultFactory.managers.manager3.metrics',
            liquidatingCollateralBrand: 'stTIA',
            liquidatingDebtBrand: 'IST',
            totalDebt: '332362213143',
            totalCollateral: '112659464202',
          },
        ],
      },
      vaultManagerGovernances: {
        nodes: [
          {
            id: 'published.vaultFactory.managers.manager3.governance',
            debtLimit: '4000000000000',
          },
          {
            id: 'published.vaultFactory.managers.manager1.governance',
            debtLimit: '2000000000000',
          },
          {
            id: 'published.vaultFactory.managers.manager2.governance',
            debtLimit: '1000000000000',
          },
          {
            id: 'published.vaultFactory.managers.manager0.governance',
            debtLimit: '500000000000',
          },
          {
            id: 'published.vaultFactory.managers.manager4.governance',
            debtLimit: '500000000000',
          },
        ],
      },
      reserveMetrics: {
        nodes: [
          {
            totalFeeBurned: '0',
            shortfallBalance: '7840189220',
            allocations: {
              nodes: [
                {
                  id: 'published.reserve.metrics:Fee',
                  token: 'IST',
                  value: '68000033671',
                },
                {
                  id: 'published.reserve.metrics:StTIA',
                  token: 'stTIA',
                  value: '1535132952',
                },
                {
                  id: 'published.reserve.metrics:ATOM',
                  token: 'ATOM',
                  value: '10265620',
                },
                {
                  id: 'published.reserve.metrics:StOSMO',
                  token: 'stOSMO',
                  value: '956917604',
                },
                {
                  id: 'published.reserve.metrics:STATOM',
                  token: 'stATOM',
                  value: '1246277706',
                },
              ],
            },
          },
        ],
      },
      wallets: {
        totalCount: 1651,
      },
      oraclePrices: {
        nodes: [
          {
            id: 'published.priceFeed.stOSMO-USD_price_feed',
            typeInName: 'stOSMO',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '1061026',
            priceFeedName: 'stOSMO-USD_price_feed',
          },
          {
            id: 'published.priceFeed.ATOM-USD_price_feed',
            typeInName: 'ATOM',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '9082714',
            priceFeedName: 'ATOM-USD_price_feed',
          },
          {
            id: 'published.priceFeed.stTIA-USD_price_feed',
            typeInName: 'stTIA',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '9745989',
            priceFeedName: 'stTIA-USD_price_feed',
          },
          {
            id: 'published.priceFeed.stkATOM-USD_price_feed',
            typeInName: 'stkATOM',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '11582357',
            priceFeedName: 'stkATOM-USD_price_feed',
          },
          {
            id: 'published.priceFeed.stATOM-USD_price_feed',
            typeInName: 'stATOM',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '12285348',
            priceFeedName: 'stATOM-USD_price_feed',
          },
        ],
      },
      boardAuxes: {
        nodes: [
          {
            allegedName: 'USDC_axl',
            decimalPlaces: 6,
          },
          {
            allegedName: 'USDT_axl',
            decimalPlaces: 6,
          },
          {
            allegedName: 'IST',
            decimalPlaces: 6,
          },
          {
            allegedName: 'KREAdCHARACTER',
            decimalPlaces: 0,
          },
          {
            allegedName: 'DAI_grv',
            decimalPlaces: 18,
          },
          {
            allegedName: 'ATOM',
            decimalPlaces: 6,
          },
          {
            allegedName: 'USDT_grv',
            decimalPlaces: 6,
          },
          {
            allegedName: 'BLD',
            decimalPlaces: 6,
          },
          {
            allegedName: 'KREAdITEM',
            decimalPlaces: 0,
          },
          {
            allegedName: 'USDC_grv',
            decimalPlaces: 6,
          },
          {
            allegedName: 'Zoe Invitation',
            decimalPlaces: 0,
          },
          {
            allegedName: 'DAI_axl',
            decimalPlaces: 18,
          },
        ],
      },
    },
  },
};

export const interchainBalancesMock = {
  data: {
    balances: [
      {
        channel_id: 'channel-0',
        address: 'agoric1a53udazy8ayufvy0s434pfwjcedzqv34y3q6mc',
        balance: [
          {
            denom: 'ubld',
            amount: '100100000',
          },
        ],
      },
      {
        channel_id: 'channel-1',
        address: 'agoric1kq2rzz6fq2q7fsu75a9g7cpzjeanmk686c8qtz',
        balance: [
          {
            denom: 'ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F',
            amount: '2',
          },
          {
            denom: 'ibc/4BFBA0996893D2049913D24060BE5936EF8AAF2C89E08B91BCCCA2B8DE3BA241',
            amount: '10000000',
          },
          {
            denom: 'ibc/6831292903487E58BF9A195FDDC8A2E626B3DF39B88F4E7F41C935CADBAF54AC',
            amount: '100000',
          },
          {
            denom: 'ibc/A50BE69DE573F17AE1A5D0A862E32144BB6167367A6C7F41C20226833C544913',
            amount: '1000',
          },
          {
            denom: 'ibc/B770756C834B46C8CBD2396D86E98556A2667FA76C87F9478FF7F527B0CEE44B',
            amount: '106000000000000000000',
          },
          {
            denom: 'ibc/F2331645B9683116188EF36FC04A809C28BD36B54555E8705A37146D0182F045',
            amount: '20000',
          },
          {
            denom: 'ubld',
            amount: '7986634661980',
          },
          {
            denom: 'uist',
            amount: '395272227811',
          },
        ],
      },
      {
        channel_id: 'channel-10',
        address: 'agoric1fp9wuhq58pz53wxvv3tnrxkw8m8s6swplgztx5',
        balance: [
          {
            denom: 'ubld',
            amount: '31998770108',
          },
          {
            denom: 'uist',
            amount: '26005013699',
          },
        ],
      },
      {
        channel_id: 'channel-11',
        address: 'agoric1kx2k3mpugtwtajd4zsykx90cn8xawe545fkjzz',
        balance: [],
      },
    ],
    height: {
      revision_number: '3',
      revision_height: '14947673',
    },
  },
};
