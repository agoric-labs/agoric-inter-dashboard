export const dashboardDataMock = {
    "data": {
        "data": {
            "vaultManagerMetrics": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics",
                        "numActiveVaults": "76",
                        "totalCollateral": "107785583339",
                        "totalDebt": "355873506824",
                        "liquidatingCollateralBrand": "stTIA"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics",
                        "numActiveVaults": "79",
                        "totalCollateral": "157669737896",
                        "totalDebt": "724747063231",
                        "liquidatingCollateralBrand": "stATOM"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics",
                        "numActiveVaults": "27",
                        "totalCollateral": "1189648284226",
                        "totalDebt": "536086009468",
                        "liquidatingCollateralBrand": "stOSMO"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics",
                        "numActiveVaults": "22",
                        "totalCollateral": "2105077121",
                        "totalDebt": "2023644253",
                        "liquidatingCollateralBrand": "ATOM"
                    }
                ]
            },
            "oraclePrices": {
                "nodes": [
                    {
                        "priceFeedName": "ATOM-USD_price_feed",
                        "typeOutAmount": "11367930",
                        "typeInAmount": "1000000"
                    },
                    {
                        "priceFeedName": "stATOM-USD_price_feed",
                        "typeOutAmount": "15182249",
                        "typeInAmount": "1000000"
                    },
                    {
                        "priceFeedName": "stTIA-USD_price_feed",
                        "typeOutAmount": "13011715",
                        "typeInAmount": "1000000"
                    },
                    {
                        "priceFeedName": "stOSMO-USD_price_feed",
                        "typeOutAmount": "1663741",
                        "typeInAmount": "1000000"
                    }
                ]
            },
            "boardAuxes": {
                "nodes": [
                    {
                        "allegedName": "KREAdCHARACTER",
                        "decimalPlaces": 0
                    },
                    {
                        "allegedName": "BLD",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "USDC_axl",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "DAI_axl",
                        "decimalPlaces": 18
                    },
                    {
                        "allegedName": "USDT_axl",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "DAI_grv",
                        "decimalPlaces": 18
                    },
                    {
                        "allegedName": "USDC_grv",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "ATOM",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "USDT_grv",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "IST",
                        "decimalPlaces": 6
                    },
                    {
                        "allegedName": "Zoe Invitation",
                        "decimalPlaces": 0
                    },
                    {
                        "allegedName": "KREAdITEM",
                        "decimalPlaces": 0
                    }
                ]
            },
            "vaultManagerGovernances": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager1.governance",
                        "debtLimit": "2000000000000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.governance",
                        "debtLimit": "728425000000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.governance",
                        "debtLimit": "4000000000000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.governance",
                        "debtLimit": "1000000000000"
                    }
                ]
            }
        }
    }
}

export const openVaultsDataMock = {
    data: {
        "data": {
            "vaults": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault88",
                        "token": "stTIA",
                        "balance": "552996747",
                        "state": "active",
                        "debt": "2010000000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault31",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault90",
                        "token": "stATOM",
                        "balance": "65000000",
                        "state": "active",
                        "debt": "180900000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.vaults.vault14",
                        "token": "stOSMO",
                        "balance": "33116822",
                        "state": "active",
                        "debt": "25125000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault128",
                        "token": "stTIA",
                        "balance": "24950524",
                        "state": "active",
                        "debt": "117585000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault82",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.vaults.vault27",
                        "token": "stOSMO",
                        "balance": "59609316",
                        "state": "active",
                        "debt": "25133715"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault82",
                        "token": "stTIA",
                        "balance": "4172",
                        "state": "active",
                        "debt": "5121"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault64",
                        "token": "stATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault15",
                        "token": "stATOM",
                        "balance": "118535884",
                        "state": "active",
                        "debt": "402167324"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault81",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault36",
                        "token": "stTIA",
                        "balance": "20433431",
                        "state": "active",
                        "debt": "100559064"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault96",
                        "token": "stATOM",
                        "balance": "45000000",
                        "state": "active",
                        "debt": "140700000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault2",
                        "token": "stTIA",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.vaults.vault16",
                        "token": "stOSMO",
                        "balance": "4128177596",
                        "state": "active",
                        "debt": "1379672100"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault77",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault72",
                        "token": "stATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault30",
                        "token": "stTIA",
                        "balance": "1578493",
                        "state": "liquidated",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault9",
                        "token": "ATOM",
                        "balance": "8000000",
                        "state": "active",
                        "debt": "25125000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault84",
                        "token": "stATOM",
                        "balance": "204311686",
                        "state": "active",
                        "debt": "1206414280"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault112",
                        "token": "stTIA",
                        "balance": "14240925",
                        "state": "active",
                        "debt": "73677634"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault108",
                        "token": "stATOM",
                        "balance": "89658634",
                        "state": "active",
                        "debt": "600121780"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault45",
                        "token": "stTIA",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault109",
                        "token": "stATOM",
                        "balance": "90181662",
                        "state": "active",
                        "debt": "596099422"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault62",
                        "token": "stTIA",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault84",
                        "token": "ATOM",
                        "balance": "3961488",
                        "state": "active",
                        "debt": "25125000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault52",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault6",
                        "token": "stTIA",
                        "balance": "1536832709",
                        "state": "active",
                        "debt": "7568660129"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault85",
                        "token": "stTIA",
                        "balance": "9876701",
                        "state": "liquidated",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault69",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault43",
                        "token": "stTIA",
                        "balance": "5196521666",
                        "state": "active",
                        "debt": "5824749425"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault37",
                        "token": "stTIA",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault29",
                        "token": "stTIA",
                        "balance": "51560471",
                        "state": "active",
                        "debt": "306548273"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault46",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault93",
                        "token": "stTIA",
                        "balance": "100500000",
                        "state": "active",
                        "debt": "452503790"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault103",
                        "token": "stTIA",
                        "balance": "6125830",
                        "state": "active",
                        "debt": "25125000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault38",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault85",
                        "token": "stATOM",
                        "balance": "126840000",
                        "state": "active",
                        "debt": "836430681"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault98",
                        "token": "stATOM",
                        "balance": "41439325",
                        "state": "active",
                        "debt": "122610000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault71",
                        "token": "stATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault98",
                        "token": "stTIA",
                        "balance": "100100000",
                        "state": "active",
                        "debt": "452502150"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.vaults.vault26",
                        "token": "stOSMO",
                        "balance": "205807504",
                        "state": "active",
                        "debt": "150750000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault20",
                        "token": "stATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.vaults.vault33",
                        "token": "stOSMO",
                        "balance": "402682092",
                        "state": "active",
                        "debt": "251250000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault75",
                        "token": "stATOM",
                        "balance": "44000062",
                        "state": "active",
                        "debt": "267954190"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault127",
                        "token": "stATOM",
                        "balance": "9036456",
                        "state": "active",
                        "debt": "66330000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault123",
                        "token": "stATOM",
                        "balance": "14596923",
                        "state": "active",
                        "debt": "100500000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.vaults.vault14",
                        "token": "ATOM",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.vaults.vault46",
                        "token": "stTIA",
                        "balance": "0",
                        "state": "closed",
                        "debt": "0"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.vaults.vault43",
                        "token": "stATOM",
                        "balance": "3537811151",
                        "state": "active",
                        "debt": "21392260212"
                    }
                ]
            },
            "oraclePrices": {
                "nodes": [
                    {
                        "priceFeedName": "ATOM-USD_price_feed",
                        "typeOutAmount": "11367930",
                        "typeInAmount": "1000000"
                    },
                    {
                        "priceFeedName": "stTIA-USD_price_feed",
                        "typeOutAmount": "13025728",
                        "typeInAmount": "1000000"
                    },
                    {
                        "priceFeedName": "stATOM-USD_price_feed",
                        "typeOutAmount": "15182249",
                        "typeInAmount": "1000000"
                    },
                    {
                        "priceFeedName": "stOSMO-USD_price_feed",
                        "typeOutAmount": "1663741",
                        "typeInAmount": "1000000"
                    }
                ]
            },
            "vaultManagerGovernances": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager1.governance",
                        "liquidationMarginNumerator": "16000",
                        "liquidationMarginDenominator": "10000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.governance",
                        "liquidationMarginNumerator": "17000",
                        "liquidationMarginDenominator": "10000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.governance",
                        "liquidationMarginNumerator": "19000",
                        "liquidationMarginDenominator": "10000"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.governance",
                        "liquidationMarginNumerator": "15000",
                        "liquidationMarginDenominator": "10000"
                    }
                ]
            }
        }
    }
}

export const graphNodesDataMock = {
    data: {
        "data": {
            "vaultManagerMetrics": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics",
                        "liquidatingCollateralBrand": "stOSMO"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics",
                        "liquidatingCollateralBrand": "stATOM"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics",
                        "liquidatingCollateralBrand": "ATOM"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics",
                        "liquidatingCollateralBrand": "stTIA"
                    }
                ]
            }
        }
    }
}

