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

    # check cache bugs
    assert len(res["data"]) > 0

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
            "dimensions": [
                "open_vaults.vault_ix",
                "open_vaults.collateral_type",
                "open_vaults.debt_type",
            ],
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
            "dimensions": [
                "vault_managers.collateral_type",
                "vault_managers.debt_type",
            ],
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
            "dimensions": [
                "vault_managers.collateral_type",
                "vault_managers.debt_type",
            ],
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


def test_liquidated_vaults():
    request(
        {
            "measures": [
                "liquidated_vaults.liquidating_locked_value",
                "liquidated_vaults.liquidation_token_price",
                "liquidated_vaults.current_collateral_price",
                "liquidated_vaults.liquidating_debt_amount",
                "liquidated_vaults.liquidation_margin",
                "liquidated_vaults.liquidating_start_time",
                "liquidated_vaults.liquidated_time",
            ],
            "timeDimensions": [
                {
                    "dimension": "liquidated_vaults.day",
                    "granularity": "day",
                    "dateRange": "Today",
                }
            ],
            "order": {
                "liquidated_vaults.debt_type": "asc",
                "liquidated_vaults.vault_ix": "asc",
            },
            "dimensions": [
                "liquidated_vaults.debt_type",
                "liquidated_vaults.vault_ix",
                "liquidated_vaults.collateral_type",
                "liquidated_vaults.vault_state",
            ],
        }
    )


def test_vault_factory_metrics_by_manager_idx_and_collateral_type():
    request(
        {
            "measures": [
                "vault_factory_metrics.liquidating_collateral_avg",
                "vault_factory_metrics.liquidating_debt_avg",
                "vault_factory_metrics.locked_quote_avg",
                "vault_factory_metrics.num_active_vaults_avg",
                "vault_factory_metrics.num_liquidating_vaults_avg",
                "vault_factory_metrics.num_liquidations_aborted_avg",
                "vault_factory_metrics.num_liquidations_completed_avg",
                "vault_factory_metrics.retained_collateral_avg",
                "vault_factory_metrics.total_collateral_sold_avg",
                "vault_factory_metrics.total_debt_avg",
                "vault_factory_metrics.total_overage_received_avg",
                "vault_factory_metrics.total_proceeds_received_avg",
                "vault_factory_metrics.total_shortfall_received_avg",
                "vault_factory_metrics.total_collateral_avg",
            ],
            "timeDimensions": [
                {"dimension": "vault_factory_metrics.day", "granularity": "day"}
            ],
            "order": {"vault_factory_metrics.liquidating_collateral_avg": "desc"},
            "dimensions": [
                "vault_factory_metrics.manager_idx",
                "vault_factory_metrics.collateral_type",
            ],
        }
    )

def test_vault_factory_metrics_stats():
    request(
        {
            "measures": [
                "vault_factory_metrics.liquidating_collateral_sum",
                "vault_factory_metrics.liquidating_debt_sum",
                "vault_factory_metrics.num_active_vaults_sum",
                "vault_factory_metrics.num_liquidating_vaults_sum",
                "vault_factory_metrics.num_liquidations_aborted_sum",
                "vault_factory_metrics.num_liquidations_completed_sum",
                "vault_factory_metrics.retained_collateral_sum",
                "vault_factory_metrics.total_collateral_sold_sum",
                "vault_factory_metrics.total_debt_sum",
                "vault_factory_metrics.total_overage_received_sum",
                "vault_factory_metrics.total_proceeds_received_sum",
                "vault_factory_metrics.total_shortfall_received_sum",
                "vault_factory_metrics.total_collateral_sum",
            ],
            "timeDimensions": [
                {"dimension": "vault_factory_metrics.day", "granularity": "day"}
            ],
            "order": {"vault_factory_metrics.liquidating_collateral_avg": "desc"},
        }
    )

def test_vault_factory_governance_by_manager_idx():
    request(
        {
          "measures": [
            "vault_factory_governance.debt_limit_avg",
            "vault_factory_governance.interest_rate_avg",
            "vault_factory_governance.liquidation_margin_avg",
            "vault_factory_governance.liquidation_padding_avg",
            "vault_factory_governance.mint_fee_avg"
          ],
          "timeDimensions": [
            {
              "dimension": "vault_factory_governance.day",
              "granularity": "day"
            }
          ],
          "order": {
            "vault_factory_governance.debt_limit_avg": "desc"
          },
          "dimensions": [
            "vault_factory_governance.manager_idx"
          ]
        }
    )

def test_vault_factory_governance_stats():
    request(
        {
          "measures": [
            "vault_factory_governance.debt_limit_sum",
          ],
          "timeDimensions": [
            {
              "dimension": "vault_factory_governance.day",
              "granularity": "day"
            }
          ]
        }
    )
