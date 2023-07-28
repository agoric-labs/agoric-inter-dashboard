# Requests

TODO:

 - cube description
 - pre-aggregations description
 - how to make requests

## PSM Stats

```json
{
  "order": {
    "psm_governance.last_mint_limit": "desc"
  },
  "measures": [
    "psm_governance.last_mint_limit",
    "psm_stats.last_minted_pool_balance",
    "psm_stats.last_utilization_rate"
  ],
  "dimensions": [
    "psm_stats.coin"
  ],
  "timeDimensions": [
    {
      "dimension": "psm_stats.day",
      "granularity": "day",
      "dateRange": "Today"
    }
  ]
}
```

## Reserve

```json
{
  "measures": [
    "reserve.atom_amount_avg",
    "reserve.fee_amount_avg"
  ],
  "timeDimensions": [
    {
      "dimension": "reserve.day",
      "granularity": "day",
      "dateRange": "Today"
    }
  ]
}
```

## Vault managers

```json
{
  "measures": [
    "vault_managers.total_locked_collateral",
    "vault_managers.total_locked_collateral_usd",
    "vault_managers.total_ist_minted",
    "vault_managers.colletarization_ratio",
    "vault_managers.ist_minting_limit",
    "vault_managers.utilization_rate"
  ],
  "timeDimensions": [
    {
      "dimension": "vault_managers.day",
      "granularity": "day",
      "dateRange": "Today"
    }
  ],
  "order": {
    "vault_managers.total_locked_collateral": "desc"
  },
  "dimensions": [
    "vault_managers.type"
  ]
}
```
