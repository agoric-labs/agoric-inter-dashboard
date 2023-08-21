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
