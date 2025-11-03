/**
 * Recipe caching utilities for preloading and faster perceived performance
 */

const RECIPES_CACHE_KEY = 'prepflow_recipes_cache';
const RECIPES_CACHE_TIMESTAMP_KEY = 'prepflow_recipes_cache_timestamp';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export interface CachedRecipes {
  recipes: any[];
  timestamp: number;
}

/**
 * Cache recipes in sessionStorage
 */
export function cacheRecipes(recipes: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cacheData: CachedRecipes = {
      recipes,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(RECIPES_CACHE_KEY, JSON.stringify(cacheData));
    sessionStorage.setItem(RECIPES_CACHE_TIMESTAMP_KEY, String(cacheData.timestamp));
  } catch (error) {
    // SessionStorage might be full or unavailable
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to cache recipes:', error);
    }
  }
}

/**
 * Get cached recipes if valid
 */
export function getCachedRecipes(): any[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const timestampStr = sessionStorage.getItem(RECIPES_CACHE_TIMESTAMP_KEY);
    if (!timestampStr) return null;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Check if cache is expired
    if (now - timestamp > CACHE_EXPIRY_MS) {
      clearRecipeCache();
      return null;
    }

    const cacheDataStr = sessionStorage.getItem(RECIPES_CACHE_KEY);
    if (!cacheDataStr) return null;

    const cacheData: CachedRecipes = JSON.parse(cacheDataStr);
    return cacheData.recipes || null;
  } catch (error) {
    // Invalid cache data or parse error
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to read cached recipes:', error);
    }
    return null;
  }
}

/**
 * Clear recipe cache
 */
export function clearRecipeCache(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(RECIPES_CACHE_KEY);
    sessionStorage.removeItem(RECIPES_CACHE_TIMESTAMP_KEY);
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Prefetch recipes API - starts loading in background
 */
export function prefetchRecipes(): void {
  if (typeof window === 'undefined') return;
  // Use link prefetch for better performance
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'fetch';
  link.href = '/api/recipes';
  document.head.appendChild(link);
}
