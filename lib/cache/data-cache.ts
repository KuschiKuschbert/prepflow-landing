import { logger } from '@/lib/logger';

const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

function getCacheKey(key: string): string {
  return `prepflow_cache_${key}`;
}

function getTimestampKey(key: string): string {
  return `prepflow_cache_${key}_timestamp`;
}

/**
 * Store data in sessionStorage with an expiry timestamp.
 *
 * @param {string} key - Cache key (prefixed internally with `prepflow_cache_`)
 * @param {T} data - Serialisable data to cache
 * @param {number} [expiryMs] - TTL in milliseconds (default: 5 minutes)
 */
export function cacheData<T>(key: string, data: T, expiryMs: number = CACHE_EXPIRY_MS): void {
  if (typeof window === 'undefined') return;
  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(getCacheKey(key), JSON.stringify(cacheData));
    sessionStorage.setItem(getTimestampKey(key), String(cacheData.timestamp));
    // Store expiry for this key
    sessionStorage.setItem(`prepflow_cache_${key}_expiry`, String(expiryMs));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(`Failed to cache data for key "${key}":`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/**
 * Retrieve data from sessionStorage if it exists and has not expired.
 *
 * @param {string} key - Cache key used in {@link cacheData}
 * @returns {T | null} Cached value, or `null` if missing or expired
 */
export function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const timestampStr = sessionStorage.getItem(getTimestampKey(key));
    if (!timestampStr) return null;
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const expiryMs = parseInt(
      sessionStorage.getItem(`prepflow_cache_${key}_expiry`) || String(CACHE_EXPIRY_MS),
      10,
    );
    if (now - timestamp > expiryMs) {
      clearCache(key);
      return null;
    }

    const cacheDataStr = sessionStorage.getItem(getCacheKey(key));
    if (!cacheDataStr) return null;

    const cacheData: CachedData<T> = JSON.parse(cacheDataStr);
    return cacheData.data || null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(`Failed to read cached data for key "${key}":`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}

/**
 * Remove a single cache entry and its associated metadata from sessionStorage.
 *
 * @param {string} key - Cache key to invalidate
 */
export function clearCache(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(getCacheKey(key));
    sessionStorage.removeItem(getTimestampKey(key));
    sessionStorage.removeItem(`prepflow_cache_${key}_expiry`);
  } catch (_error) {
    // Ignore errors
  }
}

/**
 * Remove every PrepFlow cache entry from sessionStorage.
 * Useful on logout or when a full data refresh is needed.
 */
export function clearAllCaches(): void {
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('prepflow_cache_')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (_error) {
    // Ignore errors
  }
}

/**
 * Insert a `<link rel="prefetch">` tag for the given API endpoint so the
 * browser can pre-warm the response in its HTTP cache.
 *
 * @param {string} endpoint - Absolute or root-relative URL to prefetch
 */
export function prefetchApi(endpoint: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = document.querySelector(`link[rel="prefetch"][href="${endpoint}"]`);
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = endpoint;
    document.head.appendChild(link);
  } catch (_error) {
    // Ignore errors
  }
}

/**
 * Prefetch multiple API endpoints in a single call.
 *
 * @param {string[]} endpoints - Array of URLs to prefetch
 */
export function prefetchApis(endpoints: string[]): void {
  endpoints.forEach(endpoint => prefetchApi(endpoint));
}
