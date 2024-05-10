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
      liquidatedVaults: vaults (filter: {state: {equalTo: "liquidated"}}) {
        nodes {
          id
          denom
          balance
          state
          debt
          lockedValue
          coin
          liquidatingAt
        }
      }
    }`,
};