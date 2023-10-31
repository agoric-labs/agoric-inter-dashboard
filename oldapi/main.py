import requests
import os

from flask import Flask, jsonify

app = Flask(__name__)

API_URL = os.getenv("API_URL", "http://localhost:4000")

coin_labels = {
    "DAI_axl": "IST ↔ DAI (Axelar)",
    "DAI_grv": "IST ↔ DAI (Gravity)",
    "USDT_axl": "IST ↔ USDT (Axelar)",
    "USDT_grv": "IST ↔ USDT (Gravity)",
    "USDC_axl": "IST ↔ USDC (Axelar)",
    "USDC_grv": "IST ↔ USDC (Gravity)",
}

vault_states = {
    # FARM_FINGERPRINT('liquidated')
    "5264610956617764810": "liquidated",
    # FARM_FINGERPRINT('liquidating')
    "159334985254996322": "liquidating",
}


def cube_request(dataset, query):
    url = f"{API_URL}/cubejs-api/agoric_{dataset}/v1/load"
    req = requests.post(url, json={"query": query})

    if req.status_code != requests.codes.ok:
        raise ValueError(req.status_code)

    res = req.json()

    if "error" in res:
        if res["error"] == "Continue wait":
            return cube_request(query, dataset)

        raise ValueError(res["error"])

    return res["data"]


def safe_float(v):
    if v is None:
        return 0.0

    return float(v)


