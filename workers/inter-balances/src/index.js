/**
 * Cloudflare Worker for Fetching IBC Transfer Balances
 *
 * This Cloudflare Worker is designed to interface with the Agoric API to fetch and cache
 * inter-blockchain (IBC) transfer balances. It provides a simple API to retrieve cached balance
 * data and updates the cache periodically via scheduled events. The worker enhances performance
 * and reduces API calls by utilizing Cloudflare's caching capabilities.
 *
 * Features:
 * - Fetches IBC transfer balances from the Agoric API.
 * - Caches balance data to optimize performance and reduce API load.
 * - Exposes a single endpoint (/balances) to retrieve the latest balance data.
 * - Automatically updates cache every hour or upon cache expiry.
 *
 * Usage:
 * - Endpoint: /balances - Returns the cached balances as JSON.
 * - Scheduled: Updates the balances cache every hour.
 *
 * Environment Variables:
 * - BALANCES_CACHE: Cloudflare KV namespace bound to the Worker for caching balance data.
 *
 */

import { handleBalancesRequest, refreshBalancesCache } from './inter-balances';
import { handleGauntletRequest } from './gauntlet';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      switch (url.pathname) {
        case '/inter-balances':
          return await handleBalancesRequest(env);
        case '/gauntlet':
          return await handleGauntletRequest(env);
        default:
          return new Response('Not found', { status: 404 });
      }
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },

  async scheduled(event, env, ctx) {
    await refreshBalancesCache(env);
  },
};