export const graphDataMock = {
    data: {
        "data": {
            "stOSMO": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240212",
                        "dateKey": 20240212,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-12T18:29:07.118",
                        "totalDebtSum": "13190625000",
                        "totalCollateralLast": "3986644701",
                        "metricsCount": "11"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240213",
                        "dateKey": 20240213,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-13T00:30:12.661",
                        "totalDebtSum": "4602846527983",
                        "totalCollateralLast": "614061641905",
                        "metricsCount": "34"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240214",
                        "dateKey": 20240214,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-14T00:30:04.95",
                        "totalDebtSum": "11903630110697",
                        "totalCollateralLast": "614504650395",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240215",
                        "dateKey": 20240215,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-15T00:30:04.088",
                        "totalDebtSum": "10470203568046",
                        "totalCollateralLast": "618844925242",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240216",
                        "dateKey": 20240216,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-16T00:30:03.856",
                        "totalDebtSum": "11895844006371",
                        "totalCollateralLast": "618918481857",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240217",
                        "dateKey": 20240217,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-17T00:30:05.968",
                        "totalDebtSum": "9366155937205",
                        "totalCollateralLast": "618977322576",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240218",
                        "dateKey": 20240218,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-18T00:30:01.947",
                        "totalDebtSum": "9007274567626",
                        "totalCollateralLast": "619010439398",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240219",
                        "dateKey": 20240219,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-19T00:30:05.001",
                        "totalDebtSum": "9189234706055",
                        "totalCollateralLast": "619010439398",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240220",
                        "dateKey": 20240220,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-20T00:30:02.687",
                        "totalDebtSum": "12340971994366",
                        "totalCollateralLast": "620976629295",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240221",
                        "dateKey": 20240221,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-21T00:30:04.05",
                        "totalDebtSum": "9560295625446",
                        "totalCollateralLast": "620976629295",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240222",
                        "dateKey": 20240222,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-22T00:30:03.151",
                        "totalDebtSum": "9560490657666",
                        "totalCollateralLast": "620976629295",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240223",
                        "dateKey": 20240223,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-23T00:30:05.784",
                        "totalDebtSum": "10357747108815",
                        "totalCollateralLast": "621170273677",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240224",
                        "dateKey": 20240224,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-24T00:30:01.477",
                        "totalDebtSum": "11603632144517",
                        "totalCollateralLast": "642336381413",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "13559367469116",
                        "totalCollateralLast": "644032814990",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "13148187564165",
                        "totalCollateralLast": "644032814990",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240226",
                        "dateKey": 20240226,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-26T00:30:01.192",
                        "totalDebtSum": "12044869867481",
                        "totalCollateralLast": "685438537728",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240227",
                        "dateKey": 20240227,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-27T00:30:06.53",
                        "totalDebtSum": "15361535589929",
                        "totalCollateralLast": "853994721889",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240228",
                        "dateKey": 20240228,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-28T00:30:01.509",
                        "totalDebtSum": "14450106804474",
                        "totalCollateralLast": "882758664420",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240229",
                        "dateKey": 20240229,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-02-29T00:30:03.641",
                        "totalDebtSum": "12832738484802",
                        "totalCollateralLast": "882758664420",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240301",
                        "dateKey": 20240301,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-01T00:30:06.497",
                        "totalDebtSum": "14300155827878",
                        "totalCollateralLast": "924005860079",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240302",
                        "dateKey": 20240302,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-02T00:30:09.372",
                        "totalDebtSum": "14395657647104",
                        "totalCollateralLast": "924052174100",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240303",
                        "dateKey": 20240303,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-03T00:30:04.392",
                        "totalDebtSum": "13289181183246",
                        "totalCollateralLast": "924052174100",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240304",
                        "dateKey": 20240304,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-04T00:30:04.668",
                        "totalDebtSum": "13289452285482",
                        "totalCollateralLast": "924052174100",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240305",
                        "dateKey": 20240305,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-05T00:30:00.025",
                        "totalDebtSum": "16923225597310",
                        "totalCollateralLast": "977413028366",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240306",
                        "dateKey": 20240306,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-06T00:30:12.551",
                        "totalDebtSum": "14909207021944",
                        "totalCollateralLast": "977616775363",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240307",
                        "dateKey": 20240307,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-07T00:30:04.772",
                        "totalDebtSum": "14921087770500",
                        "totalCollateralLast": "977687554998",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240308",
                        "dateKey": 20240308,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-08T00:30:04.173",
                        "totalDebtSum": "13778962717350",
                        "totalCollateralLast": "977687554998",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240309",
                        "dateKey": 20240309,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-09T00:30:01.393",
                        "totalDebtSum": "14354027286347",
                        "totalCollateralLast": "977739683019",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240310",
                        "dateKey": 20240310,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-10T00:30:03.891",
                        "totalDebtSum": "14929128843510",
                        "totalCollateralLast": "977852937019",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240311",
                        "dateKey": 20240311,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-11T00:30:03.56",
                        "totalDebtSum": "14356159625427",
                        "totalCollateralLast": "977966319696",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240312",
                        "dateKey": 20240312,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-12T00:30:04.616",
                        "totalDebtSum": "14932436735046",
                        "totalCollateralLast": "978171701155",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240313",
                        "dateKey": 20240313,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-13T00:30:04.229",
                        "totalDebtSum": "16085933759116",
                        "totalCollateralLast": "978345864104",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240314",
                        "dateKey": 20240314,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-14T00:30:01.853",
                        "totalDebtSum": "14363645449638",
                        "totalCollateralLast": "978395935991",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240315",
                        "dateKey": 20240315,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-15T00:30:00.575",
                        "totalDebtSum": "14939051523402",
                        "totalCollateralLast": "978774036717",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240316",
                        "dateKey": 20240316,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-16T00:30:01.003",
                        "totalDebtSum": "17810835455583",
                        "totalCollateralLast": "979046015129",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240317",
                        "dateKey": 20240317,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-17T00:30:05.254",
                        "totalDebtSum": "13783392737244",
                        "totalCollateralLast": "979046015129",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240318",
                        "dateKey": 20240318,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-18T00:30:03.524",
                        "totalDebtSum": "13783673921484",
                        "totalCollateralLast": "979046015129",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240319",
                        "dateKey": 20240319,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-19T00:30:11.919",
                        "totalDebtSum": "21568150808038",
                        "totalCollateralLast": "1139158440974",
                        "metricsCount": "39"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240320",
                        "dateKey": 20240320,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-20T00:30:03.46",
                        "totalDebtSum": "13099773995760",
                        "totalCollateralLast": "1139158440974",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240321",
                        "dateKey": 20240321,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-21T00:30:00.084",
                        "totalDebtSum": "15815616767833",
                        "totalCollateralLast": "1139526859737",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240322",
                        "dateKey": 20240322,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-22T00:30:04.587",
                        "totalDebtSum": "17404473903408",
                        "totalCollateralLast": "1184592682095",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240323",
                        "dateKey": 20240323,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-23T00:30:02.32",
                        "totalDebtSum": "14041912589100",
                        "totalCollateralLast": "1184690379901",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240324",
                        "dateKey": 20240324,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-24T00:30:04.818",
                        "totalDebtSum": "13450062365107",
                        "totalCollateralLast": "1184690379901",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240325",
                        "dateKey": 20240325,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-25T00:30:00.506",
                        "totalDebtSum": "13981814768884",
                        "totalCollateralLast": "1184690379901",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240326",
                        "dateKey": 20240326,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-26T00:30:04.031",
                        "totalDebtSum": "13968010209262",
                        "totalCollateralLast": "1185093061993",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240327",
                        "dateKey": 20240327,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-27T00:30:01.842",
                        "totalDebtSum": "12863726157300",
                        "totalCollateralLast": "1185093061993",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240328",
                        "dateKey": 20240328,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-28T00:30:10.61",
                        "totalDebtSum": "13468577020510",
                        "totalCollateralLast": "1190816468473",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240329",
                        "dateKey": 20240329,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-29T00:30:04.456",
                        "totalDebtSum": "14566980192129",
                        "totalCollateralLast": "1190816468473",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240330",
                        "dateKey": 20240330,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-30T00:30:01.695",
                        "totalDebtSum": "12950310798288",
                        "totalCollateralLast": "1190816468473",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240331",
                        "dateKey": 20240331,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-03-31T00:30:01.247",
                        "totalDebtSum": "13460534385913",
                        "totalCollateralLast": "1190816468473",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240401",
                        "dateKey": 20240401,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-01T00:30:02.592",
                        "totalDebtSum": "13952457734854",
                        "totalCollateralLast": "1187352292875",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240402",
                        "dateKey": 20240402,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-02T00:30:05.546",
                        "totalDebtSum": "13355795815429",
                        "totalCollateralLast": "1187352292875",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240402",
                        "dateKey": 20240402,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-02T00:30:05.546",
                        "totalDebtSum": "12821288029513",
                        "totalCollateralLast": "1187352292875",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240403",
                        "dateKey": 20240403,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-03T00:47:44.058",
                        "totalDebtSum": "12814719961458",
                        "totalCollateralLast": "1187352292875",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240403",
                        "dateKey": 20240403,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-03T00:47:44.058",
                        "totalDebtSum": "12814719961458",
                        "totalCollateralLast": "1187352292875",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240404",
                        "dateKey": 20240404,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-04T00:30:27.545",
                        "totalDebtSum": "14415801690301",
                        "totalCollateralLast": "1187352292875",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240405",
                        "dateKey": 20240405,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-05T00:30:08.323",
                        "totalDebtSum": "12813190411476",
                        "totalCollateralLast": "1187254595069",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240406",
                        "dateKey": 20240406,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-06T00:30:00.058",
                        "totalDebtSum": "14974423960098",
                        "totalCollateralLast": "1189648284226",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240407",
                        "dateKey": 20240407,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-07T00:30:02.395",
                        "totalDebtSum": "12865867378332",
                        "totalCollateralLast": "1189648284226",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager2.metrics:20240408",
                        "dateKey": 20240408,
                        "liquidatingCollateralBrand": "stOSMO",
                        "blockTimeLast": "2024-04-08T00:30:00.465",
                        "totalDebtSum": "6433032113616",
                        "totalCollateralLast": "1189648284226",
                        "metricsCount": "12"
                    }
                ]
            },
            "stOSMO_oracle": {
                "nodes": [
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240212",
                        "dateKey": 20240212,
                        "blockTimeLast": "2024-02-12T18:42:34",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1990382"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240213",
                        "dateKey": 20240213,
                        "blockTimeLast": "2024-02-13T00:07:19",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1978133"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240214",
                        "dateKey": 20240214,
                        "blockTimeLast": "2024-02-14T00:02:05",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2005811"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240215",
                        "dateKey": 20240215,
                        "blockTimeLast": "2024-02-15T00:07:03",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1940175"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240216",
                        "dateKey": 20240216,
                        "blockTimeLast": "2024-02-16T00:04:54",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1944176"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240217",
                        "dateKey": 20240217,
                        "blockTimeLast": "2024-02-17T00:03:12",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1938645"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240218",
                        "dateKey": 20240218,
                        "blockTimeLast": "2024-02-18T00:00:11",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1965155"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240219",
                        "dateKey": 20240219,
                        "blockTimeLast": "2024-02-19T00:02:41",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1982856"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240220",
                        "dateKey": 20240220,
                        "blockTimeLast": "2024-02-20T00:15:40",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1945187"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240221",
                        "dateKey": 20240221,
                        "blockTimeLast": "2024-02-21T00:03:31",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1884059"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240222",
                        "dateKey": 20240222,
                        "blockTimeLast": "2024-02-22T00:02:56",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1860564"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240223",
                        "dateKey": 20240223,
                        "blockTimeLast": "2024-02-23T00:05:47",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1861152"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240224",
                        "dateKey": 20240224,
                        "blockTimeLast": "2024-02-24T00:08:41",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1918401"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:04:33",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1918677"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:04:33",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1918677"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240226",
                        "dateKey": 20240226,
                        "blockTimeLast": "2024-02-26T00:00:12",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1970178"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240227",
                        "dateKey": 20240227,
                        "blockTimeLast": "2024-02-27T00:05:21",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1952248"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240228",
                        "dateKey": 20240228,
                        "blockTimeLast": "2024-02-28T00:00:41",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1945096"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240229",
                        "dateKey": 20240229,
                        "blockTimeLast": "2024-02-29T00:00:32",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1919450"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240301",
                        "dateKey": 20240301,
                        "blockTimeLast": "2024-03-01T00:01:18",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1948342"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240302",
                        "dateKey": 20240302,
                        "blockTimeLast": "2024-03-02T00:06:21",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1960227"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240303",
                        "dateKey": 20240303,
                        "blockTimeLast": "2024-03-03T00:03:44",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1945377"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240304",
                        "dateKey": 20240304,
                        "blockTimeLast": "2024-03-04T00:00:39",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1948345"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240305",
                        "dateKey": 20240305,
                        "blockTimeLast": "2024-03-05T00:09:34",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1869761"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240306",
                        "dateKey": 20240306,
                        "blockTimeLast": "2024-03-06T00:04:09",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2158127"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240307",
                        "dateKey": 20240307,
                        "blockTimeLast": "2024-03-07T00:09:17",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2118248"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240308",
                        "dateKey": 20240308,
                        "blockTimeLast": "2024-03-08T00:00:59",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2012626"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240309",
                        "dateKey": 20240309,
                        "blockTimeLast": "2024-03-09T00:10:15",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2012387"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240310",
                        "dateKey": 20240310,
                        "blockTimeLast": "2024-03-10T00:01:40",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1965436"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240311",
                        "dateKey": 20240311,
                        "blockTimeLast": "2024-03-11T00:08:56",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2018793"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240312",
                        "dateKey": 20240312,
                        "blockTimeLast": "2024-03-12T00:08:30",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1977503"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240313",
                        "dateKey": 20240313,
                        "blockTimeLast": "2024-03-13T00:06:51",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "2013443"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240314",
                        "dateKey": 20240314,
                        "blockTimeLast": "2024-03-14T00:10:18",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1938908"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240315",
                        "dateKey": 20240315,
                        "blockTimeLast": "2024-03-15T00:04:32",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1820745"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240316",
                        "dateKey": 20240316,
                        "blockTimeLast": "2024-03-16T00:10:36",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1683064"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240317",
                        "dateKey": 20240317,
                        "blockTimeLast": "2024-03-17T00:01:04",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1725553"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240318",
                        "dateKey": 20240318,
                        "blockTimeLast": "2024-03-18T00:02:29",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1612391"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240319",
                        "dateKey": 20240319,
                        "blockTimeLast": "2024-03-19T00:04:57",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1522755"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240320",
                        "dateKey": 20240320,
                        "blockTimeLast": "2024-03-20T00:19:30",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1651673"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240321",
                        "dateKey": 20240321,
                        "blockTimeLast": "2024-03-21T00:00:04",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1625607"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240322",
                        "dateKey": 20240322,
                        "blockTimeLast": "2024-03-22T00:04:21",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1572209"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240323",
                        "dateKey": 20240323,
                        "blockTimeLast": "2024-03-23T00:09:56",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1567361"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240324",
                        "dateKey": 20240324,
                        "blockTimeLast": "2024-03-24T00:05:40",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1606991"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240325",
                        "dateKey": 20240325,
                        "blockTimeLast": "2024-03-25T00:06:33",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1657185"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240326",
                        "dateKey": 20240326,
                        "blockTimeLast": "2024-03-26T00:07:37",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1642213"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240327",
                        "dateKey": 20240327,
                        "blockTimeLast": "2024-03-27T00:00:11",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1662652"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240328",
                        "dateKey": 20240328,
                        "blockTimeLast": "2024-03-28T00:08:41",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1667030"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240329",
                        "dateKey": 20240329,
                        "blockTimeLast": "2024-03-29T00:00:57",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1703843"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240330",
                        "dateKey": 20240330,
                        "blockTimeLast": "2024-03-30T00:05:17",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1674303"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240331",
                        "dateKey": 20240331,
                        "blockTimeLast": "2024-03-31T00:06:30",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1694602"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240401",
                        "dateKey": 20240401,
                        "blockTimeLast": "2024-04-01T00:09:17",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1605322"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240402",
                        "dateKey": 20240402,
                        "blockTimeLast": "2024-04-02T00:03:38",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1530691"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240402",
                        "dateKey": 20240402,
                        "blockTimeLast": "2024-04-02T00:03:38",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1530691"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240403",
                        "dateKey": 20240403,
                        "blockTimeLast": "2024-04-03T01:41:38",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1542052"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240403",
                        "dateKey": 20240403,
                        "blockTimeLast": "2024-04-03T01:41:38",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1542052"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240404",
                        "dateKey": 20240404,
                        "blockTimeLast": "2024-04-04T00:00:00",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1606487"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240405",
                        "dateKey": 20240405,
                        "blockTimeLast": "2024-04-05T00:08:48",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1573855"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240406",
                        "dateKey": 20240406,
                        "blockTimeLast": "2024-04-06T00:08:37",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1608730"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240407",
                        "dateKey": 20240407,
                        "blockTimeLast": "2024-04-07T00:10:38",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1617651"
                    },
                    {
                        "id": "published.priceFeed.stOSMO-USD_price_feed:20240408",
                        "dateKey": 20240408,
                        "blockTimeLast": "2024-04-08T00:05:51",
                        "typeInName": "stOSMO",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "1663741"
                    }
                ]
            },
            "stATOM": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231221",
                        "dateKey": 20231221,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-21T13:30:03.008",
                        "totalDebtSum": "6508304521648",
                        "totalCollateralLast": "137187945579",
                        "metricsCount": "12"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231222",
                        "dateKey": 20231222,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-22T00:30:04.021",
                        "totalDebtSum": "15728879646799",
                        "totalCollateralLast": "137139972933",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231223",
                        "dateKey": 20231223,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-23T00:30:00.42",
                        "totalDebtSum": "13559990249856",
                        "totalCollateralLast": "137139972933",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231224",
                        "dateKey": 20231224,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-24T00:30:03.292",
                        "totalDebtSum": "13563498763235",
                        "totalCollateralLast": "137148232465",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231225",
                        "dateKey": 20231225,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-25T00:30:03.278",
                        "totalDebtSum": "15197351498355",
                        "totalCollateralLast": "137207732465",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231226",
                        "dateKey": 20231226,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-26T00:30:01.129",
                        "totalDebtSum": "14119301552543",
                        "totalCollateralLast": "137207732465",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231227",
                        "dateKey": 20231227,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-27T00:30:04.866",
                        "totalDebtSum": "13583123672775",
                        "totalCollateralLast": "137440841644",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231228",
                        "dateKey": 20231228,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-28T00:30:04.9",
                        "totalDebtSum": "13600760239433",
                        "totalCollateralLast": "137690841644",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231229",
                        "dateKey": 20231229,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-29T00:03:05.052",
                        "totalDebtSum": "13629956832130",
                        "totalCollateralLast": "137719825896",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231230",
                        "dateKey": 20231230,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-30T00:30:04.318",
                        "totalDebtSum": "14179297058098",
                        "totalCollateralLast": "137948799928",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20231231",
                        "dateKey": 20231231,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2023-12-31T00:30:00.097",
                        "totalDebtSum": "14743647335763",
                        "totalCollateralLast": "137715690749",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240101",
                        "dateKey": 20240101,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-01T00:30:00.782",
                        "totalDebtSum": "13090155201516",
                        "totalCollateralLast": "137715690749",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240102",
                        "dateKey": 20240102,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-02T00:30:05.596",
                        "totalDebtSum": "14353154158142",
                        "totalCollateralLast": "137948790749",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240103",
                        "dateKey": 20240103,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-03T00:30:03.966",
                        "totalDebtSum": "14963456350546",
                        "totalCollateralLast": "137956561633",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240104",
                        "dateKey": 20240104,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-04T00:30:04.361",
                        "totalDebtSum": "14365944006884",
                        "totalCollateralLast": "137956561633",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240105",
                        "dateKey": 20240105,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-05T00:30:02.628",
                        "totalDebtSum": "14366237075297",
                        "totalCollateralLast": "137956561633",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240106",
                        "dateKey": 20240106,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-06T00:30:04.529",
                        "totalDebtSum": "14962177736372",
                        "totalCollateralLast": "137961321312",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240107",
                        "dateKey": 20240107,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-07T00:30:00.816",
                        "totalDebtSum": "14960096181092",
                        "totalCollateralLast": "137961321312",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240108",
                        "dateKey": 20240108,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-08T00:30:01.22",
                        "totalDebtSum": "14968210036685",
                        "totalCollateralLast": "138361321312",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240109",
                        "dateKey": 20240109,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-09T00:30:02.448",
                        "totalDebtSum": "14393608268870",
                        "totalCollateralLast": "138361321312",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240110",
                        "dateKey": 20240110,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-10T00:30:02.735",
                        "totalDebtSum": "14994449275510",
                        "totalCollateralLast": "138401731968",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240111",
                        "dateKey": 20240111,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-11T00:30:04.577",
                        "totalDebtSum": "16197454522708",
                        "totalCollateralLast": "138190734154",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240112",
                        "dateKey": 20240112,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-12T00:30:01.703",
                        "totalDebtSum": "14416812847895",
                        "totalCollateralLast": "138190734154",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240113",
                        "dateKey": 20240113,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-13T00:30:04.848",
                        "totalDebtSum": "14417106954049",
                        "totalCollateralLast": "138190734154",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240114",
                        "dateKey": 20240114,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-14T00:30:03.766",
                        "totalDebtSum": "14417401066203",
                        "totalCollateralLast": "138190734154",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240115",
                        "dateKey": 20240115,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-15T00:30:03.252",
                        "totalDebtSum": "17497445291195",
                        "totalCollateralLast": "138953567446",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240116",
                        "dateKey": 20240116,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-16T00:30:02.288",
                        "totalDebtSum": "14505268159486",
                        "totalCollateralLast": "138953567446",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240117",
                        "dateKey": 20240117,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-17T00:30:01.822",
                        "totalDebtSum": "17530200457615",
                        "totalCollateralLast": "139089860454",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240118",
                        "dateKey": 20240118,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-18T00:30:04.302",
                        "totalDebtSum": "14514663490355",
                        "totalCollateralLast": "139089860454",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240119",
                        "dateKey": 20240119,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-19T00:30:05.102",
                        "totalDebtSum": "14514959592652",
                        "totalCollateralLast": "139089860454",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240120",
                        "dateKey": 20240120,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-20T00:30:03.358",
                        "totalDebtSum": "15120036445219",
                        "totalCollateralLast": "139089860454",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240121",
                        "dateKey": 20240121,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-21T00:30:04.597",
                        "totalDebtSum": "15142610169608",
                        "totalCollateralLast": "142822355261",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240122",
                        "dateKey": 20240122,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-22T00:30:01.002",
                        "totalDebtSum": "16397885216017",
                        "totalCollateralLast": "142837392025",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240123",
                        "dateKey": 20240123,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-23T00:30:00.955",
                        "totalDebtSum": "17009647830316",
                        "totalCollateralLast": "142898733832",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240124",
                        "dateKey": 20240124,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-24T00:30:00.159",
                        "totalDebtSum": "15798365610490",
                        "totalCollateralLast": "142898733832",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240125",
                        "dateKey": 20240125,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-25T00:30:00.421",
                        "totalDebtSum": "14583365988814",
                        "totalCollateralLast": "142898733832",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240126",
                        "dateKey": 20240126,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-26T00:30:03.021",
                        "totalDebtSum": "15269704170740",
                        "totalCollateralLast": "143968341902",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240127",
                        "dateKey": 20240127,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-27T00:30:03.55",
                        "totalDebtSum": "14728684570024",
                        "totalCollateralLast": "143968341902",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240128",
                        "dateKey": 20240128,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-28T00:30:04.108",
                        "totalDebtSum": "14728985038430",
                        "totalCollateralLast": "143968341902",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240129",
                        "dateKey": 20240129,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-29T00:30:08.495",
                        "totalDebtSum": "14729285512937",
                        "totalCollateralLast": "143968341902",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240130",
                        "dateKey": 20240130,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-30T00:30:05.541",
                        "totalDebtSum": "17190575030946",
                        "totalCollateralLast": "144336161822",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240131",
                        "dateKey": 20240131,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-31T00:30:01.92",
                        "totalDebtSum": "16000748380036",
                        "totalCollateralLast": "144354661822",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240131",
                        "dateKey": 20240131,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-01-31T00:30:01.92",
                        "totalDebtSum": "16616135323449",
                        "totalCollateralLast": "144354661822",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240201",
                        "dateKey": 20240201,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-01T00:30:02.71",
                        "totalDebtSum": "16003568065328",
                        "totalCollateralLast": "144365531522",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240202",
                        "dateKey": 20240202,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-02T00:30:03.621",
                        "totalDebtSum": "15389461971806",
                        "totalCollateralLast": "144375531522",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240203",
                        "dateKey": 20240203,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-03T00:30:04.609",
                        "totalDebtSum": "15391366342230",
                        "totalCollateralLast": "144380460212",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240204",
                        "dateKey": 20240204,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-04T00:30:05.168",
                        "totalDebtSum": "16007649185900",
                        "totalCollateralLast": "144378590512",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240205",
                        "dateKey": 20240205,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-05T00:30:08.606",
                        "totalDebtSum": "14776658181352",
                        "totalCollateralLast": "144378590512",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240206",
                        "dateKey": 20240206,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-06T00:30:00.903",
                        "totalDebtSum": "18460224945513",
                        "totalCollateralLast": "144399444512",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240207",
                        "dateKey": 20240207,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-07T00:30:00.055",
                        "totalDebtSum": "16000061718618",
                        "totalCollateralLast": "144413544512",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240208",
                        "dateKey": 20240208,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-08T00:30:04.923",
                        "totalDebtSum": "17849868008419",
                        "totalCollateralLast": "144479864512",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240209",
                        "dateKey": 20240209,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-09T00:30:02.903",
                        "totalDebtSum": "15988403233590",
                        "totalCollateralLast": "144479864512",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240210",
                        "dateKey": 20240210,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-10T00:30:17.931",
                        "totalDebtSum": "15972149187780",
                        "totalCollateralLast": "144479864512",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240211",
                        "dateKey": 20240211,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-11T00:30:00.994",
                        "totalDebtSum": "18428212461474",
                        "totalCollateralLast": "144454820512",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240212",
                        "dateKey": 20240212,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-12T00:30:01.673",
                        "totalDebtSum": "15971002489647",
                        "totalCollateralLast": "144454820512",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240213",
                        "dateKey": 20240213,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-13T00:30:12.661",
                        "totalDebtSum": "15985032450258",
                        "totalCollateralLast": "144558820512",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240214",
                        "dateKey": 20240214,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-14T00:30:04.95",
                        "totalDebtSum": "17230179304622",
                        "totalCollateralLast": "144675959899",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240215",
                        "dateKey": 20240215,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-15T00:30:04.088",
                        "totalDebtSum": "21649954327623",
                        "totalCollateralLast": "145387862609",
                        "metricsCount": "35"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240216",
                        "dateKey": 20240216,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-16T00:30:03.856",
                        "totalDebtSum": "16141116032847",
                        "totalCollateralLast": "145377862609",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240217",
                        "dateKey": 20240217,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-17T00:30:05.968",
                        "totalDebtSum": "18061411164768",
                        "totalCollateralLast": "146246471736",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240218",
                        "dateKey": 20240218,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-18T00:30:01.947",
                        "totalDebtSum": "15598932823330",
                        "totalCollateralLast": "146281471736",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240219",
                        "dateKey": 20240219,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-19T00:30:05.001",
                        "totalDebtSum": "28191867230802",
                        "totalCollateralLast": "147342668031",
                        "metricsCount": "45"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240220",
                        "dateKey": 20240220,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-20T00:30:02.687",
                        "totalDebtSum": "15732264703647",
                        "totalCollateralLast": "147343668031",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240221",
                        "dateKey": 20240221,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-21T00:30:04.05",
                        "totalDebtSum": "18894069596897",
                        "totalCollateralLast": "147667853345",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240222",
                        "dateKey": 20240222,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-22T00:30:03.151",
                        "totalDebtSum": "21234489081552",
                        "totalCollateralLast": "157493041470",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240223",
                        "dateKey": 20240223,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-23T00:30:05.784",
                        "totalDebtSum": "16979464918604",
                        "totalCollateralLast": "157493041470",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240224",
                        "dateKey": 20240224,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-24T00:30:01.477",
                        "totalDebtSum": "16990848667550",
                        "totalCollateralLast": "157493041470",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "18349973512135",
                        "totalCollateralLast": "157473041470",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "17670309221983",
                        "totalCollateralLast": "157473041470",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240226",
                        "dateKey": 20240226,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-26T00:30:01.192",
                        "totalDebtSum": "20438955099279",
                        "totalCollateralLast": "157556074951",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240227",
                        "dateKey": 20240227,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-27T00:30:06.53",
                        "totalDebtSum": "17809687880921",
                        "totalCollateralLast": "157556428543",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240228",
                        "dateKey": 20240228,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-28T00:30:01.509",
                        "totalDebtSum": "20546277929211",
                        "totalCollateralLast": "157197084354",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240229",
                        "dateKey": 20240229,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-02-29T00:06:28.5",
                        "totalDebtSum": "19440060308546",
                        "totalCollateralLast": "152139861685",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240301",
                        "dateKey": 20240301,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-01T00:30:06.497",
                        "totalDebtSum": "17823310992833",
                        "totalCollateralLast": "152142726104",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240302",
                        "dateKey": 20240302,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-02T00:30:09.372",
                        "totalDebtSum": "21782148573834",
                        "totalCollateralLast": "152248811942",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240303",
                        "dateKey": 20240303,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-03T00:30:04.392",
                        "totalDebtSum": "20596086775956",
                        "totalCollateralLast": "154749283999",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240304",
                        "dateKey": 20240304,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-04T00:30:04.668",
                        "totalDebtSum": "17544482419885",
                        "totalCollateralLast": "154669933632",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240305",
                        "dateKey": 20240305,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-05T00:30:00.025",
                        "totalDebtSum": "19047922976719",
                        "totalCollateralLast": "154676231892",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240306",
                        "dateKey": 20240306,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-06T00:30:12.551",
                        "totalDebtSum": "17204433208153",
                        "totalCollateralLast": "154676231892",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240307",
                        "dateKey": 20240307,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-07T00:25:37.133",
                        "totalDebtSum": "26745281944956",
                        "totalCollateralLast": "144530876162",
                        "metricsCount": "39"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240308",
                        "dateKey": 20240308,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-08T00:16:47.287",
                        "totalDebtSum": "22920056417631",
                        "totalCollateralLast": "141362679226",
                        "metricsCount": "40"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240309",
                        "dateKey": 20240309,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-09T00:30:01.393",
                        "totalDebtSum": "14240375904856",
                        "totalCollateralLast": "137304886362",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240310",
                        "dateKey": 20240310,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-10T00:30:03.891",
                        "totalDebtSum": "14450171384298",
                        "totalCollateralLast": "138294266290",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240311",
                        "dateKey": 20240311,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-11T00:30:03.56",
                        "totalDebtSum": "15693001820558",
                        "totalCollateralLast": "137801069842",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240312",
                        "dateKey": 20240312,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-12T00:30:04.616",
                        "totalDebtSum": "16191516180498",
                        "totalCollateralLast": "138167115424",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240313",
                        "dateKey": 20240313,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-13T00:30:04.229",
                        "totalDebtSum": "17778845142726",
                        "totalCollateralLast": "138741214706",
                        "metricsCount": "35"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240314",
                        "dateKey": 20240314,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-14T00:30:01.853",
                        "totalDebtSum": "17352106258022",
                        "totalCollateralLast": "123850156047",
                        "metricsCount": "34"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240315",
                        "dateKey": 20240315,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-15T00:30:00.575",
                        "totalDebtSum": "30379811253140",
                        "totalCollateralLast": "123947885874",
                        "metricsCount": "59"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240316",
                        "dateKey": 20240316,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-16T00:00:00.179",
                        "totalDebtSum": "23435570377234",
                        "totalCollateralLast": "139015509611",
                        "metricsCount": "42"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager1.metrics:20240317",
                        "dateKey": 20240317,
                        "liquidatingCollateralBrand": "stATOM",
                        "blockTimeLast": "2024-03-17T00:30:05.254",
                        "totalDebtSum": "20701112900643",
                        "totalCollateralLast": "140164482935",
                        "metricsCount": "31"
                    }
                ]
            },
            "stATOM_oracle": {
                "nodes": [
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231221",
                        "dateKey": 20231221,
                        "blockTimeLast": "2023-12-21T12:50:08",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14602347"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231222",
                        "dateKey": 20231222,
                        "blockTimeLast": "2023-12-22T00:06:54",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14606366"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231223",
                        "dateKey": 20231223,
                        "blockTimeLast": "2023-12-23T00:06:26",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14540836"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231224",
                        "dateKey": 20231224,
                        "blockTimeLast": "2023-12-24T00:07:44",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14443396"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231225",
                        "dateKey": 20231225,
                        "blockTimeLast": "2023-12-25T00:02:58",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15333189"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231226",
                        "dateKey": 20231226,
                        "blockTimeLast": "2023-12-26T00:01:38",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14857106"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231227",
                        "dateKey": 20231227,
                        "blockTimeLast": "2023-12-27T00:01:51",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15367240"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231228",
                        "dateKey": 20231228,
                        "blockTimeLast": "2023-12-28T00:00:10",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14674869"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231229",
                        "dateKey": 20231229,
                        "blockTimeLast": "2023-12-29T00:08:26",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14116349"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231230",
                        "dateKey": 20231230,
                        "blockTimeLast": "2023-12-30T00:04:44",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13855509"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20231231",
                        "dateKey": 20231231,
                        "blockTimeLast": "2023-12-31T00:06:02",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13618077"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240101",
                        "dateKey": 20240101,
                        "blockTimeLast": "2024-01-01T00:06:38",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14416437"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240102",
                        "dateKey": 20240102,
                        "blockTimeLast": "2024-01-02T00:00:23",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14109935"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240103",
                        "dateKey": 20240103,
                        "blockTimeLast": "2024-01-03T00:01:51",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12794734"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240104",
                        "dateKey": 20240104,
                        "blockTimeLast": "2024-01-04T00:00:09",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13228201"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240105",
                        "dateKey": 20240105,
                        "blockTimeLast": "2024-01-05T00:08:23",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13294113"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240106",
                        "dateKey": 20240106,
                        "blockTimeLast": "2024-01-06T00:08:13",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12678967"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240107",
                        "dateKey": 20240107,
                        "blockTimeLast": "2024-01-07T00:06:52",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12131425"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240108",
                        "dateKey": 20240108,
                        "blockTimeLast": "2024-01-08T00:05:13",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12857815"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240109",
                        "dateKey": 20240109,
                        "blockTimeLast": "2024-01-09T00:00:57",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12457529"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240110",
                        "dateKey": 20240110,
                        "blockTimeLast": "2024-01-10T00:04:52",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13440354"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240111",
                        "dateKey": 20240111,
                        "blockTimeLast": "2024-01-11T00:01:23",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13774035"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240112",
                        "dateKey": 20240112,
                        "blockTimeLast": "2024-01-12T00:02:13",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12864239"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240113",
                        "dateKey": 20240113,
                        "blockTimeLast": "2024-01-13T00:01:59",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13215658"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240114",
                        "dateKey": 20240114,
                        "blockTimeLast": "2024-01-14T00:06:51",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12917468"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240115",
                        "dateKey": 20240115,
                        "blockTimeLast": "2024-01-15T00:07:23",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13211705"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240116",
                        "dateKey": 20240116,
                        "blockTimeLast": "2024-01-16T00:03:43",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13323972"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240117",
                        "dateKey": 20240117,
                        "blockTimeLast": "2024-01-17T00:01:45",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13139643"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240118",
                        "dateKey": 20240118,
                        "blockTimeLast": "2024-01-18T00:08:59",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12563875"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240119",
                        "dateKey": 20240119,
                        "blockTimeLast": "2024-01-19T00:00:51",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12575960"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240120",
                        "dateKey": 20240120,
                        "blockTimeLast": "2024-01-20T00:08:52",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12733512"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240121",
                        "dateKey": 20240121,
                        "blockTimeLast": "2024-01-21T00:02:14",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12510958"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240122",
                        "dateKey": 20240122,
                        "blockTimeLast": "2024-01-22T00:00:27",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11897947"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240123",
                        "dateKey": 20240123,
                        "blockTimeLast": "2024-01-23T00:07:08",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11964727"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240124",
                        "dateKey": 20240124,
                        "blockTimeLast": "2024-01-24T00:09:02",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12149057"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240125",
                        "dateKey": 20240125,
                        "blockTimeLast": "2024-01-25T00:06:02",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11987395"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240126",
                        "dateKey": 20240126,
                        "blockTimeLast": "2024-01-26T00:04:43",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12516748"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240127",
                        "dateKey": 20240127,
                        "blockTimeLast": "2024-01-27T00:02:09",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12589284"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240128",
                        "dateKey": 20240128,
                        "blockTimeLast": "2024-01-28T00:00:53",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12265161"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240129",
                        "dateKey": 20240129,
                        "blockTimeLast": "2024-01-29T00:09:00",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12580595"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240130",
                        "dateKey": 20240130,
                        "blockTimeLast": "2024-01-30T00:03:27",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12239186"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240131",
                        "dateKey": 20240131,
                        "blockTimeLast": "2024-01-31T00:05:49",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11854467"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240131",
                        "dateKey": 20240131,
                        "blockTimeLast": "2024-01-31T00:05:49",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11854467"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240201",
                        "dateKey": 20240201,
                        "blockTimeLast": "2024-02-01T00:07:27",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11897585"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240202",
                        "dateKey": 20240202,
                        "blockTimeLast": "2024-02-02T00:01:42",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11942435"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240203",
                        "dateKey": 20240203,
                        "blockTimeLast": "2024-02-03T00:00:21",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11801377"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240204",
                        "dateKey": 20240204,
                        "blockTimeLast": "2024-02-04T00:06:05",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11688174"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240205",
                        "dateKey": 20240205,
                        "blockTimeLast": "2024-02-05T00:08:52",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11800014"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240206",
                        "dateKey": 20240206,
                        "blockTimeLast": "2024-02-06T00:12:37",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11912602"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240207",
                        "dateKey": 20240207,
                        "blockTimeLast": "2024-02-07T00:04:51",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12524704"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240208",
                        "dateKey": 20240208,
                        "blockTimeLast": "2024-02-08T00:10:03",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12590824"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240209",
                        "dateKey": 20240209,
                        "blockTimeLast": "2024-02-09T00:07:51",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13102254"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240210",
                        "dateKey": 20240210,
                        "blockTimeLast": "2024-02-10T00:03:04",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13032382"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240211",
                        "dateKey": 20240211,
                        "blockTimeLast": "2024-02-11T00:04:01",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12721805"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240212",
                        "dateKey": 20240212,
                        "blockTimeLast": "2024-02-12T00:04:09",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13003220"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240213",
                        "dateKey": 20240213,
                        "blockTimeLast": "2024-02-13T00:09:04",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13478171"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240214",
                        "dateKey": 20240214,
                        "blockTimeLast": "2024-02-14T00:07:49",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13399595"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240215",
                        "dateKey": 20240215,
                        "blockTimeLast": "2024-02-15T00:07:44",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13539538"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240216",
                        "dateKey": 20240216,
                        "blockTimeLast": "2024-02-16T00:08:26",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13423204"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240217",
                        "dateKey": 20240217,
                        "blockTimeLast": "2024-02-17T00:07:41",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13477834"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240218",
                        "dateKey": 20240218,
                        "blockTimeLast": "2024-02-18T00:06:47",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13870236"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240219",
                        "dateKey": 20240219,
                        "blockTimeLast": "2024-02-19T00:01:45",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14101555"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240220",
                        "dateKey": 20240220,
                        "blockTimeLast": "2024-02-20T00:08:19",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13591753"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240221",
                        "dateKey": 20240221,
                        "blockTimeLast": "2024-02-21T00:05:44",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13102825"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240222",
                        "dateKey": 20240222,
                        "blockTimeLast": "2024-02-22T00:04:31",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12868836"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240223",
                        "dateKey": 20240223,
                        "blockTimeLast": "2024-02-23T00:04:02",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13083959"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240224",
                        "dateKey": 20240224,
                        "blockTimeLast": "2024-02-24T00:00:45",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13685057"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:04:00",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13638716"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:04:00",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13638716"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240226",
                        "dateKey": 20240226,
                        "blockTimeLast": "2024-02-26T00:07:27",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14652760"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240227",
                        "dateKey": 20240227,
                        "blockTimeLast": "2024-02-27T00:09:21",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14747564"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240228",
                        "dateKey": 20240228,
                        "blockTimeLast": "2024-02-28T00:00:41",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15047264"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240229",
                        "dateKey": 20240229,
                        "blockTimeLast": "2024-02-29T00:04:31",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14890564"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240301",
                        "dateKey": 20240301,
                        "blockTimeLast": "2024-03-01T00:03:30",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15308264"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240302",
                        "dateKey": 20240302,
                        "blockTimeLast": "2024-03-02T00:03:30",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16078965"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240303",
                        "dateKey": 20240303,
                        "blockTimeLast": "2024-03-03T00:09:29",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16015408"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240304",
                        "dateKey": 20240304,
                        "blockTimeLast": "2024-03-04T00:02:19",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16468255"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240305",
                        "dateKey": 20240305,
                        "blockTimeLast": "2024-03-05T00:09:34",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15879889"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240306",
                        "dateKey": 20240306,
                        "blockTimeLast": "2024-03-06T00:06:39",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18706517"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240307",
                        "dateKey": 20240307,
                        "blockTimeLast": "2024-03-07T00:01:36",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18391858"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240308",
                        "dateKey": 20240308,
                        "blockTimeLast": "2024-03-08T00:01:30",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17699038"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240309",
                        "dateKey": 20240309,
                        "blockTimeLast": "2024-03-09T00:10:54",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17684644"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240310",
                        "dateKey": 20240310,
                        "blockTimeLast": "2024-03-10T00:01:15",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17412057"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240311",
                        "dateKey": 20240311,
                        "blockTimeLast": "2024-03-11T00:07:41",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18136797"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240312",
                        "dateKey": 20240312,
                        "blockTimeLast": "2024-03-12T00:12:14",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17748835"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240313",
                        "dateKey": 20240313,
                        "blockTimeLast": "2024-03-13T00:08:49",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18633697"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240314",
                        "dateKey": 20240314,
                        "blockTimeLast": "2024-03-14T00:05:54",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18027773"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240315",
                        "dateKey": 20240315,
                        "blockTimeLast": "2024-03-15T00:04:25",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16748509"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240316",
                        "dateKey": 20240316,
                        "blockTimeLast": "2024-03-16T00:03:23",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15803243"
                    },
                    {
                        "id": "published.priceFeed.stATOM-USD_price_feed:20240317",
                        "dateKey": 20240317,
                        "blockTimeLast": "2024-03-17T00:07:46",
                        "typeInName": "stATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16247940"
                    }
                ]
            },
            "ATOM": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231221",
                        "dateKey": 20231221,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-21T13:13:59.983",
                        "totalDebtSum": "22806066200",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "14"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231222",
                        "dateKey": 20231222,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-22T00:30:04.021",
                        "totalDebtSum": "39149540232",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231223",
                        "dateKey": 20231223,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-23T00:30:00.42",
                        "totalDebtSum": "39152180754",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231224",
                        "dateKey": 20231224,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-24T00:30:03.292",
                        "totalDebtSum": "43141766719",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231225",
                        "dateKey": 20231225,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-25T00:30:03.278",
                        "totalDebtSum": "39166485720",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231226",
                        "dateKey": 20231226,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-26T00:30:01.129",
                        "totalDebtSum": "39169127388",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231227",
                        "dateKey": 20231227,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-27T00:30:04.866",
                        "totalDebtSum": "39171769464",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231228",
                        "dateKey": 20231228,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-28T00:30:04.9",
                        "totalDebtSum": "39174411576",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231229",
                        "dateKey": 20231229,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-29T00:30:02.499",
                        "totalDebtSum": "39177053784",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231230",
                        "dateKey": 20231230,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-30T00:30:04.318",
                        "totalDebtSum": "39179696328",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20231231",
                        "dateKey": 20231231,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2023-12-31T00:30:00.097",
                        "totalDebtSum": "39182339016",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240101",
                        "dateKey": 20240101,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-01T00:30:00.782",
                        "totalDebtSum": "39184981764",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240102",
                        "dateKey": 20240102,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-02T00:30:05.596",
                        "totalDebtSum": "39187624776",
                        "totalCollateralLast": "2039533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240103",
                        "dateKey": 20240103,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-03T00:30:03.966",
                        "totalDebtSum": "44064139778",
                        "totalCollateralLast": "2091433504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240104",
                        "dateKey": 20240104,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-04T00:30:04.361",
                        "totalDebtSum": "46260341845",
                        "totalCollateralLast": "2105133504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240105",
                        "dateKey": 20240105,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-05T00:30:02.628",
                        "totalDebtSum": "47561334779",
                        "totalCollateralLast": "2091433504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240106",
                        "dateKey": 20240106,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-06T00:30:04.529",
                        "totalDebtSum": "52122418178",
                        "totalCollateralLast": "2133533504",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240107",
                        "dateKey": 20240107,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-07T00:30:00.816",
                        "totalDebtSum": "48551232384",
                        "totalCollateralLast": "2133533504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240108",
                        "dateKey": 20240108,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-08T00:30:01.22",
                        "totalDebtSum": "55239488465",
                        "totalCollateralLast": "2153533504",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240109",
                        "dateKey": 20240109,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-09T00:30:02.448",
                        "totalDebtSum": "52394651469",
                        "totalCollateralLast": "2148233504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240110",
                        "dateKey": 20240110,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-10T00:30:02.735",
                        "totalDebtSum": "52062468962",
                        "totalCollateralLast": "2179733504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240111",
                        "dateKey": 20240111,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-11T00:30:04.577",
                        "totalDebtSum": "53891057514",
                        "totalCollateralLast": "2175733504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240112",
                        "dateKey": 20240112,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-12T00:30:01.703",
                        "totalDebtSum": "57641119536",
                        "totalCollateralLast": "2175733504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240113",
                        "dateKey": 20240113,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-13T00:30:04.848",
                        "totalDebtSum": "53186957568",
                        "totalCollateralLast": "2175733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240114",
                        "dateKey": 20240114,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-14T00:30:03.766",
                        "totalDebtSum": "53188042752",
                        "totalCollateralLast": "2175733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240115",
                        "dateKey": 20240115,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-15T00:30:03.252",
                        "totalDebtSum": "58070990127",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240116",
                        "dateKey": 20240116,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-16T00:30:02.288",
                        "totalDebtSum": "48416286912",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240117",
                        "dateKey": 20240117,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-17T00:30:01.822",
                        "totalDebtSum": "48417274752",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240118",
                        "dateKey": 20240118,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-18T00:30:04.302",
                        "totalDebtSum": "48418262592",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240119",
                        "dateKey": 20240119,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-19T00:30:05.102",
                        "totalDebtSum": "48419250432",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240120",
                        "dateKey": 20240120,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-20T00:30:03.358",
                        "totalDebtSum": "48420238272",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240121",
                        "dateKey": 20240121,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-21T00:30:04.597",
                        "totalDebtSum": "48421226112",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240122",
                        "dateKey": 20240122,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-22T00:30:01.002",
                        "totalDebtSum": "48422213952",
                        "totalCollateralLast": "2125733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240123",
                        "dateKey": 20240123,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-23T00:30:00.955",
                        "totalDebtSum": "50460211558",
                        "totalCollateralLast": "2128733504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240124",
                        "dateKey": 20240124,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-24T00:30:00.159",
                        "totalDebtSum": "48455209248",
                        "totalCollateralLast": "2128733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240125",
                        "dateKey": 20240125,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-25T00:30:00.421",
                        "totalDebtSum": "48456198240",
                        "totalCollateralLast": "2128733504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240126",
                        "dateKey": 20240126,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-26T00:30:03.021",
                        "totalDebtSum": "48518884091",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240127",
                        "dateKey": 20240127,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-27T00:30:03.55",
                        "totalDebtSum": "44844563064",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240128",
                        "dateKey": 20240128,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-28T00:30:04.108",
                        "totalDebtSum": "44845478328",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240129",
                        "dateKey": 20240129,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-29T00:30:08.495",
                        "totalDebtSum": "44846393592",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240130",
                        "dateKey": 20240130,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-30T00:30:05.541",
                        "totalDebtSum": "44847308856",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240131",
                        "dateKey": 20240131,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-31T00:30:01.92",
                        "totalDebtSum": "44848224120",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240131",
                        "dateKey": 20240131,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-01-31T00:30:01.92",
                        "totalDebtSum": "46716890591",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240201",
                        "dateKey": 20240201,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-01T00:30:02.71",
                        "totalDebtSum": "44849139384",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240202",
                        "dateKey": 20240202,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-02T00:30:03.621",
                        "totalDebtSum": "44850054648",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240203",
                        "dateKey": 20240203,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-03T00:30:04.609",
                        "totalDebtSum": "44850969912",
                        "totalCollateralLast": "2076233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240204",
                        "dateKey": 20240204,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-04T00:30:05.168",
                        "totalDebtSum": "46846367327",
                        "totalCollateralLast": "2082233504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240205",
                        "dateKey": 20240205,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-05T00:30:08.606",
                        "totalDebtSum": "45455803464",
                        "totalCollateralLast": "2082233504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240206",
                        "dateKey": 20240206,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-06T00:30:00.903",
                        "totalDebtSum": "53912238478",
                        "totalCollateralLast": "2103843504",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240207",
                        "dateKey": 20240207,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-07T00:30:00.055",
                        "totalDebtSum": "47869707768",
                        "totalCollateralLast": "2103843504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240208",
                        "dateKey": 20240208,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-08T00:30:04.923",
                        "totalDebtSum": "50091414373",
                        "totalCollateralLast": "2109093504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240209",
                        "dateKey": 20240209,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-09T00:30:02.903",
                        "totalDebtSum": "52544228804",
                        "totalCollateralLast": "2109093504",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240210",
                        "dateKey": 20240210,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-10T00:30:17.931",
                        "totalDebtSum": "48484051296",
                        "totalCollateralLast": "2109093504",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240211",
                        "dateKey": 20240211,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-11T00:30:00.994",
                        "totalDebtSum": "59993111737",
                        "totalCollateralLast": "2087563504",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240212",
                        "dateKey": 20240212,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-12T00:30:01.673",
                        "totalDebtSum": "47814231292",
                        "totalCollateralLast": "2083033504",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240213",
                        "dateKey": 20240213,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-13T00:30:12.661",
                        "totalDebtSum": "47619767796",
                        "totalCollateralLast": "2087051910",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240214",
                        "dateKey": 20240214,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-14T00:30:04.95",
                        "totalDebtSum": "48198662412",
                        "totalCollateralLast": "2091013398",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240215",
                        "dateKey": 20240215,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-15T00:30:04.088",
                        "totalDebtSum": "54101585359",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240216",
                        "dateKey": 20240216,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-16T00:30:03.856",
                        "totalDebtSum": "45407940564",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240217",
                        "dateKey": 20240217,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-17T00:30:05.968",
                        "totalDebtSum": "43365504672",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240218",
                        "dateKey": 20240218,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-18T00:30:01.947",
                        "totalDebtSum": "47016332788",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240219",
                        "dateKey": 20240219,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-19T00:30:05.001",
                        "totalDebtSum": "43377467808",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240220",
                        "dateKey": 20240220,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-20T00:30:02.687",
                        "totalDebtSum": "43378353120",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240221",
                        "dateKey": 20240221,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-21T00:30:04.05",
                        "totalDebtSum": "43379238432",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240222",
                        "dateKey": 20240222,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-22T00:30:03.151",
                        "totalDebtSum": "43380123744",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240223",
                        "dateKey": 20240223,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-23T00:30:05.784",
                        "totalDebtSum": "43381009056",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240224",
                        "dateKey": 20240224,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-24T00:30:01.477",
                        "totalDebtSum": "49453577609",
                        "totalCollateralLast": "2059513398",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "47532723360",
                        "totalCollateralLast": "2032094056",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "45743680252",
                        "totalCollateralLast": "2032094056",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240226",
                        "dateKey": 20240226,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-26T00:30:01.192",
                        "totalDebtSum": "40682147016",
                        "totalCollateralLast": "2032094056",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240227",
                        "dateKey": 20240227,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-27T00:30:06.53",
                        "totalDebtSum": "40682977032",
                        "totalCollateralLast": "2032094056",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240228",
                        "dateKey": 20240228,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-28T00:30:01.509",
                        "totalDebtSum": "40683807048",
                        "totalCollateralLast": "2032094056",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240229",
                        "dateKey": 20240229,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-02-29T00:30:03.641",
                        "totalDebtSum": "40684637064",
                        "totalCollateralLast": "2032094056",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240301",
                        "dateKey": 20240301,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-01T00:30:06.497",
                        "totalDebtSum": "50545848315",
                        "totalCollateralLast": "2050203102",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240302",
                        "dateKey": 20240302,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-02T00:30:09.372",
                        "totalDebtSum": "42512466720",
                        "totalCollateralLast": "2050203102",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240303",
                        "dateKey": 20240303,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-03T00:30:04.392",
                        "totalDebtSum": "44185690152",
                        "totalCollateralLast": "2046203102",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240304",
                        "dateKey": 20240304,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-04T00:30:04.668",
                        "totalDebtSum": "41919838272",
                        "totalCollateralLast": "2046203102",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240305",
                        "dateKey": 20240305,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-05T00:30:00.025",
                        "totalDebtSum": "43868415930",
                        "totalCollateralLast": "2069253102",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240306",
                        "dateKey": 20240306,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-06T00:30:12.551",
                        "totalDebtSum": "44333561376",
                        "totalCollateralLast": "2069253102",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240307",
                        "dateKey": 20240307,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-07T00:30:04.772",
                        "totalDebtSum": "46543227314",
                        "totalCollateralLast": "2046203102",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240308",
                        "dateKey": 20240308,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-08T00:30:04.173",
                        "totalDebtSum": "41958112224",
                        "totalCollateralLast": "2046203102",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240309",
                        "dateKey": 20240309,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-09T00:30:01.393",
                        "totalDebtSum": "45728516345",
                        "totalCollateralLast": "1994303102",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240310",
                        "dateKey": 20240310,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-10T00:30:03.891",
                        "totalDebtSum": "37793880432",
                        "totalCollateralLast": "1994303102",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240311",
                        "dateKey": 20240311,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-11T00:30:03.56",
                        "totalDebtSum": "47038486856",
                        "totalCollateralLast": "2099277121",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240312",
                        "dateKey": 20240312,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-12T00:30:04.616",
                        "totalDebtSum": "47583847968",
                        "totalCollateralLast": "2099277121",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240313",
                        "dateKey": 20240313,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-13T00:30:04.229",
                        "totalDebtSum": "47584819104",
                        "totalCollateralLast": "2099277121",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240314",
                        "dateKey": 20240314,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-14T00:30:01.853",
                        "totalDebtSum": "54814043427",
                        "totalCollateralLast": "2100277121",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240315",
                        "dateKey": 20240315,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-15T00:30:00.575",
                        "totalDebtSum": "52484655528",
                        "totalCollateralLast": "2100277121",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240316",
                        "dateKey": 20240316,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-16T00:30:01.003",
                        "totalDebtSum": "52485726312",
                        "totalCollateralLast": "2100277121",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager0.metrics:20240317",
                        "dateKey": 20240317,
                        "liquidatingCollateralBrand": "ATOM",
                        "blockTimeLast": "2024-03-17T00:30:05.254",
                        "totalDebtSum": "52486797096",
                        "totalCollateralLast": "2100277121",
                        "metricsCount": "24"
                    }
                ]
            },
            "ATOM_oracle": {
                "nodes": [
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231221",
                        "dateKey": 20231221,
                        "blockTimeLast": "2023-12-21T13:02:39",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11405293"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231222",
                        "dateKey": 20231222,
                        "blockTimeLast": "2023-12-22T00:04:37",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11398775"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231223",
                        "dateKey": 20231223,
                        "blockTimeLast": "2023-12-23T00:03:52",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11351962"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231224",
                        "dateKey": 20231224,
                        "blockTimeLast": "2023-12-24T00:01:30",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11257549"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231225",
                        "dateKey": 20231225,
                        "blockTimeLast": "2023-12-25T00:01:20",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11941571"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231226",
                        "dateKey": 20231226,
                        "blockTimeLast": "2023-12-26T00:04:14",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11617554"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231227",
                        "dateKey": 20231227,
                        "blockTimeLast": "2023-12-27T00:08:23",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11964039"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231228",
                        "dateKey": 20231228,
                        "blockTimeLast": "2023-12-28T00:08:52",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11446435"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231229",
                        "dateKey": 20231229,
                        "blockTimeLast": "2023-12-29T00:02:02",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10982322"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231230",
                        "dateKey": 20231230,
                        "blockTimeLast": "2023-12-30T00:04:14",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10781305"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20231231",
                        "dateKey": 20231231,
                        "blockTimeLast": "2023-12-31T00:03:02",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10591871"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240101",
                        "dateKey": 20240101,
                        "blockTimeLast": "2024-01-01T00:07:25",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11195855"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240102",
                        "dateKey": 20240102,
                        "blockTimeLast": "2024-01-02T00:02:59",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10969959"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240103",
                        "dateKey": 20240103,
                        "blockTimeLast": "2024-01-03T00:00:06",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9932792"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240104",
                        "dateKey": 20240104,
                        "blockTimeLast": "2024-01-04T00:05:53",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10263315"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240105",
                        "dateKey": 20240105,
                        "blockTimeLast": "2024-01-05T00:02:56",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10315009"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240106",
                        "dateKey": 20240106,
                        "blockTimeLast": "2024-01-06T00:08:43",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9830200"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240107",
                        "dateKey": 20240107,
                        "blockTimeLast": "2024-01-07T00:09:54",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9407157"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240108",
                        "dateKey": 20240108,
                        "blockTimeLast": "2024-01-08T00:06:43",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9960190"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240109",
                        "dateKey": 20240109,
                        "blockTimeLast": "2024-01-09T00:08:08",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9648980"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240110",
                        "dateKey": 20240110,
                        "blockTimeLast": "2024-01-10T00:05:37",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10411396"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240111",
                        "dateKey": 20240111,
                        "blockTimeLast": "2024-01-11T00:02:05",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10663633"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240112",
                        "dateKey": 20240112,
                        "blockTimeLast": "2024-01-12T00:08:29",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9946354"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240113",
                        "dateKey": 20240113,
                        "blockTimeLast": "2024-01-13T00:00:53",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10219611"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240114",
                        "dateKey": 20240114,
                        "blockTimeLast": "2024-01-14T00:03:36",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9979834"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240115",
                        "dateKey": 20240115,
                        "blockTimeLast": "2024-01-15T00:05:58",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10192393"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240116",
                        "dateKey": 20240116,
                        "blockTimeLast": "2024-01-16T00:08:40",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10290613"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240117",
                        "dateKey": 20240117,
                        "blockTimeLast": "2024-01-17T00:05:52",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10142709"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240118",
                        "dateKey": 20240118,
                        "blockTimeLast": "2024-01-18T00:06:04",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9694461"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240119",
                        "dateKey": 20240119,
                        "blockTimeLast": "2024-01-19T00:04:50",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9702062"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240120",
                        "dateKey": 20240120,
                        "blockTimeLast": "2024-01-20T00:00:35",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9820910"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240121",
                        "dateKey": 20240121,
                        "blockTimeLast": "2024-01-21T00:03:13",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9649444"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240122",
                        "dateKey": 20240122,
                        "blockTimeLast": "2024-01-22T00:00:56",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9171654"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240123",
                        "dateKey": 20240123,
                        "blockTimeLast": "2024-01-23T00:04:34",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9214221"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240124",
                        "dateKey": 20240124,
                        "blockTimeLast": "2024-01-24T00:09:02",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9355507"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240125",
                        "dateKey": 20240125,
                        "blockTimeLast": "2024-01-25T00:01:31",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9228967"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240126",
                        "dateKey": 20240126,
                        "blockTimeLast": "2024-01-26T00:02:44",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9634132"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240127",
                        "dateKey": 20240127,
                        "blockTimeLast": "2024-01-27T00:08:16",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9672280"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240128",
                        "dateKey": 20240128,
                        "blockTimeLast": "2024-01-28T00:09:24",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9426322"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240129",
                        "dateKey": 20240129,
                        "blockTimeLast": "2024-01-29T00:08:11",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9662118"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240130",
                        "dateKey": 20240130,
                        "blockTimeLast": "2024-01-30T00:05:15",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9386459"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240131",
                        "dateKey": 20240131,
                        "blockTimeLast": "2024-01-31T00:00:08",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9096013"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240131",
                        "dateKey": 20240131,
                        "blockTimeLast": "2024-01-31T00:00:08",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9096013"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240201",
                        "dateKey": 20240201,
                        "blockTimeLast": "2024-02-01T00:00:53",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9131103"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240202",
                        "dateKey": 20240202,
                        "blockTimeLast": "2024-02-02T00:01:07",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9159130"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240203",
                        "dateKey": 20240203,
                        "blockTimeLast": "2024-02-03T00:03:37",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9052964"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240204",
                        "dateKey": 20240204,
                        "blockTimeLast": "2024-02-04T00:04:37",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "8960754"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240205",
                        "dateKey": 20240205,
                        "blockTimeLast": "2024-02-05T00:00:05",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9046519"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240206",
                        "dateKey": 20240206,
                        "blockTimeLast": "2024-02-06T00:09:58",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9137945"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240207",
                        "dateKey": 20240207,
                        "blockTimeLast": "2024-02-07T00:00:15",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9585330"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240208",
                        "dateKey": 20240208,
                        "blockTimeLast": "2024-02-08T00:04:09",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9642213"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240209",
                        "dateKey": 20240209,
                        "blockTimeLast": "2024-02-09T00:04:07",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10021974"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240210",
                        "dateKey": 20240210,
                        "blockTimeLast": "2024-02-10T00:09:21",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9970865"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240211",
                        "dateKey": 20240211,
                        "blockTimeLast": "2024-02-11T00:04:57",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9719070"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240212",
                        "dateKey": 20240212,
                        "blockTimeLast": "2024-02-12T00:01:39",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9945465"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240213",
                        "dateKey": 20240213,
                        "blockTimeLast": "2024-02-13T00:06:13",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10298798"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240214",
                        "dateKey": 20240214,
                        "blockTimeLast": "2024-02-14T00:07:55",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10240664"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240215",
                        "dateKey": 20240215,
                        "blockTimeLast": "2024-02-15T00:07:25",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10334934"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240216",
                        "dateKey": 20240216,
                        "blockTimeLast": "2024-02-16T00:06:13",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10238759"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240217",
                        "dateKey": 20240217,
                        "blockTimeLast": "2024-02-17T00:03:52",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10277295"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240218",
                        "dateKey": 20240218,
                        "blockTimeLast": "2024-02-18T00:00:11",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10590381"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240219",
                        "dateKey": 20240219,
                        "blockTimeLast": "2024-02-19T00:08:55",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10749689"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240220",
                        "dateKey": 20240220,
                        "blockTimeLast": "2024-02-20T00:02:02",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10363508"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240221",
                        "dateKey": 20240221,
                        "blockTimeLast": "2024-02-21T00:06:44",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9982166"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240222",
                        "dateKey": 20240222,
                        "blockTimeLast": "2024-02-22T00:05:45",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9801244"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240223",
                        "dateKey": 20240223,
                        "blockTimeLast": "2024-02-23T00:04:02",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "9977247"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240224",
                        "dateKey": 20240224,
                        "blockTimeLast": "2024-02-24T00:00:45",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10413039"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:04:00",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10374290"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:04:00",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "10374290"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240226",
                        "dateKey": 20240226,
                        "blockTimeLast": "2024-02-26T00:00:12",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11142729"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240227",
                        "dateKey": 20240227,
                        "blockTimeLast": "2024-02-27T00:03:00",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11216721"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240228",
                        "dateKey": 20240228,
                        "blockTimeLast": "2024-02-28T00:08:51",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11434160"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240229",
                        "dateKey": 20240229,
                        "blockTimeLast": "2024-02-29T00:00:57",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11293768"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240301",
                        "dateKey": 20240301,
                        "blockTimeLast": "2024-03-01T00:05:06",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11639524"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240302",
                        "dateKey": 20240302,
                        "blockTimeLast": "2024-03-02T00:07:00",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12187805"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240303",
                        "dateKey": 20240303,
                        "blockTimeLast": "2024-03-03T00:05:45",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12164272"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240304",
                        "dateKey": 20240304,
                        "blockTimeLast": "2024-03-04T00:06:58",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12472966"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240305",
                        "dateKey": 20240305,
                        "blockTimeLast": "2024-03-05T00:01:05",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12033977"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240306",
                        "dateKey": 20240306,
                        "blockTimeLast": "2024-03-06T00:08:11",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14176290"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240307",
                        "dateKey": 20240307,
                        "blockTimeLast": "2024-03-07T00:04:44",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13929000"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240308",
                        "dateKey": 20240308,
                        "blockTimeLast": "2024-03-08T00:00:19",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13424173"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240309",
                        "dateKey": 20240309,
                        "blockTimeLast": "2024-03-09T00:10:29",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13375323"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240310",
                        "dateKey": 20240310,
                        "blockTimeLast": "2024-03-10T00:08:18",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13176239"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240311",
                        "dateKey": 20240311,
                        "blockTimeLast": "2024-03-11T00:01:00",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13710746"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240312",
                        "dateKey": 20240312,
                        "blockTimeLast": "2024-03-12T00:11:02",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13418043"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240313",
                        "dateKey": 20240313,
                        "blockTimeLast": "2024-03-13T00:06:03",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14040422"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240314",
                        "dateKey": 20240314,
                        "blockTimeLast": "2024-03-14T00:01:41",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13664114"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240315",
                        "dateKey": 20240315,
                        "blockTimeLast": "2024-03-15T00:00:20",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12641459"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240316",
                        "dateKey": 20240316,
                        "blockTimeLast": "2024-03-16T00:01:34",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "11930701"
                    },
                    {
                        "id": "published.priceFeed.ATOM-USD_price_feed:20240317",
                        "dateKey": 20240317,
                        "blockTimeLast": "2024-03-17T00:05:11",
                        "typeInName": "ATOM",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12259106"
                    }
                ]
            },
            "stTIA": {
                "nodes": [
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240214",
                        "dateKey": 20240214,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-14T17:26:10.263",
                        "totalDebtSum": "1791253699",
                        "totalCollateralLast": "14776468",
                        "metricsCount": "13"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240215",
                        "dateKey": 20240215,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-15T00:30:04.088",
                        "totalDebtSum": "3844208912",
                        "totalCollateralLast": "14776468",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240216",
                        "dateKey": 20240216,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-16T00:30:03.856",
                        "totalDebtSum": "1976425206",
                        "totalCollateralLast": "741224189",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240217",
                        "dateKey": 20240217,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-17T00:30:05.968",
                        "totalDebtSum": "13716748086",
                        "totalCollateralLast": "825046001",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240218",
                        "dateKey": 20240218,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-18T00:30:01.947",
                        "totalDebtSum": "14635617705",
                        "totalCollateralLast": "829046001",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240219",
                        "dateKey": 20240219,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-19T00:30:05.001",
                        "totalDebtSum": "15113310945",
                        "totalCollateralLast": "834046001",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240220",
                        "dateKey": 20240220,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-20T00:30:02.687",
                        "totalDebtSum": "20892394185",
                        "totalCollateralLast": "942046001",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240221",
                        "dateKey": 20240221,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-21T00:30:04.05",
                        "totalDebtSum": "35827817096",
                        "totalCollateralLast": "1043437578",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240222",
                        "dateKey": 20240222,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-22T00:05:21.298",
                        "totalDebtSum": "45472664154",
                        "totalCollateralLast": "1152437578",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240223",
                        "dateKey": 20240223,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-23T00:30:05.784",
                        "totalDebtSum": "54251652277",
                        "totalCollateralLast": "1170642679",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240224",
                        "dateKey": 20240224,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-24T00:30:01.477",
                        "totalDebtSum": "50177033416",
                        "totalCollateralLast": "1193370908",
                        "metricsCount": "25"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "1130180678300",
                        "totalCollateralLast": "14737903581",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240225",
                        "dateKey": 20240225,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-25T00:30:05.363",
                        "totalDebtSum": "1177585050033",
                        "totalCollateralLast": "14737903581",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240226",
                        "dateKey": 20240226,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-26T00:30:01.192",
                        "totalDebtSum": "1811073598661",
                        "totalCollateralLast": "15701153271",
                        "metricsCount": "36"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240227",
                        "dateKey": 20240227,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-27T00:30:06.53",
                        "totalDebtSum": "2740271099415",
                        "totalCollateralLast": "23797490501",
                        "metricsCount": "42"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240228",
                        "dateKey": 20240228,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-28T00:09:03.789",
                        "totalDebtSum": "9049260710275",
                        "totalCollateralLast": "53682380533",
                        "metricsCount": "61"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240229",
                        "dateKey": 20240229,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-02-29T00:30:03.641",
                        "totalDebtSum": "9255434164892",
                        "totalCollateralLast": "71874656354",
                        "metricsCount": "40"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240301",
                        "dateKey": 20240301,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-01T00:06:59.294",
                        "totalDebtSum": "10672810159280",
                        "totalCollateralLast": "68969748746",
                        "metricsCount": "40"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240302",
                        "dateKey": 20240302,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-02T00:30:09.372",
                        "totalDebtSum": "10184994624206",
                        "totalCollateralLast": "56510229726",
                        "metricsCount": "38"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240303",
                        "dateKey": 20240303,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-03T00:30:04.392",
                        "totalDebtSum": "7312043490974",
                        "totalCollateralLast": "56645976325",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240304",
                        "dateKey": 20240304,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-04T00:30:04.668",
                        "totalDebtSum": "8580636027598",
                        "totalCollateralLast": "57145606425",
                        "metricsCount": "34"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240305",
                        "dateKey": 20240305,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-05T00:00:59.425",
                        "totalDebtSum": "8501349384360",
                        "totalCollateralLast": "64401885604",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240306",
                        "dateKey": 20240306,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-06T00:30:12.551",
                        "totalDebtSum": "10114092534614",
                        "totalCollateralLast": "64313937306",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240307",
                        "dateKey": 20240307,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-07T00:30:04.772",
                        "totalDebtSum": "13597762444379",
                        "totalCollateralLast": "68557502704",
                        "metricsCount": "40"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240308",
                        "dateKey": 20240308,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-08T00:30:04.173",
                        "totalDebtSum": "12466283282688",
                        "totalCollateralLast": "86089544795",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240309",
                        "dateKey": 20240309,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-09T00:30:01.393",
                        "totalDebtSum": "10697902974297",
                        "totalCollateralLast": "86690773089",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240310",
                        "dateKey": 20240310,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-10T00:30:03.891",
                        "totalDebtSum": "10331410723597",
                        "totalCollateralLast": "86710223104",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240311",
                        "dateKey": 20240311,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-11T00:30:03.56",
                        "totalDebtSum": "11139722619480",
                        "totalCollateralLast": "86843791206",
                        "metricsCount": "28"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240312",
                        "dateKey": 20240312,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-12T00:30:04.616",
                        "totalDebtSum": "10787153970178",
                        "totalCollateralLast": "86843791206",
                        "metricsCount": "27"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240313",
                        "dateKey": 20240313,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-13T00:30:04.229",
                        "totalDebtSum": "14035830497898",
                        "totalCollateralLast": "87187110759",
                        "metricsCount": "35"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240314",
                        "dateKey": 20240314,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-14T00:30:01.853",
                        "totalDebtSum": "15406934670297",
                        "totalCollateralLast": "88055658322",
                        "metricsCount": "38"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240315",
                        "dateKey": 20240315,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-15T00:30:00.575",
                        "totalDebtSum": "19929115642438",
                        "totalCollateralLast": "75048379941",
                        "metricsCount": "56"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240316",
                        "dateKey": 20240316,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-16T00:30:01.003",
                        "totalDebtSum": "17634623593043",
                        "totalCollateralLast": "71404620112",
                        "metricsCount": "57"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240317",
                        "dateKey": 20240317,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-17T00:30:05.254",
                        "totalDebtSum": "9938593115286",
                        "totalCollateralLast": "71663814710",
                        "metricsCount": "38"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240318",
                        "dateKey": 20240318,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-18T00:30:03.524",
                        "totalDebtSum": "12756432695630",
                        "totalCollateralLast": "77714051630",
                        "metricsCount": "47"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240319",
                        "dateKey": 20240319,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-19T00:02:28.206",
                        "totalDebtSum": "16390316055862",
                        "totalCollateralLast": "83079339168",
                        "metricsCount": "58"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240320",
                        "dateKey": 20240320,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-20T00:30:03.46",
                        "totalDebtSum": "9880863314014",
                        "totalCollateralLast": "83278656009",
                        "metricsCount": "34"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240321",
                        "dateKey": 20240321,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-21T00:30:00.084",
                        "totalDebtSum": "10935336226419",
                        "totalCollateralLast": "83663390584",
                        "metricsCount": "37"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240322",
                        "dateKey": 20240322,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-22T00:30:04.587",
                        "totalDebtSum": "10481825598769",
                        "totalCollateralLast": "98406002986",
                        "metricsCount": "35"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240323",
                        "dateKey": 20240323,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-23T00:30:02.32",
                        "totalDebtSum": "10582954850335",
                        "totalCollateralLast": "104490698368",
                        "metricsCount": "34"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240324",
                        "dateKey": 20240324,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-24T00:25:07.276",
                        "totalDebtSum": "9918966374602",
                        "totalCollateralLast": "104495474668",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240325",
                        "dateKey": 20240325,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-25T00:30:00.506",
                        "totalDebtSum": "10200825455616",
                        "totalCollateralLast": "103536422840",
                        "metricsCount": "32"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240326",
                        "dateKey": 20240326,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-26T00:30:04.031",
                        "totalDebtSum": "8226454678928",
                        "totalCollateralLast": "103687297375",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240327",
                        "dateKey": 20240327,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-27T00:30:01.842",
                        "totalDebtSum": "8379624943662",
                        "totalCollateralLast": "103676645854",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240328",
                        "dateKey": 20240328,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-28T00:30:10.61",
                        "totalDebtSum": "11026020487923",
                        "totalCollateralLast": "106555860851",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240329",
                        "dateKey": 20240329,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-29T00:30:04.456",
                        "totalDebtSum": "10567801124345",
                        "totalCollateralLast": "108215736928",
                        "metricsCount": "31"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240330",
                        "dateKey": 20240330,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-30T00:30:01.695",
                        "totalDebtSum": "16057208688428",
                        "totalCollateralLast": "107897167779",
                        "metricsCount": "47"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240331",
                        "dateKey": 20240331,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-03-31T00:30:01.247",
                        "totalDebtSum": "9815266680906",
                        "totalCollateralLast": "107952761161",
                        "metricsCount": "29"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240401",
                        "dateKey": 20240401,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-01T00:30:02.592",
                        "totalDebtSum": "12962194018031",
                        "totalCollateralLast": "108133381402",
                        "metricsCount": "38"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240402",
                        "dateKey": 20240402,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-02T00:30:05.546",
                        "totalDebtSum": "12744039303268",
                        "totalCollateralLast": "107677090516",
                        "metricsCount": "37"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240402",
                        "dateKey": 20240402,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-02T00:30:05.546",
                        "totalDebtSum": "13083396164757",
                        "totalCollateralLast": "107677090516",
                        "metricsCount": "38"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240403",
                        "dateKey": 20240403,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-03T00:47:44.058",
                        "totalDebtSum": "16054206902165",
                        "totalCollateralLast": "107509281156",
                        "metricsCount": "46"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240403",
                        "dateKey": 20240403,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-03T00:47:44.058",
                        "totalDebtSum": "16054206902165",
                        "totalCollateralLast": "107509281156",
                        "metricsCount": "46"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240404",
                        "dateKey": 20240404,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-04T00:30:27.545",
                        "totalDebtSum": "9888075503698",
                        "totalCollateralLast": "107508559870",
                        "metricsCount": "30"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240405",
                        "dateKey": 20240405,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-05T00:30:08.323",
                        "totalDebtSum": "7911744840585",
                        "totalCollateralLast": "107539213826",
                        "metricsCount": "24"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240406",
                        "dateKey": 20240406,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-06T00:30:00.058",
                        "totalDebtSum": "10958481386826",
                        "totalCollateralLast": "107845583339",
                        "metricsCount": "33"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240407",
                        "dateKey": 20240407,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-07T00:30:02.395",
                        "totalDebtSum": "8757659589625",
                        "totalCollateralLast": "107785583339",
                        "metricsCount": "26"
                    },
                    {
                        "id": "published.vaultFactory.managers.manager3.metrics:20240408",
                        "dateKey": 20240408,
                        "liquidatingCollateralBrand": "stTIA",
                        "blockTimeLast": "2024-04-08T00:30:00.465",
                        "totalDebtSum": "5628058833504",
                        "totalCollateralLast": "107785583339",
                        "metricsCount": "16"
                    }
                ]
            },
            "stTIA_oracle": {
                "nodes": [
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240214",
                        "dateKey": 20240214,
                        "blockTimeLast": "2024-02-14T17:36:19",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "19267969"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240215",
                        "dateKey": 20240215,
                        "blockTimeLast": "2024-02-15T00:02:46",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18322740"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240216",
                        "dateKey": 20240216,
                        "blockTimeLast": "2024-02-16T00:01:20",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18637703"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240217",
                        "dateKey": 20240217,
                        "blockTimeLast": "2024-02-17T00:09:22",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18572000"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240218",
                        "dateKey": 20240218,
                        "blockTimeLast": "2024-02-18T00:02:27",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18744349"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240219",
                        "dateKey": 20240219,
                        "blockTimeLast": "2024-02-19T00:08:07",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18854455"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240220",
                        "dateKey": 20240220,
                        "blockTimeLast": "2024-02-20T00:05:05",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18080618"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240221",
                        "dateKey": 20240221,
                        "blockTimeLast": "2024-02-21T00:01:39",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17465108"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240222",
                        "dateKey": 20240222,
                        "blockTimeLast": "2024-02-22T00:06:46",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17036976"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240223",
                        "dateKey": 20240223,
                        "blockTimeLast": "2024-02-23T00:04:02",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16495745"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240224",
                        "dateKey": 20240224,
                        "blockTimeLast": "2024-02-24T00:08:04",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17156061"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:01:09",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16900091"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240225",
                        "dateKey": 20240225,
                        "blockTimeLast": "2024-02-25T00:01:09",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16900091"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240226",
                        "dateKey": 20240226,
                        "blockTimeLast": "2024-02-26T00:00:12",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17472026"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240227",
                        "dateKey": 20240227,
                        "blockTimeLast": "2024-02-27T00:06:58",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17136395"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240228",
                        "dateKey": 20240228,
                        "blockTimeLast": "2024-02-28T00:00:02",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16648785"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240229",
                        "dateKey": 20240229,
                        "blockTimeLast": "2024-02-29T00:02:43",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16662433"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240301",
                        "dateKey": 20240301,
                        "blockTimeLast": "2024-03-01T00:07:55",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17173541"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240302",
                        "dateKey": 20240302,
                        "blockTimeLast": "2024-03-02T00:09:35",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16904191"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240303",
                        "dateKey": 20240303,
                        "blockTimeLast": "2024-03-03T00:03:08",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16558500"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240304",
                        "dateKey": 20240304,
                        "blockTimeLast": "2024-03-04T00:00:50",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15849089"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240305",
                        "dateKey": 20240305,
                        "blockTimeLast": "2024-03-05T00:02:45",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15732488"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240306",
                        "dateKey": 20240306,
                        "blockTimeLast": "2024-03-06T00:08:17",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16328826"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240307",
                        "dateKey": 20240307,
                        "blockTimeLast": "2024-03-07T00:03:36",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16913409"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240308",
                        "dateKey": 20240308,
                        "blockTimeLast": "2024-03-08T00:06:33",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16375182"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240309",
                        "dateKey": 20240309,
                        "blockTimeLast": "2024-03-09T00:04:47",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16935439"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240310",
                        "dateKey": 20240310,
                        "blockTimeLast": "2024-03-10T00:04:06",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16218420"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240311",
                        "dateKey": 20240311,
                        "blockTimeLast": "2024-03-11T00:01:50",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16713038"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240312",
                        "dateKey": 20240312,
                        "blockTimeLast": "2024-03-12T00:00:29",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "18188374"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240313",
                        "dateKey": 20240313,
                        "blockTimeLast": "2024-03-13T00:04:09",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "17456801"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240314",
                        "dateKey": 20240314,
                        "blockTimeLast": "2024-03-14T00:07:07",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "16728958"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240315",
                        "dateKey": 20240315,
                        "blockTimeLast": "2024-03-15T00:01:50",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15513240"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240316",
                        "dateKey": 20240316,
                        "blockTimeLast": "2024-03-16T00:08:44",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13901438"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240317",
                        "dateKey": 20240317,
                        "blockTimeLast": "2024-03-17T00:03:32",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14402122"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240318",
                        "dateKey": 20240318,
                        "blockTimeLast": "2024-03-18T00:06:06",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13118222"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240319",
                        "dateKey": 20240319,
                        "blockTimeLast": "2024-03-19T00:04:16",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13853272"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240320",
                        "dateKey": 20240320,
                        "blockTimeLast": "2024-03-20T00:03:38",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15047153"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240321",
                        "dateKey": 20240321,
                        "blockTimeLast": "2024-03-21T00:02:18",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15010771"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240322",
                        "dateKey": 20240322,
                        "blockTimeLast": "2024-03-22T00:05:54",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13965926"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240323",
                        "dateKey": 20240323,
                        "blockTimeLast": "2024-03-23T00:01:19",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13610994"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240324",
                        "dateKey": 20240324,
                        "blockTimeLast": "2024-03-24T00:06:35",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13864047"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240325",
                        "dateKey": 20240325,
                        "blockTimeLast": "2024-03-25T00:03:44",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14305493"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240326",
                        "dateKey": 20240326,
                        "blockTimeLast": "2024-03-26T00:00:23",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14092655"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240327",
                        "dateKey": 20240327,
                        "blockTimeLast": "2024-03-27T00:03:32",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14119799"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240328",
                        "dateKey": 20240328,
                        "blockTimeLast": "2024-03-28T00:01:47",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14380056"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240329",
                        "dateKey": 20240329,
                        "blockTimeLast": "2024-03-29T00:02:23",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "15554757"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240330",
                        "dateKey": 20240330,
                        "blockTimeLast": "2024-03-30T00:07:01",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14730778"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240331",
                        "dateKey": 20240331,
                        "blockTimeLast": "2024-03-31T00:03:25",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "14570574"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240401",
                        "dateKey": 20240401,
                        "blockTimeLast": "2024-04-01T00:07:19",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13423490"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240402",
                        "dateKey": 20240402,
                        "blockTimeLast": "2024-04-02T00:00:53",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12377282"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240402",
                        "dateKey": 20240402,
                        "blockTimeLast": "2024-04-02T00:00:53",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12377282"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240403",
                        "dateKey": 20240403,
                        "blockTimeLast": "2024-04-03T01:35:37",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12240859"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240403",
                        "dateKey": 20240403,
                        "blockTimeLast": "2024-04-03T01:35:37",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12240859"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240404",
                        "dateKey": 20240404,
                        "blockTimeLast": "2024-04-04T00:00:54",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12542532"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240405",
                        "dateKey": 20240405,
                        "blockTimeLast": "2024-04-05T00:04:14",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12101682"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240406",
                        "dateKey": 20240406,
                        "blockTimeLast": "2024-04-06T00:08:37",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12283508"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240407",
                        "dateKey": 20240407,
                        "blockTimeLast": "2024-04-07T00:04:26",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "12481543"
                    },
                    {
                        "id": "published.priceFeed.stTIA-USD_price_feed:20240408",
                        "dateKey": 20240408,
                        "blockTimeLast": "2024-04-08T00:01:26",
                        "typeInName": "stTIA",
                        "typeInAmountLast": "1000000",
                        "typeOutAmountLast": "13025728"
                    }
                ]
            }
        }
    }
}