def get_total_mint_limit(dataset, granularity):
    vfg_res = cube_request(
        dataset,
        {
            "measures": ["vault_factory_governance.debt_limit_sum"],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_governance.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    psmg_res = cube_request(
        dataset,
        {
            "measures": ["psm_governance.mint_limit_sum"],
            "timeDimensions": [
                {
                    "dimension": "psm_governance.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    vault_mint_limit = float(vfg_res[0]["vault_factory_governance.debt_limit_sum"])
    psm_mint_limit = float(psmg_res[0]["psm_governance.mint_limit_sum"])

    return [{"value": vault_mint_limit + psm_mint_limit}]


def get_total_reserve_assets(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["reserve_allocations.amount_usd_sum"],
            "timeDimensions": [
                {
                    "dimension": "reserve_allocations.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["reserve_allocations.amount_usd_sum"])}]


def get_open_vaults(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": [
                "vault_factory_vaults.collateral_amount_avg",
                "oracle_prices.rate_avg",
                "vault_factory_vaults.collateral_amount_usd_avg",
                "vault_factory_vaults.debt_amount_avg",
                "vault_factory_governance.liquidation_margin_avg",
                "vault_factory_vaults.liquidation_price_avg",
                "vault_factory_vaults.liquidation_cushion_avg",
                "vault_factory_vaults.collateralization_ratio_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_vaults.day",
                    "granularity": granularity,
                    "dateRange": "Today",
                },
            ],
            "order": {
                "vault_factory_vaults.manager_idx": "asc",
                "vault_factory_vaults.vault_idx": "asc",
            },
            "dimensions": [
                "vault_factory_vaults.debt_type",
                "vault_factory_vaults.vault_idx",
                "vault_factory_vaults.manager_idx",
                "vault_factory_vaults.collateral_type",
            ],
            "filters": [
                {
                    "member": "vault_factory_vaults.last_state",
                    "operator": "equals",
                    # cubestore supports only integers
                    # select FARM_FINGERPRINT('active')
                    "values": ["5907958362119427434"],
                },
            ],
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "vault_ix": str(row["vault_factory_vaults.vault_idx"]),
                "manager_idx": row["vault_factory_vaults.manager_idx"],
                "collateral_type": row["vault_factory_vaults.collateral_type"],
                "collateral_amount": float(row["vault_factory_vaults.collateral_amount_avg"]),
                "current_collateral_price": float(row["oracle_prices.rate_avg"]),
                "collateral_oracle_usd_value": float(row["vault_factory_vaults.collateral_amount_usd_avg"]),
                "ist_debt_amount": float(row["vault_factory_vaults.debt_amount_avg"]),
                "liquidation_margin": float(row["vault_factory_governance.liquidation_margin_avg"]),
                "liquidation_price": float(row["vault_factory_vaults.liquidation_price_avg"]),
                "liquidation_cushion": float(row["vault_factory_vaults.liquidation_cushion_avg"]),
                "collateralization_ratio": safe_float(row["vault_factory_vaults.collateralization_ratio_avg"]),
            }
        )

    return rows


def get_vault_total_locked_assets(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["vault_factory_metrics.total_collateral_usd_sum"],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_metrics.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["vault_factory_metrics.total_collateral_usd_sum"])}]


def get_vaults_metrics(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["vault_factory_metrics.total_collateral_usd_sum", "vault_factory_metrics.total_debt_avg"],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_metrics.day",
                    "granularity": granularity,
                },
            ],
            "order": {
                "vault_factory_metrics.day": "asc",
            },
            "dimensions": [
                "vault_factory_metrics.collateral_type",
                "vault_factory_metrics.manager_idx",
                "vault_factory_metrics.debt_type",
            ],
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "date": row["vault_factory_metrics.day"],
                "collateral_type": row["vault_factory_metrics.collateral_type"],
                "avg_total_locked_collateral": float(row["vault_factory_metrics.total_collateral_usd_sum"]),
                "avg_total_ist_minted": float(row["vault_factory_metrics.total_debt_avg"]),
                "debt_type": row["vault_factory_metrics.debt_type"],
                "manager_idx": row["vault_factory_metrics.manager_idx"],
            }
        )

    return rows


def get_vault_managers(dataset):
    res = cube_request(
        dataset,
        {
            "measures": [
                "vault_factory_metrics.total_collateral_avg",
                "vault_factory_metrics.total_collateral_usd_avg",
                "vault_factory_metrics.total_debt_avg",
                "vault_factory_metrics.colletarization_ratio_avg",
                "vault_factory_governance.debt_limit_avg",
                "vault_factory_metrics.utilization_rate_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_metrics.day",
                    "dateRange": "Today",
                    "granularity": "day",
                },
            ],
            "order": {
                "vault_factory_metrics.manager_idx": "asc",
            },
            "dimensions": [
                "vault_factory_metrics.collateral_type",
                "vault_factory_metrics.debt_type",
                "vault_factory_metrics.manager_idx",
            ],
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "date": row["vault_factory_metrics.day"],
                "vault_manager_type": row["vault_factory_metrics.collateral_type"],
                "total_locked_collateral": float(row["vault_factory_metrics.total_collateral_avg"]),
                "total_locked_collateral_usd": float(row["vault_factory_metrics.total_collateral_usd_avg"]),
                "total_ist_minted": float(row["vault_factory_metrics.total_debt_avg"]),
                "colletarization_ratio": float(row["vault_factory_metrics.utilization_rate_avg"]),
                "ist_minting_limit": float(row["vault_factory_governance.debt_limit_avg"]),
                "utilization_rate": float(row["vault_factory_metrics.utilization_rate_avg"]),
            }
        )

    return rows


def get_reserve_assets(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["reserve_allocations.amount_usd_avg"],
            "dimensions": ["reserve_allocations.key", "reserve_allocations.brand"],
            "timeDimensions": [{"dimension": "reserve_allocations.day", "granularity": "day"}],
            "order": {
                "reserve_allocations.day": "asc",
            },
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "date": row["reserve_allocations.day"],
                "brand": row["reserve_allocations.brand"],
                "avg_amount": float(row["reserve_allocations.amount_usd_avg"]),
            }
        )

    return rows


