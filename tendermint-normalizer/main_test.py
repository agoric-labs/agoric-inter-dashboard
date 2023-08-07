import json

from main import resolve_brand_names_and_values, extract_storage_path


def test_extract_storage_path():
    assert extract_storage_path("3\x00published\x00auction\x00book0") == "published.auction.book0"


def test_resolve_brand_names():
    body = {
        "Electorate": {
            "type": "invitation",
            "value": {
                "brand": "$0.Alleged: Zoe Invitation brand",
                "value": [
                    {
                        "description": "questionPoser",
                        "handle": "$1.Alleged: InvitationHandle",
                        "installation": "$2.Alleged: BundleIDInstallation",
                        "instance": "$3.Alleged: InstanceHandle",
                    }
                ],
            },
        },
        "nested1": {
            "GiveMintedFee": {
                "type": "ratio",
                "value": {
                    "denominator": {"brand": "$4.Alleged: IST brand", "value": "+10000"},
                    "numerator": {"brand": "$4", "value": "+0"},
                },
            },
            "nested2": {
                "MintLimit": {"type": "amount", "value": {"brand": "$4", "value": "+133337000000"}},
                "WantMintedFee": {
                    "type": "ratio",
                    "value": {
                        "denominator": {"brand": "$4", "value": "+10000"},
                        "numerator": {"brand": "$4", "value": "+0"},
                    },
                },
            },
        },
    }

    resolve_brand_names_and_values(body)

    assert body == {
        "Electorate": {
            "type": "invitation",
            "value": {
                "brand": "$0.Alleged: Zoe Invitation brand",
                "__brand": "Zoe Invitation",
                "value": [
                    {
                        "description": "questionPoser",
                        "handle": "$1.Alleged: InvitationHandle",
                        "installation": "$2.Alleged: BundleIDInstallation",
                        "instance": "$3.Alleged: InstanceHandle",
                        "__installation": "BundleIDInstallation",
                        "__handle": "InvitationHandle",
                        "__instance": "InstanceHandle",
                    }
                ],
            },
        },
        "nested1": {
            "GiveMintedFee": {
                "type": "ratio",
                "value": {
                    "denominator": {
                        "brand": "$4.Alleged: IST brand",
                        "__brand": "IST",
                        "value": "+10000",
                        "__value": "10000",
                    },
                    "numerator": {"brand": "$4", "__brand": "IST", "value": "+0", "__value": "0"},
                },
            },
            "nested2": {
                "MintLimit": {
                    "type": "amount",
                    "value": {
                        "brand": "$4",
                        "__brand": "IST",
                        "value": "+133337000000",
                        "__value": "133337000000",
                    },
                },
                "WantMintedFee": {
                    "type": "ratio",
                    "value": {
                        "denominator": {
                            "brand": "$4",
                            "__brand": "IST",
                            "value": "+10000",
                            "__value": "10000",
                        },
                        "numerator": {
                            "brand": "$4",
                            "__brand": "IST",
                            "value": "+0",
                            "__value": "0",
                        },
                    },
                },
            },
        },
    }


def test_resolve_old_brand_names():
    body = {
        "Electorate": {
            "type": "invitation",
            "value": {
                "brand": {"@qclass": "slot", "iface": "Alleged: Zoe Invitation brand", "index": 0},
                "value": [
                    {
                        "description": "questionPoser",
                        "handle": "$1.Alleged: InvitationHandle",
                        "installation": "$2.Alleged: BundleIDInstallation",
                        "instance": "$3.Alleged: InstanceHandle",
                    }
                ],
            },
        },
        "nested1": {
            "GiveMintedFee": {
                "type": "ratio",
                "value": {
                    "denominator": {
                        "brand": "$4.Alleged: IST brand",
                        "value": {"@qclass": "bigint", "digits": "10000000"},
                    },
                    "numerator": {"brand": "$4", "value": "+0"},
                },
            },
            "nested2": {
                "MintLimit": {"type": "amount", "value": {"brand": "$4", "value": "+133337000000"}},
                "WantMintedFee": {
                    "type": "ratio",
                    "value": {
                        "denominator": {"brand": "$4", "value": "+10000"},
                        "numerator": {"brand": "$4", "value": "+0"},
                    },
                },
            },
        },
    }

    resolve_brand_names_and_values(body)

    assert body == {
        "Electorate": {
            "type": "invitation",
            "value": {
                "brand": {"@qclass": "slot", "iface": "Alleged: Zoe Invitation brand", "index": 0},
                "__brand": "Zoe Invitation",
                "value": [
                    {
                        "description": "questionPoser",
                        "handle": "$1.Alleged: InvitationHandle",
                        "__handle": "InvitationHandle",
                        "installation": "$2.Alleged: BundleIDInstallation",
                        "__installation": "BundleIDInstallation",
                        "instance": "$3.Alleged: InstanceHandle",
                        "__instance": "InstanceHandle",
                    }
                ],
            },
        },
        "nested1": {
            "GiveMintedFee": {
                "type": "ratio",
                "value": {
                    "denominator": {
                        "brand": "$4.Alleged: IST brand",
                        "__brand": "IST",
                        "value": {"@qclass": "bigint", "digits": "10000000"},
                        "__value": "10000000",
                    },
                    "numerator": {"brand": "$4", "__brand": "IST", "value": "+0", "__value": "0"},
                },
            },
            "nested2": {
                "MintLimit": {
                    "type": "amount",
                    "value": {"brand": "$4", "__brand": "IST", "value": "+133337000000", "__value": "133337000000"},
                },
                "WantMintedFee": {
                    "type": "ratio",
                    "value": {
                        "denominator": {
                            "brand": "$4",
                            "__brand": "IST",
                            "value": "+10000",
                            "__value": "10000",
                        },
                        "numerator": {
                            "brand": "$4",
                            "__brand": "IST",
                            "value": "+0",
                            "__value": "0",
                        },
                    },
                },
            },
        },
    }
