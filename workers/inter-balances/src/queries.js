export const graphqlQuery = {
  query: `
    {
      oraclePrices {
        nodes {
          typeInName
          typeOutName
          typeInAmount
          typeOutAmount
        }
      }
      oraclePriceDailies (filter: {dateKey: { greaterThan: 20240501 } }, orderBy: DATE_KEY_DESC) {
        nodes {
          typeInName
          typeOutName
          typeInAmountLast
          typeOutAmountLast
          blockTimeLast
        }
      }
      vaultManagerMetrics {
        nodes {
          id
          blockTime
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
          debtLimit
          liquidationMarginNumerator
          liquidationMarginDenominator
        }
      }
      vaults (filter: {state: {equalTo: "active"}}) {
        nodes {
          id
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
            denom
            debt
            state
            balance
            blockTime
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
