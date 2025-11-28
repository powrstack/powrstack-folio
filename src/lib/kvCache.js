/**
 * Cloudflare KV Cache Helper
 * Provides aggressive caching layer using Cloudflare KV storage
 * Compatible with Cloudflare Workers and Next.js edge runtime
 */

import logger from './logger';

// KV namespace binding (configured in wrangler.jsonc)
// Access via: process.env.KV or globalThis.KV
const getKVNamespace = () => {
  if (typeof process !== 'undefined' && process.env?.KV) {
    return process.env.KV;
  }
  if (typeof globalThis !== 'undefined' && globalThis.KV) {
    return globalThis.KV;
  }
  return null;
};

/**
 * Cache data in Cloudflare KV with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 * @returns {Promise<boolean>} - Success status
 */
export async function kvSet(key, value, ttl = 3600) {
  try {
    const kv = getKVNamespace();
    if (!kv) {
      logger.debug('KV namespace not available, skipping cache write');
      return false;
    }

    const serialized = JSON.stringify(value);
    await kv.put(key, serialized, {
      expirationTtl: ttl,
      metadata: {
        cachedAt: Date.now(),
        type: typeof value
      }
    });

    logger.cache(`KV cache set: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    logger.error('KV cache write error:', error);
    return false;
  }
}

/**
 * Get data from Cloudflare KV cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached value or null
 */
export async function kvGet(key) {
  try {
    const kv = getKVNamespace();
    if (!kv) {
      logger.debug('KV namespace not available, skipping cache read');
      return null;
    }

    const cached = await kv.get(key, { type: 'text' });
    if (!cached) {
      logger.cache(`KV cache miss: ${key}`);
      return null;
    }

    logger.cache(`KV cache hit: ${key}`);
    return JSON.parse(cached);
  } catch (error) {
    logger.error('KV cache read error:', error);
    return null;
  }
}

/**
 * Delete data from Cloudflare KV cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
export async function kvDelete(key) {
  try {
    const kv = getKVNamespace();
    if (!kv) {
      logger.debug('KV namespace not available');
      return false;
    }

    await kv.delete(key);
    logger.cache(`KV cache deleted: ${key}`);
    return true;
  } catch (error) {
    logger.error('KV cache delete error:', error);
    return false;
  }
}

/**
 * Get or set data with cache-aside pattern
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch fresh data
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} - Cached or fresh data
 */
export async function kvGetOrSet(key, fetchFn, ttl = 3600) {
  try {
    // Try to get from cache first
    const cached = await kvGet(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch fresh data
    logger.cache(`KV cache miss, fetching fresh data for: ${key}`);
    const freshData = await fetchFn();

    // Store in cache for future requests
    await kvSet(key, freshData, ttl);

    return freshData;
  } catch (error) {
    logger.error('KV getOrSet error:', error);
    // On error, try to fetch without caching
    return await fetchFn();
  }
}

/**
 * List all keys in KV namespace with optional prefix
 * @param {string} prefix - Key prefix filter
 * @returns {Promise<string[]>} - Array of keys
 */
export async function kvListKeys(prefix = '') {
  try {
    const kv = getKVNamespace();
    if (!kv) {
      logger.debug('KV namespace not available');
      return [];
    }

    const list = await kv.list({ prefix });
    return list.keys.map(k => k.name);
  } catch (error) {
    logger.error('KV list keys error:', error);
    return [];
  }
}

/**
 * Clear all cached data with optional prefix
 * @param {string} prefix - Key prefix filter
 * @returns {Promise<number>} - Number of keys deleted
 */
export async function kvClear(prefix = '') {
  try {
    const keys = await kvListKeys(prefix);
    const kv = getKVNamespace();
    if (!kv) {
      logger.debug('KV namespace not available');
      return 0;
    }

    let deleted = 0;
    for (const key of keys) {
      await kv.delete(key);
      deleted++;
    }

    logger.cache(`KV cache cleared: ${deleted} keys deleted (prefix: ${prefix || 'all'})`);
    return deleted;
  } catch (error) {
    logger.error('KV clear error:', error);
    return 0;
  }
}

// Cache key generators
export const cacheKeys = {
  resume: () => 'cache:resume:data',
  blogPosts: (source, limit) => `cache:blog:${source}:${limit}`,
  blogPost: (source, id) => `cache:blog:${source}:post:${id}`,
};

const kvCache = {
  set: kvSet,
  get: kvGet,
  delete: kvDelete,
  getOrSet: kvGetOrSet,
  listKeys: kvListKeys,
  clear: kvClear,
  cacheKeys,
};

export default kvCache;
