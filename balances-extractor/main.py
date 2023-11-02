#!/usr/bin/env python

import os
import time
import ujson
import sys
import multiprocessing
import functools
import requests
import subprocess


BALANCES_SCHEMA = {
    "type": "SCHEMA",
    "stream": "balances",
    "key_properties": ["denom"],
    "schema": {
        "required": ["id", "block_height", "address", "denom", "amount"],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string"},
            "block_height": {"type": "integer"},
            "address": {"type": "string"},
            "denom": {"type": "string"},
            "amount": {"type": "string"},
        },
    },
}


def process(height, extra_args, grpc_addr, jsonline):
    data = ujson.loads(jsonline)

    command = [
        "grpcurl",
        "-H",
        f"x-cosmos-block-height: {height}",
        "-d",
        ujson.dumps(
            {
                "pagination": {"limit": 100},
                "address": data["address"],
            }
        ),
        grpc_addr,
        "cosmos.bank.v1beta1.Query/AllBalances",
    ]

    for arg in reversed(extra_args):
        command.insert(1, arg)

    retry_idx = 0

    while True:
        try:
            print(f"Load data for {data['address']}", file=sys.stderr)
            command_res = ujson.loads(subprocess.check_output(command, stderr=subprocess.STDOUT))
            break
        except subprocess.CalledProcessError as e:  # ignore all errors
            err_text = e.output.decode("utf-8")

            if "context deadline exceeded" in err_text and retry_idx < 10:
                retry_idx += 1
                print("retry after timeout", file=sys.stderr)
                time.sleep(retry_idx * 10)
                continue

            print(f"Command failed with error {e.returncode} retry: {retry_idx}.", file=sys.stderr)
            print(f"Output:\n{err_text}", file=sys.stderr)
            return []

    if "balances" not in command_res:
        return []

    lines = []

    for item in command_res["balances"]:
        record = {
            "type": "RECORD",
            "stream": BALANCES_SCHEMA["stream"],
            "record": {
                "id": f"{height}:{data['address']}:{item['denom']}",
                "address": data["address"],
                "block_height": height,
                "denom": item["denom"],
                "amount": item["amount"],
            },
        }

        lines.append(ujson.dumps(record))

    return lines


def get_current_height(rpc_url):
    res = requests.get(rpc_url + "/status").json()
    return int(res["result"]["sync_info"]["latest_block_height"])


if __name__ == "__main__":
    print(ujson.dumps(BALANCES_SCHEMA))

    if os.getenv("ONLY_SCHEMA") is not None:
        exit(0)

    height = os.getenv("BLOCK_HEIGHT")
    if height is None:
        height = get_current_height(os.environ["RPC_URL"]) - 1

    worker_count = int(os.getenv("WORKER_COUNT", 128))
    grpc_addr = os.environ["GRPC_ADDR"]
    process_with_args = functools.partial(process, height, sys.argv[1:], grpc_addr)

    with multiprocessing.Pool(worker_count) as p:
        # bqreader "..." | python main.py
        for lines in p.imap(process_with_args, sys.stdin):
            for line in lines:
                print(line)
