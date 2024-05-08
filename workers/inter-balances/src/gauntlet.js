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
      }
    }
			}
		`,
  };

  // Define the URL of the GraphQL API
  const apiUrl = 'https://api.subquery.network/sq/agoric-labs/mainnet__YWdvc';

  try {
    // Use fetch API to send a POST request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    // Parse the JSON response
    const jsonData = await response.json();

    const oracle_prices = transformOraclePrices(jsonData.data);
    const { oraclePrices, vaultManagerMetrics, vaultManagerGovernances, vaults, liquidatedVaults } = jsonData.data;
    const managers = transformVaultManagerMetrics(oraclePrices, vaultManagerMetrics, vaultManagerGovernances);
    const vaultsData = transformVaults(vaults, oraclePrices, vaultManagerGovernances)
    // Check if the HTTP request was successful
    if (response.ok) {
      // Handle the data as needed
      console.log('Data fetched successfully:', jsonData);

      return new Response(JSON.stringify({ managers, oracle_prices, vaults: vaultsData, jsonData }), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=0',
        },
      });
    } else {
      // Handle errors if the server response was not ok
      console.error('Server responded with an error:', jsonData);
    }
  } catch (error) {
    // Handle errors from the fetch operation
    console.error('Failed to fetch data:', error);
  }
}

function transformOraclePrices(data) {
  const oracle_prices = data.oraclePriceDailies.nodes.map((node) => {
    const rate = (parseInt(node.typeOutAmountLast) / parseInt(node.typeInAmountLast)).toFixed(6);
    return {
      date: node.blockTimeLast,
      rate: rate,
      type_in_name: node.typeInName,
      type_out_name: node.typeOutName,
    };
  });

  return oracle_prices;
}

function transformVaults(vaults, oraclePrices, vaultManagerGovernances) {
  const transformedVaults = vaults.nodes.map((vaultData) => {
    const vaultManagerGovernanceNode = vaultManagerGovernances.nodes.find((governanceNode) => {
      const splittedGovernanceNodeID = governanceNode.id.split('.');
      const splittedVaultManagerID = vaultData.id.split('.');

      return splittedGovernanceNodeID[3] === splittedVaultManagerID[3];
    });

    const oraclePrice = oraclePrices.nodes.find((oracleNode) => oracleNode.typeInName === vaultData.token);
    const vaultIdx = vaultData.id.split('.').at(-1)?.split('vault')[1] || '';
    const collateralValueUsd = ((oraclePrice.typeOutAmount / oraclePrice.typeInAmount) * vaultData.balance) / 1_000_000;
    const liquidationRatio =
      vaultManagerGovernanceNode?.liquidationMarginNumerator / vaultManagerGovernanceNode?.liquidationMarginDenominator;
    const istDebtAmount = vaultData.debt / 1_000_000;
    const collateralAmount = vaultData.balance / 1_000_000;
    const liquidationPrice = (istDebtAmount * liquidationRatio) / collateralAmount;
    const currentCollateralPrice = oraclePrice.typeOutAmount / oraclePrice.typeInAmount;

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


  const managers = vaultManagerMetrics?.nodes.map((node) => {
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

  return managers;
}
