import { getDateKey, range } from "./utils";

export const PSM_DASHBOARD_QUERY = `
query {
    _metadata {
        lastProcessedHeight
    }
    psmMetrics {
        nodes {
            blockHeight
            denom
            mintedPoolBalance
        }
    }
    psmGovernances {
        nodes {
            mintLimit
            denom
        }
    }
    boardAuxes {
        nodes {
            allegedName
            decimalPlaces
        }
    }
}`;

export const PSM_GRAPH_TOKENS_QUERY = `
query {
    psmMetrics {
        nodes {
            id
            denom
        }
    }
}`;

export const PSM_TOKEN_DAILY_MINT_QUERY = (tokens: Array<string>) => `
query {
    ${tokens?.map((token: string) => `
        ${token}: psmMetricsDailies(first: 90, filter: {denom: {equalTo: "${token}"}}, orderBy:DATE_KEY_DESC) {
        nodes {
                id
                denom
                dateKey
                blockTimeLast
                totalMintedProvidedLast
            }
        }`
)}
}`
const currentDate = new Date();
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
            liquidationMarginNumerator
            liquidationMarginDenominator
        }
    }
    vaults(filter: {state: {equalTo: "active"}}) {
        nodes {
            id
            denom
            balance
            state
            debt
            blockTime
        }
        totalCount
    }
    oraclePriceDailies(filter: {
        dateKey: { 
            in: [${getDateKey(currentDate).key}, ${getDateKey(currentDate, 1).key}] 
        }
    }) {
        nodes {
            typeInName
            typeInAmountLast
            typeOutAmountLast
            dateKey
        }
    }
}`;

export const OPEN_VAULTS_NEXT_PAGES_QUERY = (pages: number) => `
query {
    ${range(pages).map(index => `v${index}:vaults(filter: {state: {equalTo: "active"}}, first: 100, offset:${(index + 1) * 100}) {
        nodes {
            id
            denom
            balance
            state
            debt
            blockTime
        }
    }`)}
}`

export const VAULTS_DAILY_METRICS_QUERY = (tokens: string[]) => `
query {
    ${tokens?.map((token) =>
    `${token}: vaultManagerMetricsDailies(first: 90, filter:{liquidatingCollateralBrand: {equalTo: "${token}"} }, orderBy:DATE_KEY_DESC)  {
        nodes {
            id
            dateKey
            liquidatingCollateralBrand
            blockTimeLast
            totalCollateralLast
            metricsCount
            totalDebtLast
        }
    }
    ${token}_oracle: oraclePriceDailies (first: 90, filter:{typeInName: {equalTo: "${token}"}}, orderBy:DATE_KEY_DESC ) {
        nodes {
            id
            dateKey
            blockTimeLast
            typeInName
            typeInAmountLast
            typeOutAmountLast
        }
    }`)}
}`

export const RESERVE_DASHBOARD_QUERY = `
query {
    reserveMetrics {
        nodes {
            shortfallBalance
            allocations {
                nodes {
                    id
                    denom
                    value
                }
            }
        }
    }
    oraclePrices {
        nodes {
            typeInName
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
}`


export const RESERVE_GRAPH_TOKENS_QUERY = `
query {
    reserveMetrics {
        nodes {
            allocations {
                nodes {
                    id
                    denom
                }
            }
        }
    }
}`

export const RESERVE_DAILY_METRICS_QUERY = (tokens: string[], startDate: number) => `
query {
    ${tokens?.map((token) =>
    `${token}: reserveAllocationMetricsDailies (first: 90, filter: {denom: {equalTo: "${token}"}}, orderBy:DATE_KEY_DESC) {
        nodes {
            id
            blockTimeLast
            dateKey
            valueLast
            denom
        }
    }
    ${token}_oracle: oraclePriceDailies (first: 90, filter: {typeInName: {equalTo: "${token}"}}, orderBy:DATE_KEY_DESC) {
        nodes {
          dateKey
          blockTimeLast
          typeInName
          typeInAmountLast
          typeOutAmountLast
        }
    }
    ${token}_last: reserveAllocationMetricsDailies (first: 1, filter: {denom: {equalTo: "${token}"}, valueLast: {greaterThan: "0" }, dateKey: {lessThan: ${startDate}}}, orderBy:DATE_KEY_DESC) {
        nodes {
          id
          blockTimeLast
          dateKey
          valueLast
          denom
        }
    }`)}
}`

export const INTER_DASHBOARD_QUERY = `
query {
    psmMetrics {
        nodes {
            denom
            mintedPoolBalance
            anchorPoolBalance
            mintedPoolBalance
        }
    }
    psmGovernances {
        nodes {
            denom
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
                    denom
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
    boardAuxes {
        nodes {
            allegedName
            decimalPlaces
        }
    }
}`

export const LIQUIDATIONS_DASHBOARD = `
query {
    boardAuxes {
        nodes {
            allegedName
            decimalPlaces
        }
    }
    vaultManagerMetrics {
        nodes {
            id
            numLiquidationsCompleted
            liquidatingCollateralValue
            numActiveVaults
            numLiquidationsCompleted
            numLiquidationsAborted
            numLiquidatingVaults
        }
    }
    vaultLiquidations (filter: {state: {equalTo: "liquidated"}}) {
        nodes {
            id
            denom
            debt
            state
            balance
            blockTime
            oraclePrice
            vaultManagerGovernance
            currentState {
                id
                denom
                debt
                state
                balance
                blockTime
            }
            liquidatingState {
                id
                denom
                debt
                state
                balance
                blockTime
            }
        }
    }
}`;

export const VAULT_STATE_DAILIES_QUERY = `
query {
    vaultStatesDailies  ( first: 90, orderBy: ID_DESC, offset: 1) {
        nodes {
            id
            blockTimeLast
            active
            closed
            liquidated
            liquidating
            liquidatedClosed
        }
    }
}`
