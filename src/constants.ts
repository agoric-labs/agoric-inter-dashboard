export const GET_MODULE_ACCOUNTS_URL = 'https://main-a.api.agoric.net:443/cosmos/auth/v1beta1/module_accounts';

export const GET_ACCOUNT_BALANCE_URL = (address: string) => `https://main-a.api.agoric.net:443/cosmos/bank/v1beta1/balances/${address}`;

export const GET_INTERCHAIN_BALANCES_URL = 'https://rickhouse.agoric-core.workers.dev/inter-balances';

export const UIST_DENOMINATION = 'uist';

export const VBANK_RESERVE_ACCOUNT = 'vbank/reserve';

export const GRAPH_DAYS = 90;

export const SUBQUERY_URL = 'https://index-api.onfinality.io/sq/agoric-labs/agoric-mainnet-v2';

export const enum VAULT_STATES {
  ACTIVE = 'active',
  LIQUIDATED = 'liquidated',
  LIQUIDATING = 'liquidating',
  CLOSED = 'closed',
}
