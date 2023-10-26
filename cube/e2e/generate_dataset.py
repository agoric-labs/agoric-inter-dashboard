#!/usr/bin/env python

import json
import datetime

global_id = 0
day_count = 40
eight_interval_count = day_count * 3
start_time = datetime.datetime(2023, 10, 25) - datetime.timedelta(days=day_count)


def push(data):
    print(json.dumps(data))


def wrap_state_change(path, body, block_time=None):
    global global_id
    global_id += 1

    if block_time is None:
        block_time = start_time + datetime.timedelta(hours=global_id * 8)

    module = ".".join(path.split(".")[0:2])

    return {
        "type": "RECORD",
        "stream": "state_changes",
        "record": {
            "id": f"{global_id}:{module}",
            "block_height": global_id,
            "block_time": block_time.strftime("%Y-%m-%dT%H:%M:%S.%f"),
            "path": path,
            "module": module,
            "idx": 0,
            "slots": "[]",
            "body": json.dumps(body),
        },
    }


def gen_reserve_metrics(fee, atom):
    shortfall_balance = round(fee * 0.4)
    total_fee_burned = round(fee * 0.6)
    total_fee_minted = round(fee * 0.8)

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
            "__value": f"{shortfall_balance}",
            "brand": "$1",
            "value": f"+{shortfall_balance}",
        },
        "totalFeeBurned": {
            "__brand": "token",
            "__value": f"{total_fee_burned}",
            "brand": "$1",
            "value": f"+{total_fee_burned}",
        },
        "totalFeeMinted": {
            "__brand": "token",
            "__value": f"{total_fee_minted}",
            "brand": "$1",
            "value": f"+{total_fee_minted}",
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


def gen_psm_governance(token, mint_limit, block_time):
    rec = {
        "current": {
            "Electorate": {
                "type": "invitation",
                "value": {
                    "__brand": "Zoe Invitation",
                    "brand": {
                        "@qclass": "slot",
                        "iface": "Alleged: Zoe Invitation brand",
                        "index": 0,
                    },
                    "value": [
                        {
                            "__handle": "InvitationHandle",
                            "__installation": "BundleInstallation",
                            "__instance": "InstanceHandle",
                            "description": "questionPoser",
                            "handle": {
                                "@qclass": "slot",
                                "iface": "Alleged: InvitationHandle",
                                "index": 1,
                            },
                            "installation": {
                                "@qclass": "slot",
                                "iface": "Alleged: BundleInstallation",
                                "index": 2,
                            },
                            "instance": {
                                "@qclass": "slot",
                                "iface": "Alleged: InstanceHandle",
                                "index": 3,
                            },
                        }
                    ],
                },
            },
            "GiveMintedFee": {
                "type": "ratio",
                "value": {
                    "denominator": {
                        "__brand": "IST",
                        "__value": "10000",
                        "brand": {
                            "@qclass": "slot",
                            "iface": "Alleged: IST brand",
                            "index": 4,
                        },
                        "value": {"@qclass": "bigint", "digits": "10000"},
                    },
                    "numerator": {
                        "__brand": "IST",
                        "__value": "0",
                        "brand": {"@qclass": "slot", "index": 4},
                        "value": {"@qclass": "bigint", "digits": "0"},
                    },
                },
            },
            "MintLimit": {
                "type": "amount",
                "value": {
                    "__brand": "IST",
                    "__value": f"{mint_limit}",
                    "brand": {"@qclass": "slot", "index": 4},
                    "value": {"@qclass": "bigint", "digits": f"{mint_limit}"},
                },
            },
            "WantMintedFee": {
                "type": "ratio",
                "value": {
                    "denominator": {
                        "__brand": "IST",
                        "__value": "10000",
                        "brand": {"@qclass": "slot", "index": 4},
                        "value": {"@qclass": "bigint", "digits": "10000"},
                    },
                    "numerator": {
                        "__brand": "IST",
                        "__value": "0",
                        "brand": {"@qclass": "slot", "index": 4},
                        "value": {"@qclass": "bigint", "digits": "0"},
                    },
                },
            },
        }
    }

    return wrap_state_change(f"published.psm.IST.${token}.governance", rec, block_time)


def gen_psm_metrics(token, amount, total):
    rec = {
        "anchorPoolBalance": {
            "__brand": token,
            "__value": f"{amount}",
            "brand": f"$0.Alleged: {token} brand",
            "value": f"+{amount}",
        },
        "feePoolBalance": {
            "__brand": "IST",
            "__value": "0",
            "brand": "$1.Alleged: IST brand",
            "value": "+0",
        },
        "mintedPoolBalance": {
            "__brand": "IST",
            "__value": f"{amount}",
            "brand": "$1",
            "value": f"+{amount}",
        },
        "totalAnchorProvided": {
            "__brand": token,
            "__value": f"{total}",
            "brand": "$0",
            "value": f"+{total}",
        },
        "totalMintedProvided": {
            "__brand": "IST",
            "__value": f"{total}",
            "brand": "$1",
            "value": f"+{total}",
        },
    }

    return wrap_state_change(f"published.psm.IST.${token}.metrics", rec)


def token(val):
    return round(val * pow(10, 6))


def symmetric_range(start, stop):
    step = round((stop - start) / (eight_interval_count / 2))
    values = list(range(start, stop, step))
    return values + values[::-1]


def reset_global_id():
    global global_id
    global_id = 0


if __name__ == "__main__":
    middle_time = start_time + datetime.timedelta(days=15)

    # oracle prices
    for n in symmetric_range(token(6), token(12)):
        push(gen_oracle_price_metrics("ATOM", 1000000, n))

    reset_global_id()

    # oracle prices
    for n in symmetric_range(token(8), token(11)):
        push(gen_oracle_price_metrics("stATOM", 1000000, n))

    reset_global_id()

    # reserves
    for n in symmetric_range(token(5000), token(25000)):
        push(gen_reserve_metrics(n, n / 10))

    reset_global_id()

    # psm DAI_grv metrics
    push(gen_psm_governance("DAI_grv", token(500000), start_time))
    push(gen_psm_governance("DAI_grv", token(600000), middle_time))

    total = 0
    prev = 0

    for n in symmetric_range(token(1000), token(400000)):
        total += max(n - prev, 0)
        prev = n
        push(gen_psm_metrics("DAI_grv", n, total))

    reset_global_id()

    # psm USDC_axl metrics
    push(gen_psm_governance("USDC_axl", token(1500000), start_time))

    total = 0
    prev = 0

    for n in symmetric_range(token(2000), token(800000)):
        total += max(n - prev, 0)
        prev = n
        push(gen_psm_metrics("USDC_axl", n, total))

    reset_global_id()
