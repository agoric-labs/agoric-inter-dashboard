#!/usr/bin/env python

import requests
import sys
import ujson
import re
import os
import dateutil

from multiprocessing import Pool
from base64 import b64decode
from hashlib import sha256
from datetime import datetime

# TODO: remove this global variable
output_records = []


def to_datetime(val):
    # However, Python's datetime also supports only up to microseconds precision.
    val = val[:-4] + "Z"
    return datetime.strptime(val, "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%dT%H:%M:%S.%f")


def extract_brand(str):
    return str.replace("Alleged: ", "").replace(" brand", "")


def extract_storage_path(value):
    parts = value.split("\x00")
    length = int(parts.pop(0))

    if length != len(parts):
        raise ValueError(f"unexpected path {value}")

    return ".".join(parts)


def resolve_brand_names_and_values(body, names={}):
    # https://github.com/endojs/endo/blob/53973bddbf73f681640ed9b7dd7bafdc2f8a3126/packages/marshal/src/encodeToSmallcaps.js#L47-L59
    slot_pattern = r"^\$(\d+).?(.*)"
    number_pattern = r"^[\+-]{1}(\d+)$"

    if isinstance(body, dict):
        for key in list(body):
            value = body[key]

            # depricated but exists in chains
            if isinstance(value, dict):
                if "@qclass" in value and value["@qclass"] == "slot":
                    if "iface" in value:
                        names[value["index"]] = extract_brand(value["iface"])

                    if value["index"] in names:
                        body["__" + key] = names[value["index"]]

                if "@qclass" in value and value["@qclass"] == "bigint":
                    body["__" + key] = value["digits"]

            # smallcaps
            if isinstance(value, str):
                sm = re.findall(slot_pattern, value)
                if len(sm) > 0:
                    idx = int(sm[0][0])

                    if sm[0][1] != "":
                        names[idx] = extract_brand(sm[0][1])

                    if idx in names:
                        body["__" + key] = names[idx]

                    continue

                nm = re.findall(number_pattern, value)
                if nm:
                    body["__" + key] = nm[0]
            else:
                resolve_brand_names_and_values(value, names)
    elif isinstance(body, list):
        for item in body:
            resolve_brand_names_and_values(item, names)

def write_state_change(event, block_meta):
    if event["attributes"]["store"] != "vstorage":
        raise ValueError("unknown storage")

    body = ujson.loads(event["attributes"]["value"])
    path = extract_storage_path(event["attributes"]["key"])

    if "values" not in body:
        print(f"too old state_change: {block_meta['block_height']}: {ujson.dumps(body)}", file=sys.stderr)
        return

    for idx, change_raw in enumerate(body["values"]):
        change_body = ujson.loads(change_raw)
        payload = ujson.loads(re.sub(r"^#", "", change_body["body"]))  # trim # at start

        resolve_brand_names_and_values(payload)

        rec = {
            "id": f"{event['id']}:{idx}",
            "path": path,
            "idx": idx,
            "slots": ujson.dumps(change_body["slots"]),
            "body": ujson.dumps(payload),
        }

        rec.update(block_meta)

        write_record("state_changes", rec)


def write_record(stream, data):
    rec = {
        "type": "RECORD",
        "stream": stream,
        "record": data,
    }

    output_records.append(ujson.dumps(rec))


def write_schema(name):
    with open(f"schemas/{name}.json", "r") as file:
        # compact to one line
        schema = ujson.loads(file.read())
        print(ujson.dumps(schema))


def null_str(v):
    if v is None:
        return None

    return str(v)


def prepare_event(phase_type, data, block_meta, idx, transaction_id=None):
    attrs = {}

    for attr in data["attributes"]:
        key = b64decode(attr["key"]).decode()

        if attr["value"] is not None:
            attrs[key] = b64decode(attr["value"]).decode()

    rec = {
        "id": f"{block_meta['block_height']}:{idx}",
        "phase_type": phase_type,
        "event_type": data["type"],
        "idx": idx,
        "attributes": attrs,
        "transaction_id": transaction_id,
    }

    rec.update(block_meta)

    return rec


