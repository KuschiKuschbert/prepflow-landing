/**
 * Generic data caching utilities for preloading and faster perceived performance
 * Can be used for any data type across the application
 */

const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes default

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cache key for a specific endpoint/data type
 */
function getCacheKey(key: string): string {
  return `prepflow_cache_${key}`;
}

function getTimestampKey(key: string): string {
  return `prepflow_cache_${key}_timestamp`;
}

/**
 * Cache data in sessionStorage
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
      console.warn(`Failed to cache data for key "${key}":`, error);
    }
  }
}

/**
 * Get cached data if valid
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

    // Check if cache is expired
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
      console.warn(`Failed to read cached data for key "${key}":`, error);
    }
    return null;
  }
}

/**
 * Clear cache for a specific key
 */
export function clearCache(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(getCacheKey(key));
    sessionStorage.removeItem(getTimestampKey(key));
    sessionStorage.removeItem(`prepflow_cache_${key}_expiry`);
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Clear all caches
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
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Prefetch API endpoint - starts loading in background
 */
export function prefetchApi(endpoint: string): void {
  if (typeof window === 'undefined') return;
  try {
    // Check if already prefetched
    const existing = document.querySelector(`link[rel="prefetch"][href="${endpoint}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = endpoint;
    document.head.appendChild(link);
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Prefetch multiple endpoints
 */
export function prefetchApis(endpoints: string[]): void {
  endpoints.forEach(endpoint => prefetchApi(endpoint));
}
