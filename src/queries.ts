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