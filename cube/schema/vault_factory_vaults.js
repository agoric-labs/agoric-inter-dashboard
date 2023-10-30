import { dailySQL } from '../utils';

cube(`vault_factory_governance`, {
  sql: dailySQL(
    [
    ],
    ['manager_idx', 'vault_idx', 'collateral_type'],
    `
      select block_time
           , replace(split(path, '.')[3], 'manager', '') as manager_idx
           , replace(split(path, '.')[4], 'vault', '') as vault_idx
           , json_value(body, '$.vaultState') as state
       from ${state_changes.sql()}
      where module = 'published.vaultFactory'
        -- and ${FILTER_PARAMS.vault_factory_governance.day.filter('block_time')}
        and split(path, '.')[safe_offset(2)] = 'managers'
        and split(path, '.')[safe_offset(4)] = 'vaults'
    `,
  ),

});
