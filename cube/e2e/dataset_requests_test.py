import requests
import json
import os

API_URL = os.getenv("API_URL", "http://localhost:4000")
DEFAULT_DATASET = os.getenv("DATASET_ID", "agoric_test")


def cube_request(query, dataset=DEFAULT_DATASET):
    url = f"{API_URL}/cubejs-api/{dataset}/v1/load"
    req = requests.post(url, json={"query": query})

    if req.status_code != requests.codes.ok:
        raise ValueError(req.status_code)

    res = req.json()

    if "error" in res:
        if res["error"] == "Continue wait":
            return cube_request(query, dataset)

        raise ValueError(res["error"])

    return json.dumps(res["data"], indent=4)


def test_oracle_prices(snapshot):
    query = {
        "measures": ["oracle_prices.rate_avg"],
        "dimensions": ["oracle_prices.price_feed_name"],
        "timeDimensions": [{"dimension": "oracle_prices.day", "granularity": "day"}],
        "order": {"oracle_prices.day": "asc"},
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_reserve(snapshot):
    query = {
        "measures": [
            "reserve.shortfall_balance_avg",
            "reserve.total_fee_minted_avg",
            "reserve.total_fee_burned_avg",
        ],
        "timeDimensions": [{"dimension": "reserve.day", "granularity": "day"}],
        "order": {"oracle_prices.day": "asc"},
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_reserve_allocations_by_key_and_brand(snapshot):
    query = {
        "measures": [
            "reserve_allocations.amount_avg",
            "reserve_allocations.amount_usd_avg",
            "reserve_allocations.amount_usd_sum",
        ],
        "timeDimensions": [
            {"dimension": "reserve_allocations.day", "granularity": "day"}
        ],
        "dimensions": ["reserve_allocations.key", "reserve_allocations.brand"],
        "order": [["reserve_allocations.day", "asc"]],
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_reserve_allocations_stats(snapshot):
    query = {
        "measures": ["reserve_allocations.amount_usd_sum"],
        "timeDimensions": [
            {"dimension": "reserve_allocations.day", "granularity": "day"}
        ],
        "order": {"reserve_allocations.day": "asc"},
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_psm_governance_by_coin(snapshot):
    query = {
        "measures": ["psm_governance.mint_limit_avg", "psm_governance.mint_limit_sum"],
        "timeDimensions": [{"dimension": "psm_governance.day", "granularity": "day"}],
        "order": {"psm_governance.mint_limit_avg": "desc"},
        "dimensions": ["psm_governance.coin"],
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_psm_governance_by_coin(snapshot):
    query = {
        "measures": ["psm_governance.mint_limit_avg", "psm_governance.mint_limit_sum"],
        "timeDimensions": [{"dimension": "psm_governance.day", "granularity": "day"}],
        "order": {"psm_governance.mint_limit_avg": "desc"},
        "dimensions": ["psm_governance.coin"],
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_psm_governance_stats(snapshot):
    query = {
        "measures": ["psm_governance.mint_limit_sum"],
        "timeDimensions": [{"dimension": "psm_governance.day", "granularity": "day"}],
        "order": {"psm_governance.mint_limit_avg": "desc"},
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_psm_stats_by_coin(snapshot):
    query = {
        "timeDimensions": [{"dimension": "psm_stats.day", "granularity": "day"}],
        "order": {"psm_stats.day": "asc"},
        "dimensions": ["psm_stats.coin"],
        "measures": [
            "psm_stats.anchor_pool_balance_avg",
            "psm_stats.fee_pool_balance_avg",
            "psm_stats.minted_pool_balance_avg",
            "psm_stats.total_minted_provided_avg",
            "psm_stats.total_anchor_provided_avg",
            "psm_stats.utilization_rate_avg",
        ],
    }

    snapshot.assert_match(cube_request(query), "data.json")


def test_psm_stats(snapshot):
    query = {
        "measures": ["psm_stats.minted_pool_balance_sum"],
        "timeDimensions": [{"dimension": "psm_stats.day", "granularity": "day"}],
        "order": {"psm_stats.day": "asc"},
    }

    snapshot.assert_match(cube_request(query), "data.json")
