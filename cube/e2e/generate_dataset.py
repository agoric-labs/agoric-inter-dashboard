#!/usr/bin/env python

import json
import datetime

global_id = 0
start_time = datetime.datetime(2023, 10, 25)


def push(data):
    print(json.dumps(data))


def get_state_change_module(path):
    return ".".join(path.split(".")[0:2])


def wrap_state_change(path, body):
    global global_id
    global_id += 1

    block_time = start_time + datetime.timedelta(hours=global_id)

    return {
        "type": "RECORD",
        "stream": "state_changes",
        "record": {
            "id": f"{global_id}",
            "block_height": global_id,
            "block_time": block_time.strftime("%Y-%m-%d %H:%M:%S.%f"),
            "path": path,
            "module": get_state_change_module(path),
            "idx": 0,
            "slots": "[]",
            "body": json.dumps(body),
        },
    }


def gen_reserve_metrics(fee, atom):
    rec = {
        "allocations": {
            "ATOM": {
                "__brand": "ATOM",
                "__value": f"{atom}",
                "brand": "$0.Alleged: ATOM brand",
                "value": f"+{atom}",
            },
            "Fee": {
                "__brand": "token",
                "__value": f"{fee}",
                "brand": "$1.Alleged: token brand",
                "value": f"+{fee}",
            },
        },
        "shortfallBalance": {
            "__brand": "token",
            "__value": "0",
            "brand": "$1",
            "value": "+0",
        },
        "totalFeeBurned": {
            "__brand": "token",
            "__value": "0",
            "brand": "$1",
            "value": "+0",
        },
        "totalFeeMinted": {
            "__brand": "token",
            "__value": "0",
            "brand": "$1",
            "value": "+0",
        },
    }

    return wrap_state_change("published.reserve.metrics", rec)


def gen_oracle_price_metrics(token, amount_in, amount_out):
    rec = {
        "__timer": "timerService",
        "amountIn": {
            "__brand": "Brand",
            "__value": f"{amount_in}",
            "brand": "$0.Alleged: Brand",
            "value": f"+{amount_in}",
        },
        "amountOut": {
            "__brand": "Brand",
            "__value": f"{amount_out}",
            "brand": "$1.Alleged: Brand",
            "value": f"+{amount_out}",
        },
        "timer": "$2.Alleged: timerService",
        "timestamp": {  # cubejs uses the block_time
            "__absValue": "1698242862",
            "__timerBrand": "timerBrand",
            "absValue": "+1698242862",
            "timerBrand": "$3.Alleged: timerBrand",
        },
    }

    return wrap_state_change(f"published.priceFeed.{token}-USD_price_feed", rec)


def token(val):
    return round(val * pow(10, 6))


def symmetric_range(start, stop, step):
    values = list(range(start, stop, step))
    return values + values[::-1]


if __name__ == "__main__":
    # oracle prices
    for n in symmetric_range(token(6), token(12), token(0.1)):
        print(n)
        push(gen_oracle_price_metrics("ATOM", 1000000, n))
        push(gen_oracle_price_metrics("stATOM", 1000000, n * 1.2))

    # reserves
    for n in symmetric_range(token(5000), token(25000), token(500)):
        push(gen_reserve_metrics(n, n / pow(10, 4)))
