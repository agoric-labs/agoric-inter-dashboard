import requests
import json
import os

API_URL = os.getenv("API_URL", "http://localhost:4000")


def request(query):
    res = requests.post(f"{API_URL}/cubejs-api/v1/load", json={"query": query}).json()

    if "error" in res:
        raise ValueError(res["error"])


def test_reserve():
    request(
        {
            "measures": [
                "reserve.atom_amount_avg",
                "reserve.fee_amount_avg",
                "reserve.shortfall_balance_avg",
                "reserve.total_fee_minted_avg",
                "reserve.total_fee_burned_avg",
            ],
            "timeDimensions": [
                {"dimension": "reserve.day", "granularity": "day", "dateRange": "Today"}
            ],
            "order": {"reserve.day": "asc"},
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
            "order": {"ibc_balances.amount_avg": "desc"},
            "measures": ["ibc_balances.amount_avg", "ibc_balances.amount_sum"],
            "timeDimensions": [{"dimension": "ibc_balances.day", "dateRange": "Today"}],
            "dimensions": ["ibc_balances.denom"],
        }
    )


def test_oracle_prices():
    request(
        {
            "measures": ["oracle_prices.rate_avg"],
            "timeDimensions": [
                {"dimension": "oracle_prices.day", "dateRange": "Today"}
            ],
            "order": [["oracle_prices.price_feed_name", "asc"]],
            "dimensions": ["oracle_prices.price_feed_name"],
        }
    )


def test_coingeko_history():
    request(
        {
            "measures": [
                "coingeko_history.current_price_usd_last",
                "coingeko_history.current_price_usd_avg",
            ],
            "timeDimensions": [
                {"dimension": "coingeko_history.day", "granularity": "day"}
            ],
            "order": [["coingeko_history.day", "desc"]],
            "dimensions": ["coingeko_history.coin_id"],
            "limit": 1,
        }
    )


def test_slo_metrics():
    request(
        {
            "measures": [
                "tendermint_slo_metrics.max_db_latest_block_height",
                "tendermint_slo_metrics.max_status_latest_block_height",
            ],
            "timeDimensions": [
                {
                    "dimension": "tendermint_slo_metrics.extracted_at",
                    "granularity": "day",
                }
            ],
            "order": {"tendermint_slo_metrics.max_db_latest_block_height": "desc"},
            "dimensions": ["tendermint_slo_metrics.section"],
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
            "dimensions": ["open_vaults.vault_ix", "open_vaults.collateral_type"],
        }
    )


def test_open_vault_count():
    request(
        {
            "measures": ["open_vaults.count"],
            "timeDimensions": [{"dimension": "open_vaults.day", "dateRange": "Today"}],
            "order": {},
        }
    )
