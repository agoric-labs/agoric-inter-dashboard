import { range } from './utils';

export const graphqlQuery = {
  query: `
    {
      _metadata{
        lastProcessedHeight
        lastProcessedTimestamp
      }
      oraclePrices {
        nodes {
          typeInName
          typeOutName
          typeInAmount
          typeOutAmount
          blockTime
          blockHeight
        }
      }
      oraclePriceDailies (filter: {dateKey: { greaterThan: 20240501 } }, orderBy: DATE_KEY_DESC) {
        nodes {
          typeInName
          typeOutName
          typeInAmountLast
          typeOutAmountLast
          blockTimeLast
          blockHeightLast
        }
        totalCount
      }
      vaultManagerMetrics {
        nodes {
          id
          blockTime
          blockHeight
          totalCollateral
          totalDebt
          totalCollateralSold
          totalShortfallReceived
          liquidatingCollateralValue
          liquidatingDebtBrand
          liquidatingCollateralBrand
        }
      }
      vaultManagerGovernances  {
        nodes {
          id
          blockTime
          blockHeight
          debtLimit
          liquidationMarginNumerator
          liquidationMarginDenominator
        }
      }
      vaults (filter: {state: {equalTo: "active"}}) {
        nodes {
          id
          blockTime
          blockHeight
          denom
          balance
          state
          debt
          lockedValue
          coin
        }
        totalCount
      }
      vaultLiquidations (filter: {state: {equalTo: "liquidated"}}) {
        nodes {
            id
            blockTime
            blockHeight
            denom
            debt
            state
            balance
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
        totalCount
    }
    }`,
};

export const PAGINATINATED_DATA_QUERIES = (vaultsPagesCount, vaultLiquidationsPagesCount, oraclePriceDailiesPagesCount) => ({
  query: `{
    ${range(vaultsPagesCount).map(
      (index) => `vaults_${index}:vaults (filter: {state: {equalTo: "active"}}, first: 100, offset:${(index + 1) * 100}) {
      nodes {
        id
        blockTime
        blockHeight
        denom
        balance
        state
        debt
        lockedValue
        coin
      }
    }`
    )}
    ${range(vaultLiquidationsPagesCount).map(
      (index) => `vaultLiquidations_${index}:vaultLiquidations (filter: {state: {equalTo: "liquidated"}}, first: 100, offset:${
        (index + 1) * 100
      }) {
      nodes {
        id
        blockTime
        blockHeight
        denom
        debt
        state
        balance
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
    }`
    )}    
    ${range(oraclePriceDailiesPagesCount).map(
      (
        index
      ) => `oraclePriceDailies_${index}:oraclePriceDailies (filter:  {dateKey: { greaterThan: 20240501 } }, orderBy: DATE_KEY_DESC, first: 100, offset:${
        (index + 1) * 100
      }) {
      nodes {
        typeInName
        typeOutName
        typeInAmountLast
        typeOutAmountLast
        blockTimeLast
        blockHeightLast
      }
    }`
    )}
  }`,
});

export const LIQUIDATION_ORACLE_PRICES_DAILIES_QUERY = (tokens) => ({
  query: `
{
    ${Object.entries(tokens).map(
      ([token, oracleKeys]) =>
        `${token}:oraclePriceDailies (filter: {
        dateKey: { in: [${oracleKeys.join(', ')}] }, typeInName: {equalTo: "${token}"}
    }) {
        nodes {
            id
            typeInName
            typeOutName
            typeInAmountLast
            typeOutAmountLast
            dateKey
        }
    }`
    )}
}`,
});
