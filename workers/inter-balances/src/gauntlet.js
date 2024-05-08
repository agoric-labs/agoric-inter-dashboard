export async function handleGauntletRequest(env) {
  console.log('Fetching channels...');
  const graphqlQuery = {
    query: `
			{
				oraclePrices {
					nodes {
						typeInName
						typeOutName
						typeInAmount
						typeOutAmount
						blockTime
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
            token
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
        token
        balance
        state
        debt
        lockedValue
        coin
        liquidatingAt
      }
    }
			}
		`,
  };

  const apiUrl = 'https://api.subquery.network/sq/agoric-labs/mainnet__YWdvc';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    const { data } = await response.json();
    console.log('Data Fetched Successfully');

    const { oraclePrices, oraclePriceDailies, vaultManagerMetrics, vaultManagerGovernances, vaults, liquidatedVaults } = data;
    const oraclePricesData = transformOraclePrices(oraclePriceDailies);
    const managersData = transformVaultManagerMetrics(oraclePrices, vaultManagerMetrics, vaultManagerGovernances);
    const vaultsData = transformVaults(vaults, oraclePrices, vaultManagerGovernances);
    const liquidatedVaultsData = transformLiquidatedVaults(liquidatedVaults, vaultManagerGovernances);

    console.log('Sending Response...');

    return new Response(
      JSON.stringify({
        managers: managersData,
        oraclePrices: oraclePricesData,
        vaults: vaultsData,
        liquidatedVaults: liquidatedVaultsData,
      }),
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

function transformOraclePrices(oraclePriceDailies) {
  const transformedOraclePrices = oraclePriceDailies.nodes.map((node) => {
    const rate = (parseInt(node.typeOutAmountLast) / parseInt(node.typeInAmountLast)).toFixed(6);
    return {
      date: node.blockTimeLast,
      rate: rate,
      type_in_name: node.typeInName,
      type_out_name: node.typeOutName,
    };
  });

  return transformedOraclePrices;
}

function transformLiquidatedVaults(vaults, vaultManagerGovernances) {
  const transformedVaults = vaults.nodes.map((vaultData) => {
    const vaultManagerGovernanceNode = vaultManagerGovernances.nodes.find((governanceNode) => {
      const splittedGovernanceNodeID = governanceNode.id.split('.');
      const splittedVaultManagerID = vaultData.id.split('.');

      return splittedGovernanceNodeID[3] === splittedVaultManagerID[3];
    });

    const managerIdx = vaultManagerGovernanceNode?.id?.split('.')[3];
    const pattern = /vault(\d+)/;
    const match = vaultData?.id?.match(pattern);
    const vaultIdx = match ? match[1] : '';

    const liquidatingTimeStampInSeconds = Math.round(new Date(vaultData.liquidatingAt).getTime() / 1000);

    return {
      collateral_type: vaultData.token,
      debt_type: 'IST',
      last_state: vaultData.state,
      liquidated_enter_time: liquidatingTimeStampInSeconds,
      liquidated_return_amount_avg: 'DUMMY',
      liquidated_return_amount_usd_avg: 'DUMMY',
      liquidating_collateral_amount_avg: 'DUMMY',
      liquidating_debt_amount_avg: 'DUMMY',
      liquidating_rate: 'DUMMY',
      liquidation_margin_avg: 'DUMMY',
      manager_idx: managerIdx,
      vault_idx: vaultIdx,
    };
  });

  return transformedVaults;
}
function transformVaults(vaults, oraclePrices, vaultManagerGovernances) {
  const transformedVaults = vaults.nodes.map((vaultData) => {
    const vaultManagerGovernanceNode = vaultManagerGovernances.nodes.find((governanceNode) => {
      const splittedGovernanceNodeID = governanceNode.id.split('.');
      const splittedVaultManagerID = vaultData.id.split('.');

      return splittedGovernanceNodeID[3] === splittedVaultManagerID[3];
    });

    const oraclePriceNode = oraclePrices.nodes.find((oracleNode) => oracleNode.typeInName === vaultData.token);
    const rate = parseInt(oraclePriceNode.typeOutAmount) / parseInt(oraclePriceNode.typeInAmount);

    const pattern = /vault(\d+)/;
    const match = vaultData?.id?.match(pattern);
    const vaultIdx = match ? match[1] : '';

    const collateralValueUsd = (rate * vaultData.balance) / 1_000_000;
    const liquidationRatio =
      vaultManagerGovernanceNode.liquidationMarginNumerator / vaultManagerGovernanceNode.liquidationMarginDenominator;
    const istDebtAmount = vaultData.debt / 1_000_000;
    const collateralAmount = vaultData.balance / 1_000_000;
    const liquidationPrice = (istDebtAmount * liquidationRatio) / collateralAmount;
    const currentCollateralPrice = rate;

    return {
      vault_idx: vaultIdx,
      collateral_type: vaultData.token,
      debt_type: 'IST',
      collateral_amount: collateralAmount,
      current_collateral_price: currentCollateralPrice,
      collateral_amount_current_usd: collateralValueUsd,
      debt_amount: istDebtAmount,
      ist_debt_amount: istDebtAmount,
      liquidation_margin: liquidationRatio,
      liquidation_price: liquidationPrice,
      liquidation_cushion: currentCollateralPrice / (liquidationPrice - 1),
      collateralization_ratio: collateralValueUsd / (vaultData.debt / 1_000_000),
    };
  });

  return transformedVaults;
}

function transformVaultManagerMetrics(oraclePrices, vaultManagerMetrics, vaultManagerGovernances) {
  const priceMap = new Map();
  oraclePrices.nodes.forEach((price) => {
    const rate = parseInt(price.typeOutAmount) / parseInt(price.typeInAmount);
    priceMap.set(price.typeInName, rate);
  });

  const transformedVaultManagerMetrics = vaultManagerMetrics?.nodes.map((node) => {
    const price = priceMap.get(node.liquidatingCollateralBrand) || 1;
    const totalIstMinted = node.totalDebt / 1_000_000;
    const totalCollateral = node.totalCollateral / 1e6; // Converting from minor to major units
    const totalCollateralUSD = totalCollateral * price; // Assuming a conversion rate to USD, example rate used
    const totalDebt = node.totalDebt / 1e6; // Converting from minor to major units
    const collateralizationRatio = totalCollateralUSD / totalIstMinted; // Calculate collateralization ratio
    const debtLimit = vaultManagerGovernances.nodes.find((governanceNode) => {
      const splittedGovernanceNodeID = governanceNode.id.split('.');
      const splittedVaultManagerID = node.id.split('.');

      return splittedGovernanceNodeID[3] === splittedVaultManagerID[3];
    }).debtLimit;
    const istMintingLimit = debtLimit / 1_000_000;

    const utilizationRate = collateralizationRatio;

    return {
      colletarization_ratio: collateralizationRatio,
      date: node.blockTime,
      ist_minting_limit: istMintingLimit,
      total_ist_minted: totalDebt,
      total_locked_collateral: totalCollateral,
      total_locked_collateral_usd: totalCollateralUSD,
      utilization_rate: utilizationRate,
      vault_manager_type: node.liquidatingCollateralBrand,
    };
  });

  return transformedVaultManagerMetrics;
}