def parse_amount(val):
    if val is None:
        return None

    match = re.search(r"^[\d\.]+", val)

    if match:
        return float(match.group())

    return None


def write_validators(pages, events, block, block_meta):
    extra_data = []
    extra_indices = {}
    proposer_addr = None

    # extract rewards and a commission of the PREVIOS block
    for idx, event in enumerate(events):
        if event["phase_type"] == "begin_block" and event["event_type"] == "proposer_reward":
            proposer_addr = event["attributes"]["validator"]

        if event["phase_type"] != "begin_block" or event["event_type"] != "commission":
            continue

        next_event = events[idx + 1]
        if next_event["event_type"] != "rewards":
            raise ValueError("next_event.type must me rewards")

        addr = next_event["attributes"]["validator"]
        if next_event["attributes"]["validator"] != addr:
            raise ValueError("next_event must has same validator")

        if addr not in extra_indices:
            extra_indices[addr] = len(extra_data)
            extra_data.append(
                {
                    "valoper_addr": addr,
                    "rewards": parse_amount(next_event["attributes"].get("amount")),
                    "commission": parse_amount(event["attributes"].get("amount")),
                    "proposer_reward": None,
                }
            )
        else:
            if addr != proposer_addr:
                raise ValueError("unexpected proposer")

            rec = extra_data[extra_indices[addr]]
            rec["proposer_reward"] = rec["rewards"]
            rec["rewards"] = (rec["rewards"] or 0) + (parse_amount(next_event["attributes"].get("amount")) or 0)
            rec["commission"] = (rec["commission"] or 0) + (parse_amount(event["attributes"].get("amount")) or 0)

    # by default events starting from the proposer
    # sort by rewards for get correct indices
    extra_data.sort(key=lambda x: (x["rewards"] or 0) - (x["proposer_reward"] or 0), reverse=True)

    validator_idx = 0

    for page in pages:
        for val in page["validators"]:
            extra = extra_data[validator_idx]
            validator_idx += 1

            rec = {
                "id": f"{page['block_height']}:{val['address']}:{validator_idx}",
                "pubkey_hex": val["address"],
                "voting_power": int(val["voting_power"]),
                "proposer_priority": int(val["proposer_priority"]),
                "valoper_addr": extra["valoper_addr"],
                "proposer_reward": null_str(extra["proposer_reward"]),
                "rewards": null_str(extra["rewards"]),
                "commission": null_str(extra["commission"]),
            }

            rec.update(block_meta)

            write_record("validators", rec)

    if validator_idx != len(extra_data):
        raise ValueError("unexpected extra_data size")

    return proposer_addr


def decode_tx(data):
    url = os.environ["DECODE_SERVICE_URL"]

    # special url for e2e tests
    if url == "skip_for_tests":
        return None

    res = requests.post(os.environ["DECODE_SERVICE_URL"], data=data)

    if res.status_code != 200:
        return None

    return res.json()


def write_msg(tx_id, block_meta, idx, data):
    type = data.pop("@type")

    rec = {
        "id": f"{tx_id}:{idx}",
        "transaction_id": tx_id,
        "idx": idx,
        "type": type,
        "body": ujson.dumps(data),
    }

    rec.update(block_meta)

    write_record("messages", rec)


def write_tx(id, block_meta, idx, data, extra):
    rec = {
        "id": id,
        "idx": idx,
        "body": None,
        "body_encoded": None,
    }

    rec.update(extra)
    rec.update(block_meta)

    write_record("transactions", rec)


def get_tx_hash(data):
    return sha256(b64decode(data)).hexdigest().upper()


def get_tx_id(height, hash):
    return f"{height}:{hash}"


