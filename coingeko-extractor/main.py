#!/usr/bin/env python

import os
import json
import time
import requests

from datetime import datetime, timedelta

COINGEKO_HISTORY_SCHEMA = {
    "type": "SCHEMA",
    "stream": "coingeko_history",
    "key_properties": [],
    "schema": {
        "required": ["day", "coin_id", "name", "current_price_usd", "market_data"],
        "type": "object",
        "additionalProperties": False,
        "time_field": "day",
        "properties": {
            "day": {"type": "string", "format": "date"},
            "coin_id": {"type": "string"},
            "name": {"type": "string"},
            "current_price_usd": {"type": "string", "format": "decimal"},
            "market_data": {"type": "object"},
        },
    },
}

def extract(day, coin_id):
    date = day.strftime("%-d-%m-%Y")
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/history?date={date}"
    res = requests.get(url, timeout=10).json()

    record = {
        "type": "RECORD",
        "stream": COINGEKO_HISTORY_SCHEMA["stream"],
        "record": {
            "day": day.strftime("%Y-%m-%d"),
            "coin_id": coin_id,
            "name": res["name"],
            "current_price_usd": str(res["market_data"]["current_price"]["usd"]),
            "market_data": json.dumps(res["market_data"]),
        },
    }

    print(json.dumps(record))

if __name__ == "__main__":
    print(json.dumps(COINGEKO_HISTORY_SCHEMA))

    day = os.getenv("DAY")
    if day is None:
        day = datetime.utcnow() - timedelta(hours=4)
    else:
        day = datetime.strptime(day, "%d-%m-%Y")

    coin_id = os.getenv("COIN_ID")
    if coin_id is None:
        raise ValueError("COIN_ID not set")

    extract(day, coin_id)

    depth = max(0, int(os.getenv("DEPTH", 0)))
    delta = timedelta(days=1)

    while depth > 0:
        day -= delta
        depth -= 1
        extract(day, coin_id)
        time.sleep(10) # Public API: Rate limit /min: 10-30*, 6 here
