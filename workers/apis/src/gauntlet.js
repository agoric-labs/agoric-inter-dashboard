import { graphqlQuery, LIQUIDATION_ORACLE_PRICES_DAILIES_QUERY, PAGINATINATED_DATA_QUERIES } from './queries.js';
import { fetchSubquery, getDateKey, parseFromPaginatedData } from './utils.js';

async function getOraclPricesDailiesForLiquidatedVaults(vaultLiquidations) {
  const oraclePricesDatekeyMap = vaultLiquidations?.nodes.reduce((agg, vault) => {
    const { denom } = vault;
    const prevDenomKeys = agg[denom] || [];
    return { ...agg, [denom]: [...prevDenomKeys, getDateKey(new Date(vault.blockTime)).key] };
  }, {});
  const oraclePricesResponse = await fetchSubquery(LIQUIDATION_ORACLE_PRICES_DAILIES_QUERY(oraclePricesDatekeyMap));
  const { data } = await oraclePricesResponse.json();

  const oraclePricesDailies =
    data &&
    Object.fromEntries(
      Object.entries(data).map(([denom, oraclePrices]) => [
        denom,
        oraclePrices.nodes.reduce(
          (agg, oracle) => ({
            ...agg,
            [oracle.dateKey]: oracle,
          }),
          {}
        ),
      ])
    );
  return oraclePricesDailies;
}

export async function handleGauntletRequest(env) {
  try {
    const response = await fetchSubquery(graphqlQuery);

    const { data } = await response.json();
    console.log('Data Fetched Successfully');

    const { oraclePrices, oraclePriceDailies, vaultManagerMetrics, vaultManagerGovernances, vaults, vaultLiquidations, _metadata } = data;

    const paginatedDataResponse = await fetchSubquery(
      PAGINATINATED_DATA_QUERIES(
        Math.floor(vaults.totalCount / 100),
        Math.floor(vaultLiquidations.totalCount / 100),
        Math.floor(oraclePriceDailies.totalCount / 100)
      )
    );
    const { data: paginatedData } = await paginatedDataResponse.json();

    vaults.nodes.push(...parseFromPaginatedData('vaults', paginatedData));
    vaultLiquidations.nodes.push(...parseFromPaginatedData('vaultLiquidations', paginatedData));
    oraclePriceDailies.nodes.push(...parseFromPaginatedData('oraclePriceDailies', paginatedData));

    const liquidationOraclePricesDailies = await getOraclPricesDailiesForLiquidatedVaults(vaultLiquidations);

    const oraclePricesData = transformOraclePrices(oraclePriceDailies);
    const managersData = transformVaultManagerMetrics(oraclePrices, vaultManagerMetrics, vaultManagerGovernances);
    const vaultsData = transformVaults(vaults, oraclePrices, vaultManagerGovernances);
    const liquidatedVaultsData = transformLiquidatedVaults(vaultLiquidations, vaultManagerGovernances, liquidationOraclePricesDailies);

    console.log('Sending Response...');

    return new Response(
      JSON.stringify({
        last_processed_height: _metadata.lastProcessedHeight,
        last_processed_timestamp: _metadata.lastProcessedTimestamp,
        managers: managersData,
        oracle_prices: oraclePricesData,
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
      block_height_last: node.blockHeightLast,
      block_time_last: node.blockTimeLast,
    };
  });

  return transformedOraclePrices;
}

function transformLiquidatedVaults(vaults, vaultManagerGovernances, oraclePricesDailies) {
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

    const oraclePriceSnapshot = oraclePricesDailies?.[vaultData.denom]?.[getDateKey(vaultData.blockTime).key];
    const oraclePriceRatio = oraclePriceSnapshot.typeOutAmountLast / oraclePriceSnapshot.typeInAmountLast;

    const collateralAmountReturned = (vaultData.liquidatingState.balance - vaultData.balance) / 1_000_000;
    const collateralAmountReturnedUsd = collateralAmountReturned * oraclePriceRatio;
    const istDebtAmount = vaultData.liquidatingState.debt / 1_000_000;
    const liquidatingTimeStampInSeconds = Math.round(new Date(vaultData.liquidatingState.blockTime).getTime() / 1000);
    const liquidatedTimeStampInSeconds = Math.round(new Date(vaultData.blockTime).getTime() / 1000);

    return {
      collateral_type: vaultData.denom,
      debt_type: 'IST',
      last_state: vaultData.state,
      liquidated_enter_time: liquidatedTimeStampInSeconds,
      liquidated_return_amount_avg: collateralAmountReturned,
      liquidated_return_amount_usd_avg: collateralAmountReturnedUsd,
      liquidating_collateral_amount_avg: collateralAmountReturned,
      liquidating_debt_amount_avg: istDebtAmount,
      liquidating_enter_time: liquidatingTimeStampInSeconds,
      block_height: vaultData.blockHeight,
      block_time: vaultData.blockTime,
      // Both are incorrect currently
      // liquidating_rate: 0,
      // liquidation_margin_avg: 0,
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

    const oraclePriceNode = oraclePrices.nodes.find((oracleNode) => oracleNode.typeInName === vaultData.denom);
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
    const collateralizationRatio = collateralValueUsd / (vaultData.debt / 1_000_000);

    return {
      collateral_amount: collateralAmount,
      collateral_amount_current_usd: collateralValueUsd,
      collateral_type: vaultData.denom,
      collateralization_ratio: collateralizationRatio === Infinity ? 0 : collateralizationRatio,
      current_collateral_price: currentCollateralPrice,
      debt_amount: istDebtAmount,
      debt_type: 'IST',
      ist_debt_amount: istDebtAmount,
      liquidation_cushion: currentCollateralPrice / (liquidationPrice - 1),
      liquidation_margin: liquidationRatio,
      liquidation_price: liquidationPrice,
      block_height: vaultData.blockHeight,
      block_time: vaultData.blockTime,
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

    const utilizationRate = totalIstMinted / istMintingLimit;

    return {
      colletarization_ratio: collateralizationRatio,
      date: node.blockTime,
      ist_minting_limit: istMintingLimit,
      total_ist_minted: totalDebt,
      total_locked_collateral: totalCollateral,
      total_locked_collateral_usd: totalCollateralUSD,
      utilization_rate: utilizationRate,
      vault_manager_type: node.liquidatingCollateralBrand,
      block_height: node.blockHeight,
      block_time: node.blockTime,
    };
  });

  return transformedVaultManagerMetrics;
}