def write_txs_and_msgs(block, tx_extra, block_meta):
    height = int(block["block"]["header"]["height"])
    msg_count = 0

    with Pool(16) as pool:
        raw_txs = block["block"]["data"]["txs"]
        decoded_txs = pool.map(decode_tx, block["block"]["data"]["txs"])

        for idx, tx in enumerate(decoded_txs):
            tx_hash = get_tx_hash(raw_txs[idx])
            tx_id = get_tx_id(height, tx_hash)

            if tx is not None:
                for msg_idx, msg in enumerate(tx["body"]["messages"]):
                    write_msg(tx_id, block_meta, msg_idx, msg)
                    msg_count += 1

                del tx["body"]["messages"]

                tx_extra[idx]["body_encoded"] = ujson.dumps(tx)  # dump tx data without messages
            else:
                tx_extra[idx]["body"] = ujson.dumps(tx)  # block.data.txs will be deleted

            tx_extra[idx]["hash"] = tx_hash

            write_tx(tx_id, block_meta, idx, tx, tx_extra[idx])

    return msg_count


def print_block_and_others(row):
    entities = row["entities"]
    height = int(row["height"])

    block = entities["blocks"][0]
    block_results = entities["block_results"][0]

    events = []
    tx_extra = []

    block_meta = {
        "block_height": height,
        "block_time": to_datetime(block["block"]["header"]["time"]),
    }

    if block_results["begin_block_events"] is not None:
        for event in block_results["begin_block_events"]:
            events.append(prepare_event("begin_block", event, block_meta, len(events)))

        # reduce the dataset size
        del block_results["begin_block_events"]

    if block_results["end_block_events"] is not None:
        for event in block_results["end_block_events"]:
            rec = prepare_event("end_block", event, block_meta, len(events))
            events.append(rec)

            # agoric specific
            if rec["event_type"] == "state_change":
                write_state_change(rec, block_meta)

        # reduce the dataset size
        del block_results["end_block_events"]

    if block_results["txs_results"] is not None:
        for idx, res in enumerate(block_results["txs_results"]):
            tx_hash = get_tx_hash(block["block"]["data"]["txs"][idx])
            tx_id = get_tx_id(height, tx_hash)

            for event in res["events"]:
                events.append(prepare_event("tx", event, block_meta, len(events), tx_id))

            tx_extra.append(
                {
                    "code": res["code"],
                    "gas_wanted": int(res["gas_wanted"]),
                    "gas_used": int(res["gas_used"]),
                }
            )

        # reduce the dataset size
        del block_results["txs_results"]

    write_validators(entities["validators"], events, block, block_meta)

    for event in events:
        event["attributes"] = ujson.dumps(event["attributes"])
        write_record("events", event)

    tx_count = len(block["block"]["data"]["txs"])
    msg_count = write_txs_and_msgs(block, tx_extra, block_meta)

    # reduce the dataset size
    del block["block"]["data"]["txs"]

    block_rec = {
        "event_count": len(events),
        "transaction_count": tx_count,
        "message_count": msg_count,
        "validator_count": len(block["block"]["last_commit"]["signatures"]),
        "body": ujson.dumps(block),  # the block without decoded fields
        "block_results_body": ujson.dumps(block_results),  # the block_results without events
    }

    block_rec.update(block_meta)

    write_record("blocks", block_rec)


BLOCKS_SCHEMA = {
    "type": "SCHEMA",
    "stream": "blocks",
    "key_properties": [],
    "time_property": "block_time",
    "schema": {
        "required": [
            "block_height",
            "block_time",
            "event_count",
            "tx_count",
            "msg_count",
            "validator_count",
            "body",
            "block_results_body",
        ],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "block_height": {"type": "integer"},
            "block_time": {"type": "string", "format": "date-time"},
            "event_count": {"type": "integer"},
            "transaction_count": {"type": "integer"},
            "message_count": {"type": "integer"},
            "validator_count": {"type": "integer"},
            "body": {"type": "object"},
            "block_results_body": {"type": "object"},
        },
    },
}

