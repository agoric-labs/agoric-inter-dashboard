#!/usr/bin/env python

import json
import datetime

global_id = 0


def push(data):
    print(json.dumps(data))


def get_state_change_module(path):
    return ".".join(path.split(".")[0:2])


def wrap_state_change(path, body):
    global global_id
    global_id += 1

    block_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

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


def token(val):
    return round(val * pow(10, 6))


def symmetric_range(start, stop, step):
    values = list(range(start, stop, step))
    return values + values[::-1]


if __name__ == "__main__":
    # reserves
    for n in symmetric_range(token(5000), token(25000), token(1000)):
        push(gen_reserve_metrics(n, n / pow(10, 4)))
