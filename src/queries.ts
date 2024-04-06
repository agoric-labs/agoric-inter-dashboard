export const PSM_DASHBOARD_QUERY = `
query {
    _metadata {
        lastProcessedHeight
    }
    psmMetrics {
        nodes {
            blockHeight
            token
            mintedPoolBalance
        }
    }
    psmGovernances {
        nodes {
            mintLimit
            token
        }
    }
}`;

export const PSM_GRAPH_TOKENS_QUERY = `
query {
    psmMetrics {
        nodes {
            id
            token
        }
    }
}`;

export const PSM_TOKEN_DAILY_MINT_QUERY = (tokens: Array<string>) => `
query {
    ${tokens.map((token: string) => `
        ${token}: psmMetricDailies(first: 90, filter: {token: {equalTo: "${token}"}}, orderBy:DATE_KEY_DESC) {
        nodes {
                id
                token
                dateKey
                blockTimeLast
                totalMintedProvidedLast
            }
        }`
)}
}`

export const VAULTS_DASHBOARD_QUERY = `
query {
    vaultManagerMetrics {
        nodes {
            id
            numActiveVaults
            totalCollateral
            totalDebt
            liquidatingCollateralBrand
        }
    }
    oraclePrices {
        nodes {
            priceFeedName
            typeOutAmount
            typeInAmount
        }
    }
    boardAuxes {
        nodes {
            allegedName
            decimalPlaces
        }
    }
    vaultManagerGovernances {
        nodes {
            id
            debtLimit
        }
    }
}`;

export const OPEN_VAULTS_QUERY = `
query {
    vaults {
        nodes {
            id
            token
            balance
            state
            debt
        }
    }
    oraclePrices {
        nodes {
            priceFeedName
            typeOutAmount
            typeInAmount
        }
    }
    vaultManagerGovernances {
        nodes {
            id
            liquidationMarginNumerator
            liquidationMarginDenominator
        }
    }
}`;

export const RESERVE_DASHBOARD_QUERY = `
query {
    reserveMetrics {
        nodes {
            shortfallBalance
            allocations {
                nodes {
                    id
                    token
                    value
                }
            }
        }
    }
    oraclePrices {
        nodes {
            id
            typeInName
            typeOutName
            typeInAmount
            typeOutAmount
        }
    }
}`

export const INTER_DASHBOARD_QUERY = `
query {
    psmMetrics {
        nodes {
            token
            mintedPoolBalance
            anchorPoolBalance
            mintedPoolBalance
        }
    }
    psmGovernances {
        nodes {
            token
            mintLimit
        }
    }
    vaultManagerMetrics {
        nodes {
            id
            liquidatingCollateralBrand
            liquidatingDebtBrand
            totalDebt
            totalCollateral
        }
    }
    vaultManagerGovernances {
        nodes {
            id
            debtLimit
        }
    }
    reserveMetrics {
        nodes {
            totalFeeBurned
            shortfallBalance
            allocations {
                nodes {
                    id
                    token
                    value
                }
            }
        }
    }
    wallets {
        totalCount
    }
    oraclePrices {
        nodes {
            id
            typeInName
            typeOutName
            typeInAmount
            typeOutAmount
            priceFeedName
        }
    }
}`
