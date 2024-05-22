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
    }
    }`,
};

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
