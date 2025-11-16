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
 * Cache data in sessionStorage with optional expiry.
 *
 * @param {string} key - Cache key identifier
 * @param {T} data - Data to cache (any type)
 * @param {number} [expiryMs] - Expiry time in milliseconds (default: 5 minutes)
 * @returns {void}
 *
 * @example
 * ```typescript
 * cacheData('recipes', recipesList, 10 * 60 * 1000); // 10 minutes
 * cacheData('dashboard_stats', stats); // 5 minutes (default)
 * ```
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
 * Get cached data if valid and not expired.
 *
 * @param {string} key - Cache key identifier
 * @returns {T | null} Cached data or null if expired/not found
 *
 * @example
 * ```typescript
 * const cached = getCachedData<Recipe[]>('recipes');
 * if (cached) {
 *   setRecipes(cached); // Use cached data
 * }
 * ```
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
 * Prefetch API endpoint using link prefetch for faster subsequent loads.
 *
 * @param {string} endpoint - API endpoint URL to prefetch
 * @returns {void}
 *
 * @example
 * ```typescript
 * prefetchApi('/api/recipes'); // Prefetch on hover
 * ```
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