EVENTS_SCHEMA = {
    "type": "SCHEMA",
    "stream": "events",
    "key_properties": ["phase_type", "event_type"],
    "time_property": "block_time",
    "schema": {
        "required": ["id", "block_height", "block_time", "idx", "phase_type", "event_type", "attributes"],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string"},
            "block_height": {"type": "integer"},
            "block_time": {"type": "string", "format": "date-time"},
            "idx": {"type": "integer"},
            "phase_type": {"type": "string"},
            "event_type": {"type": "string"},
            "attributes": {"type": "object"},
            "transaction_id": {"type": ["string", "null"]},
        },
    },
}

MESSAGES_SCHEMA = {
    "type": "SCHEMA",
    "stream": "messages",
    "key_properties": ["type"],
    "time_property": "block_time",
    "schema": {
        "required": ["id", "block_height", "block_time", "transaction_id", "idx", "type", "body"],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string"},
            "block_height": {"type": "integer"},
            "block_time": {"type": "string", "format": "date-time"},
            "transaction_id": {"type": "string"},
            "idx": {"type": "integer"},
            "type": {"type": "string"},
            "body": {"type": "object"},
        },
    },
}

TRANSACTIONS_SCHEMA = {
    "type": "SCHEMA",
    "stream": "transactions",
    "key_properties": ["code"],
    "time_property": "block_time",
    "schema": {
        "required": ["id", "block_height", "block_time", "idx", "code", "gas_used", "gas_wanted", "hash"],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string"},
            "block_height": {"type": "integer"},
            "block_time": {"type": "string", "format": "date-time"},
            "idx": {"type": "integer"},
            "code": {"type": "integer"},
            "gas_used": {"type": "number"},
            "gas_wanted": {"type": "number"},
            "hash": {"type": "string"},
            "body": {"type": ["string", "null"]},
            "body_encoded": {"type": "object"},
        },
    },
}

VALIDATORS_SCHEMA = {
    "type": "SCHEMA",
    "stream": "validators",
    "key_properties": [],
    "time_property": "block_time",
    "schema": {
        "required": ["id", "block_height", "block_time", "pubkey_hex", "voting_power", "proposer_priority"],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string"},
            "block_height": {"type": "integer"},
            "block_time": {"type": "string", "format": "date-time"},
            "valoper_addr": {"type": "string"},
            "pubkey_hex": {"type": "string"},
            "voting_power": {"type": "integer"},
            "proposer_priority": {"type": "integer"},
            "rewards": {"type": ["string", "null"]},
            "commission": {"type": ["string", "null"]},
            "proposer_reward": {"type": ["string", "null"]},
        },
    },
}

STATE_CHANGES_SCHEMA = {
    "type": "SCHEMA",
    "stream": "state_changes",
    "key_properties": ["path"],
    "time_property": "block_time",
    "schema": {
        "required": ["id", "block_height", "block_time", "path", "idx", "body", "slots"],
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string"},
            "block_height": {"type": "integer"},
            "block_time": {"type": "string", "format": "date-time"},
            "path": {"type": "string"},
            "idx": {"type": "integer"},
            "slots": {"type": "object"},
            "body": {"type": "object"},
        },
    },
}

if __name__ == "__main__":
    print(ujson.dumps(BLOCKS_SCHEMA))
    print(ujson.dumps(EVENTS_SCHEMA))
    print(ujson.dumps(TRANSACTIONS_SCHEMA))
    print(ujson.dumps(MESSAGES_SCHEMA))
    print(ujson.dumps(VALIDATORS_SCHEMA))
    print(ujson.dumps(STATE_CHANGES_SCHEMA))

    for line in sys.stdin:
        print_block_and_others(ujson.loads(line))

        # write only full data without errors
        for rec in output_records:
            print(rec)

        output_records = []
