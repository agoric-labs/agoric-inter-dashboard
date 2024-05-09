import { graphqlQuery } from './queries.js';
import { SUBQUERY_URL } from './constants.js';
export async function handleGauntletRequest(env) {

  try {
    const response = await fetch(SUBQUERY_URL, {
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
        oracle_rices: oraclePricesData,
        open_vaults: vaultsData,
        liquidated_vaults: liquidatedVaultsData,
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

    const managerIdx = vaultManagerGovernanceNode?.id?.match(/manager(\d+)/)[1];
    const pattern = /vault(\d+)/;
    const match = vaultData?.id?.match(pattern);
    const vaultIdx = match ? match[1] : '';

    const liquidatingTimeStampInSeconds = Math.round(new Date(vaultData.liquidatingAt).getTime() / 1000);

			/*
			"collateral_type": "ATOM",
      "day": "2024-05-09T00:00:00.000",
      "day.day": "2024-05-09T00:00:00.000",
      "debt_type": "IST",
      "last_state": "liquidated",
      "liquidated_enter_time": 1702877045,
      "liquidated_return_amount_avg": 4.416504,
      "liquidated_return_amount_usd_avg": 47.975299328928,
      "liquidating_collateral_amount_avg": 4.416504,
      "liquidating_debt_amount_avg": 25.125,
      "liquidating_enter_time": 1702875602,
      "liquidating_rate": 10.862732,
      "liquidation_margin_avg": 1.9,
      "manager_idx": "0",
      "vault_idx": "62"
			*/
    return {
      collateral_type: vaultData.token,
      debt_type: 'IST',
      last_state: vaultData.state,
      liquidated_enter_time: liquidatingTimeStampInSeconds,
      liquidated_return_amount_avg: 0,
      liquidated_return_amount_usd_avg: 0,
      liquidating_collateral_amount_avg: 0,
      liquidating_debt_amount_avg: 0,
      liquidating_rate: 0,
      liquidation_margin_avg: 0,
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
		const managerIdx = vaultManagerGovernanceNode?.id?.match(/manager(\d+)/)[1];

    return {
      collateral_amount: collateralAmount,
      collateral_amount_current_usd: collateralValueUsd,
      collateral_type: vaultData.token,
      collateralization_ratio: collateralValueUsd / (vaultData.debt / 1_000_000),
      current_collateral_price: currentCollateralPrice,
      debt_amount: istDebtAmount,
      debt_type: 'IST',
      ist_debt_amount: istDebtAmount,
      liquidation_cushion: currentCollateralPrice / (liquidationPrice - 1),
      liquidation_margin: liquidationRatio,
      liquidation_price: liquidationPrice,
      manager_idx: managerIdx,
      vault_ix: vaultIdx,
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
