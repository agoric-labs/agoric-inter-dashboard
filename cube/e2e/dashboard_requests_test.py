import requests
import json
import os

API_URL = os.getenv("API_URL", "http://localhost:4000")
DEFAULT_DATASET = os.getenv("DEFAULT_DATASET", "agoric_mainnet")


def cube_request(query, dataset=DEFAULT_DATASET):
    url = f"{API_URL}/cubejs-api/{dataset}/v1/load"
    res = requests.post(url, json={"query": query}).json()

    if "error" in res:
        if res["error"] == "Continue wait":
            return cube_request(query, dataset)

        raise ValueError(res["error"])

    return res


def request(query, dataset=DEFAULT_DATASET):
    return cube_request(query, dataset)
    # if "timeDimensions" in query and "granularity" in query["timeDimensions"][0]:
    #     query["timeDimensions"][0]["granularity"] = "month"
    # cube_request(query, dataset)


def test_dataset_header():
    if DEFAULT_DATASET == "agoric_ollinet":
        return

    mainnet = request({"measures": ["state_changes.count"]})
    ollinet = request({"measures": ["state_changes.count"]}, "agoric_ollinet")

    assert (
        mainnet["data"][0]["state_changes.count"]
        != ollinet["data"][0]["state_changes.count"]
    )


def test_reserve():
    request(
        {
            "measures": [
                "reserve.shortfall_balance_avg",
                "reserve.total_fee_minted_avg",
                "reserve.total_fee_burned_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "reserve.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
            "order": {"reserve.day": "asc"},
        }
    )


def test_reserve_allocations():
    request(
        {
            "measures": ["reserve_allocations.amount_usd_avg"],
            "order": [["reserve_allocations.day", "asc"]],
            "dimensions": ["reserve_allocations.key", "reserve_allocations.brand"],
            "timeDimensions": [
                {
                    "dimension": "reserve_allocations.day",
                    "granularity": "day",
                }
            ],
        }
    )


def test_psm_stats():
    request(
        {
            "measures": [
                "psm_stats.last_minted_pool_balance",
                "psm_stats.last_utilization_rate",
            ],
            "timeDimensions": [{"dimension": "psm_stats.day", "dateRange": "Today"}],
            "order": [["psm_stats.coin", "asc"]],
            "dimensions": ["psm_stats.coin"],
        }
    )


def test_interchain_ist():
    request(
        {
            "order": {"balances.amount_avg": "desc"},
            "measures": ["balances.amount_avg", "balances.amount_sum"],
            "timeDimensions": [
                {
                    "dimension": "balances.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
            "dimensions": ["balances.denom"],
        }
    )


def test_oracle_prices():
    request(
        {
            "measures": ["oracle_prices.rate_avg"],
            "timeDimensions": [
                {
                    "dimension": "oracle_prices.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
            "order": [["oracle_prices.price_feed_name", "asc"]],
            "dimensions": ["oracle_prices.price_feed_name"],
        }
    )


def test_slo_metrics():
    request(
        {
            "measures": [
                "head_tendermint_slo_metrics.max_db_latest_block_height",
                "head_tendermint_slo_metrics.max_status_latest_block_height",
            ],
            "timeDimensions": [
                {
                    "dimension": "head_tendermint_slo_metrics.extracted_at",
                    "granularity": "day",
                }
            ],
            "order": {"head_tendermint_slo_metrics.max_db_latest_block_height": "desc"},
        }
    )


def test_wallet_count():
    request({"measures": ["wallets.address_count"], "order": {"wallets.day": "asc"}})


def test_open_vaults():
    request(
        {
            "measures": [
                "open_vaults.collateral_amount",
                "open_vaults.current_collateral_price",
                "open_vaults.collateral_oracle_usd_value",
                "open_vaults.ist_debt_amount",
                "open_vaults.liquidation_margin",
                "open_vaults.liquidation_price",
                "open_vaults.liquidation_cushion",
                "open_vaults.collateralization_ratio",
            ],
            "timeDimensions": [
                {
                    "dimension": "open_vaults.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
            "order": {"open_vaults.collateral_amount": "desc"},
            "dimensions": ["open_vaults.vault_ix", "open_vaults.collateral_type", "open_vaults.debt_type"],
        }
    )


def test_open_vault_count():
    request(
        {
            "measures": ["open_vaults.count"],
            "timeDimensions": [
                {
                    "dimension": "open_vaults.day",
                    "dateRange": "Today",
                    "granularity": "day",
                }
            ],
            "order": {},
        }
    )


def test_vault_managers():
    request(
        {
            "measures": [
                "vault_managers.total_locked_collateral_avg",
                "vault_managers.total_locked_collateral_usd_avg",
                "vault_managers.total_ist_minted_avg",
                "vault_managers.colletarization_ratio_avg",
                "vault_managers.ist_minting_limit_avg",
                "vault_managers.utilization_rate_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "vault_managers.day",
                    "dateRange": "Today",
                    "granularity": "day",
                }
            ],
            "order": {"vault_managers.total_locked_collateral_avg": "desc"},
            "dimensions": ["vault_managers.collateral_type", "vault_managers.debt_type"],
        }
    )


def test_vault_managers2():
    request(
        {
            "measures": [
                "vault_managers.total_locked_collateral_avg",
                "vault_managers.total_locked_collateral_usd_avg",
                "vault_managers.total_ist_minted_avg",
                "vault_managers.colletarization_ratio_avg",
                "vault_managers.ist_minting_limit_avg",
                "vault_managers.utilization_rate_avg",
            ],
            "timeDimensions": [
                {
                    "dimension": "vault_managers.day",
                    "dateRange": "Today",
                    "granularity": "day",
                }
            ],
            "order": {"vault_managers.collateral_type": "desc"},
            "dimensions": ["vault_managers.collateral_type", "vault_managers.debt_type"],
        }
    )


def test_vault_stats():
    request(
        {
            "measures": ["vault_managers.ist_minting_limit_sum"],
            "timeDimensions": [
                {
                    "dimension": "vault_managers.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
        }
    )


def test_psm_governance_stats():
    request(
        {
            "measures": ["psm_governance.mint_limit_sum"],
            "timeDimensions": [
                {
                    "dimension": "psm_governance.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
        }
    )


def test_psm_stats():
    request(
        {
            "measures": ["psm_stats.minted_pool_balance_sum"],
            "timeDimensions": [
                {
                    "dimension": "psm_stats.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
        }
    )
