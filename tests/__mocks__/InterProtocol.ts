export const data = {
  data: {
    data: {
      psmMetrics: {
        nodes: [
          {
            token: 'USDC_axl',
            mintedPoolBalance: '4264',
            anchorPoolBalance: '4264',
          },
          {
            token: 'USDT_axl',
            mintedPoolBalance: '667775',
            anchorPoolBalance: '667775',
          },
          {
            token: 'DAI_grv',
            mintedPoolBalance: '4295',
            anchorPoolBalance: '4300252747114492',
          },
          {
            token: 'USDT',
            mintedPoolBalance: '195041',
            anchorPoolBalance: '195041',
          },
          {
            token: 'USDT_grv',
            mintedPoolBalance: '83613215',
            anchorPoolBalance: '83613215',
          },
          {
            token: 'USDC_grv',
            mintedPoolBalance: '0',
            anchorPoolBalance: '0',
          },
          {
            token: 'DAI_axl',
            mintedPoolBalance: '4023610395',
            anchorPoolBalance: '464577884392771894',
          },
          {
            token: 'USDC',
            mintedPoolBalance: '19120',
            anchorPoolBalance: '19120',
          },
        ],
      },
      psmGovernances: {
        nodes: [
          {
            token: 'USDT',
            mintLimit: '1000000000000',
          },
          {
            token: 'USDC',
            mintLimit: '1000000000000',
          },
        ],
      },
      vaultManagerMetrics: {
        nodes: [
          {
            id: 'published.vaultFactory.managers.manager2.metrics',
            liquidatingCollateralBrand: 'stOSMO',
            liquidatingDebtBrand: 'IST',
            totalDebt: '536086009468',
            totalCollateral: '1189648284226',
          },
          {
            id: 'published.vaultFactory.managers.manager0.metrics',
            liquidatingCollateralBrand: 'ATOM',
            liquidatingDebtBrand: 'IST',
            totalDebt: '2023644253',
            totalCollateral: '2105077121',
          },
          {
            id: 'published.vaultFactory.managers.manager3.metrics',
            liquidatingCollateralBrand: 'stTIA',
            liquidatingDebtBrand: 'IST',
            totalDebt: '355873506824',
            totalCollateral: '107785583339',
          },
          {
            id: 'published.vaultFactory.managers.manager1.metrics',
            liquidatingCollateralBrand: 'stATOM',
            liquidatingDebtBrand: 'IST',
            totalDebt: '724747063231',
            totalCollateral: '157669737896',
          },
        ],
      },
      vaultManagerGovernances: {
        nodes: [
          {
            id: 'published.vaultFactory.managers.manager1.governance',
            debtLimit: '2000000000000',
          },
          {
            id: 'published.vaultFactory.managers.manager2.governance',
            debtLimit: '728425000000',
          },
          {
            id: 'published.vaultFactory.managers.manager3.governance',
            debtLimit: '4000000000000',
          },
          {
            id: 'published.vaultFactory.managers.manager0.governance',
            debtLimit: '1000000000000',
          },
        ],
      },
      reserveMetrics: {
        nodes: [
          {
            totalFeeBurned: '0',
            shortfallBalance: '5747205025',
            allocations: {
              nodes: [
                {
                  id: 'published.reserve.metrics:ATOM',
                  token: 'ATOM',
                  value: '7525368',
                },
                {
                  id: 'published.reserve.metrics:StOSMO',
                  token: 'stOSMO',
                  value: '211843714',
                },
                {
                  id: 'published.reserve.metrics:STATOM',
                  token: 'stATOM',
                  value: '396883353',
                },
                {
                  id: 'published.reserve.metrics:StTIA',
                  token: 'stTIA',
                  value: '952659265',
                },
                {
                  id: 'published.reserve.metrics:Fee',
                  token: 'IST',
                  value: '65870064756',
                },
              ],
            },
          },
        ],
      },
      wallets: {
        totalCount: 664,
      },
      oraclePrices: {
        nodes: [
          {
            id: 'published.priceFeed.stOSMO-USD_price_feed',
            typeInName: 'stOSMO',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '1649717',
            priceFeedName: 'stOSMO-USD_price_feed',
          },
          {
            id: 'published.priceFeed.ATOM-USD_price_feed',
            typeInName: 'ATOM',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '11334888',
            priceFeedName: 'ATOM-USD_price_feed',
          },
          {
            id: 'published.priceFeed.stATOM-USD_price_feed',
            typeInName: 'stATOM',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '15156202',
            priceFeedName: 'stATOM-USD_price_feed',
          },
          {
            id: 'published.priceFeed.stTIA-USD_price_feed',
            typeInName: 'stTIA',
            typeOutName: 'USD',
            typeInAmount: '1000000',
            typeOutAmount: '12845257',
            priceFeedName: 'stTIA-USD_price_feed',
          },
        ],
      },
    },
  },
};
