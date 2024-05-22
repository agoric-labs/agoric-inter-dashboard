import { bech32 } from 'bech32';
import { BASE_NODE_URL, balancesKey } from './constants';

export async function refreshBalancesCache(env) {
  try {
    const balances = JSON.stringify(await getBalances());
    await updateCachedBalances(env, balances);
    console.log('Balances cache updated');
  } catch (error) {
    console.error('Scheduled task error:', error);
  }
}
export async function handleBalancesRequest(env) {
  let balances = await getCachedBalances(env);

  if (!balances) {
    console.log('Balances cache miss');
    balances = JSON.stringify(await getBalances());
    await updateCachedBalances(env, balances);
    console.log('Balances cache updated');
  } else {
    console.log('Balances cache hit');
  }

  return new Response(balances, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
    },
  });
}

async function getBalances() {
  console.log('Fetching channels...');
  const url = `${BASE_NODE_URL}/ibc/core/channel/v1/channels`;
  const response = await fetch(url, {
    cf: {
      cacheTtl: 3600,
      cacheEverything: true,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const balances = [];

  console.log('Fetching escrow balances...');
  for (const channel of data.channels.filter((ch) => ch.port_id === 'transfer')) {
    const address = await getEscrowAddress('transfer', channel.channel_id);
    const balancesUrl = `${BASE_NODE_URL}/cosmos/bank/v1beta1/balances/${address}`;
    const balanceResponse = await fetch(balancesUrl, {
      cf: {
        cacheTtl: 3600,
        cacheEverything: true,
      },
    });

    if (!balanceResponse.ok) {
      throw new Error(`HTTP error! status: ${balanceResponse.status}`);
    }

    const balanceData = await balanceResponse.json();

    balances.push({
      channel_id: channel.channel_id,
      address: address,
      balance: balanceData.balances,
    });
  }
  console.log('Done fetching!');
  console.log(balances);

  return { balances, height: data.height };
}
const getEscrowAddress = (port, channel) => {
  const version = 'ics20-1';
  const chainPrefix = 'agoric';

  const encoder = new TextEncoder();
  const versionBuffer = encoder.encode(version);
  const channelBuffer = encoder.encode(`${port}/${channel}`);
  const combined = new Uint8Array(versionBuffer.length + 1 + channelBuffer.length);
  combined.set(versionBuffer);
  combined.set([0], versionBuffer.length);
  combined.set(channelBuffer, versionBuffer.length + 1);

  const digest = crypto.subtle.digest('SHA-256', combined);
  return digest.then((hashBuffer) => {
    const hashArray = new Uint8Array(hashBuffer);
    const bech32Words = bech32.toWords(hashArray.slice(0, 20));
    const address = bech32.encode(chainPrefix, bech32Words);
    return address;
  });
};

async function updateCachedBalances(env, balances) {
  return env.InterchainBalancesCache.put(balancesKey, balances, { expirationTtl: 7200 });
}

async function getCachedBalances(env) {
  return env.InterchainBalancesCache.get(balancesKey);
}
