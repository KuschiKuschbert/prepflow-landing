/**
 * Recipe caching utilities - uses generic data cache
 */
import { cacheData, clearCache, getCachedData, prefetchApi } from './data-cache';

const RECIPES_CACHE_KEY = 'recipes';

/**
 * Cache recipes in sessionStorage
 */
export function cacheRecipes(recipes: any[]): void {
  cacheData(RECIPES_CACHE_KEY, recipes);
}

/**
 * Get cached recipes if valid
 */
export function getCachedRecipes(): any[] | null {
  return getCachedData<any[]>(RECIPES_CACHE_KEY);
}

/**
 * Clear recipe cache
 */
export function clearRecipeCache(): void {
  clearCache(RECIPES_CACHE_KEY);
}

/**
 * Prefetch recipes API - starts loading in background
 */
export function prefetchRecipes(): void {
  prefetchApi('/api/recipes');
}