def get_ibc_balances(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["balances.amount_sum"],
            "timeDimensions": [
                {
                    "dimension": "balances.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
            "filters": [
                {
                    "member": "balances.denom",
                    "operator": "equals",
                    "values": ["uist"],
                },
                {
                    "member": "balances.address",
                    "operator": "contains",
                    "values": [
                        "agoric1a53udazy8ayufvy0s434pfwjcedzqv34y3q6mc",
                        "agoric1kq2rzz6fq2q7fsu75a9g7cpzjeanmk686c8qtz",
                        "agoric12k2pyuylm9t7ugdvz67h9pg4gmmvhn5vdm8dpz",
                        "agoric17sael2kcmm8npe2pmkxj3un90xfg60vvxgxjnt",
                        "agoric1wsxce0ls59rtj70fwcrxmtmmv32vpgmgl3wen2",
                    ],
                },
            ],
        },
    )

    return [{"total": float(res[0]["balances.amount_sum"])}]


def get_psm_mint_limit(dataset):
    res = cube_request(
        dataset,
        {
            "measures": ["psm_governance.mint_limit_sum"],
            "timeDimensions": [
                {
                    "dimension": "psm_governance.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["psm_governance.mint_limit_sum"])}]


def get_reserve_shortfall(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["reserve.shortfall_balance_avg"],
            "timeDimensions": [
                {
                    "dimension": "reserve.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["reserve.shortfall_balance_avg"])}]


def get_smart_wallet_provisioned(dataset):
    res = cube_request(
        dataset,
        {
            "measures": ["wallets.address_count"],
        },
    )

    return [{"value": float(res[0]["wallets.address_count"])}]


def get_vault_mint_limit(dataset):
    res = cube_request(
        dataset,
        {
            "measures": ["vault_factory_governance.debt_limit_sum"],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_governance.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["vault_factory_governance.debt_limit_sum"])}]


def get_oracle_prices(dataset):
    res = cube_request(
        dataset,
        {
            "measures": ["oracle_prices.rate_avg"],
            "timeDimensions": [
                {
                    "dimension": "oracle_prices.day",
                    "granularity": "day",
                    "dateRange": "Last 7 days",
                },
            ],
            "order": [["oracle_prices.day", "desc"]],
            "dimensions": ["oracle_prices.price_feed_name"],
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "date": row["oracle_prices.day"],
                "type_in_name": row["oracle_prices.price_feed_name"],
                "type_out_name": "USD",
                "rate": row["oracle_prices.rate_avg"],
            }
        )

    return rows


def get_psm_stats(dataset):
    res = cube_request(
        dataset,
        {
            "measures": [
                "psm_stats.minted_pool_balance_avg",
                "psm_stats.utilization_rate_avg",
                "psm_governance.mint_limit_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "psm_stats.day",
                    "dateRange": "Today",
                    "granularity": "day",
                },
            ],
            "order": [["psm_stats.coin", "asc"]],
            "dimensions": ["psm_stats.coin"],
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "date": row["psm_stats.day"],
                "coin": row["psm_stats.coin"],
                "label": coin_labels.get(row["psm_stats.coin"], row["psm_stats.coin"]),
                "mint_limit": float(row["psm_governance.mint_limit_avg"]),
                "minted_pool_balance": float(row["psm_stats.minted_pool_balance_avg"]),
                "utilized": float(row["psm_stats.utilization_rate_avg"]),
            }
        )

    return rows


def get_psm_daily(dataset, granularity):
    res = cube_request(
        dataset,
        {
            "measures": ["psm_stats.total_minted_provided_avg"],
            "timeDimensions": [
                {
                    "dimension": "psm_stats.day",
                    "granularity": granularity,
                },
            ],
            "order": [["psm_stats.coin", "asc"]],
            "dimensions": ["psm_stats.coin"],
        },
    )

    rows = []

    for row in res:
        rows.append(
            {
                "date": row["psm_stats.day"],
                "coin": row["psm_stats.coin"],
                "brand": coin_labels.get(row["psm_stats.coin"], row["psm_stats.coin"]),
                "avg_total_minted_provided": float(row["psm_stats.total_minted_provided_avg"]),
            }
        )

    return rows


def get_psm_minted_pool_balance(dataset):
    res = cube_request(
        dataset,
        {
            "measures": ["psm_stats.minted_pool_balance_sum"],
            "timeDimensions": [
                {
                    "dimension": "psm_stats.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["psm_stats.minted_pool_balance_sum"])}]


def get_vault_total_minted(dataset):
    res = cube_request(
        dataset,
        {
            "measures": ["vault_factory_metrics.total_debt_sum"],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_metrics.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
        },
    )

    return [{"value": float(res[0]["vault_factory_metrics.total_debt_sum"])}]


def get_total_minted(dataset):
    vault = get_vault_total_minted(dataset)
    psm = get_psm_minted_pool_balance(dataset)

    return [{"value": vault[0]["value"] + psm[0]["value"]}]


def get_psm_total_minted_ist(dataset, granularity):
    res = get_psm_stats(dataset)
    rows = []

    for row in res:
        rows.append(
            {
                "coin": row["coin"],
                "f0_": row["date"],
                "avg_total_minted_provided": row["minted_pool_balance"],
            }
        )

    return rows


def get_liquidated_vaults(dataset):
    res = cube_request(
        dataset,
        {
            "measures": [
                "vault_factory_liquidate_vaults.liquidating_collateral_amount_avg",
                "vault_factory_liquidate_vaults.liquidating_debt_amount_avg",
                "vault_factory_liquidate_vaults.liquidating_enter_time",
                "vault_factory_liquidate_vaults.liquidated_enter_time",
                "vault_factory_liquidate_vaults.liquidating_rate",
                "vault_factory_liquidate_vaults.last_state",
                "vault_factory_liquidate_vaults.liquidated_return_amount_avg",
                "vault_factory_liquidate_vaults.liquidated_return_amount_usd_avg",
                "vault_factory_governance.liquidation_margin_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "vault_factory_liquidate_vaults.day",
                    "granularity": "day",
                    "dateRange": "Today",
                },
            ],
            "order": {
                "vault_factory_liquidate_vaults.manager_idx": "asc",
                "vault_factory_liquidate_vaults.vault_idx": "asc",
            },
            "dimensions": [
                "vault_factory_liquidate_vaults.manager_idx",
                "vault_factory_liquidate_vaults.vault_idx",
                "vault_factory_liquidate_vaults.debt_type",
                "vault_factory_liquidate_vaults.collateral_type",
            ],
        },
    )

    rows = []

    for row in res:
        new_row = {}

        for key in row:
            new_key = key.replace("vault_factory_liquidate_vaults.", "").replace("vault_factory_governance.", "")

            if "_avg" in new_key or "_rate" in new_key:
                new_row[new_key] = float(row[key])
            elif "_time" in new_key:
                new_row[new_key] = int(row[key])
            else:
                new_row[new_key] = row[key]

        new_row["last_state"] = vault_states.get(new_row["last_state"], "???")

        rows.append(new_row)

    return rows


@app.route("/data/<dataset>-<granularity>.json")
def data(dataset, granularity):
    result = {
        "ibc_balances": get_ibc_balances(dataset, granularity),
        "managers": get_vault_managers(dataset),
        "open_vaults": get_open_vaults(dataset, granularity),
        "oracle_prices": get_oracle_prices(dataset),
        "psm_daily": get_psm_daily(dataset, granularity),
        "psm_stats": get_psm_stats(dataset),
        "psm_total_assets": get_psm_minted_pool_balance(dataset),
        "psm_total_minted": get_psm_minted_pool_balance(dataset),
        "psm_total_minted_ist": get_psm_total_minted_ist(dataset, granularity),  # chart
        "reserve_assets": get_reserve_assets(dataset, granularity),
        "reserve_shortfall": get_reserve_shortfall(dataset, granularity),
        "smart_wallet_provisioned": get_smart_wallet_provisioned(dataset),
        "total_minted_ist": get_total_minted(dataset),
        "total_reserve_assets": get_total_reserve_assets(dataset, granularity),
        "vault_total_assets": get_vault_total_locked_assets(dataset, granularity),
        "vault_total_minted": get_vault_total_minted(dataset),
        "vaults_metrics": get_vaults_metrics(dataset, granularity),
        "liquidated_vaults": get_liquidated_vaults(dataset),
    }

    return jsonify(result)
