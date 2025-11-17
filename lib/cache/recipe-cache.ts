/**
 * Recipe caching utilities - uses generic data cache with per-recipe versioning
 */
import { cacheData, clearCache, getCachedData, prefetchApi } from './data-cache';

import { logger } from '@/lib/logger';

const RECIPES_CACHE_KEY = 'recipes';
const RECIPE_PRICES_CACHE_KEY = 'recipe_prices';
const RECIPE_CACHE_VERSION_KEY = 'recipe_cache_version';
const RECIPE_CACHE_VERSION = '2.0'; // Increment when cache structure changes

interface RecipeCacheMetadata {
  version: string;
  timestamp: number;
  recipeTimestamps: Record<string, number>;
}

/**
 * Cache recipes in sessionStorage with versioning
 */
export function cacheRecipes(recipes: any[]): void {
  cacheData(RECIPES_CACHE_KEY, recipes);

  // Update cache metadata
  const metadata: RecipeCacheMetadata = {
    version: RECIPE_CACHE_VERSION,
    timestamp: Date.now(),
    recipeTimestamps: {},
  };

  // Set timestamps for each recipe
  recipes.forEach(recipe => {
    metadata.recipeTimestamps[recipe.id] = Date.now();
  });

  try {
    sessionStorage.setItem(RECIPE_CACHE_VERSION_KEY, JSON.stringify(metadata));
  } catch (err) {
    logger.warn('Failed to update recipe cache metadata:', err);
  }
}

/**
 * Get cached recipes if valid
 */
export function getCachedRecipes(): any[] | null {
  // Check cache version
  try {
    const metadataStr = sessionStorage.getItem(RECIPE_CACHE_VERSION_KEY);
    if (metadataStr) {
      const metadata: RecipeCacheMetadata = JSON.parse(metadataStr);
      if (metadata.version !== RECIPE_CACHE_VERSION) {
        // Cache version mismatch - clear cache
        clearRecipeCache();
        return null;
      }
    }
  } catch (err) {
    logger.warn('Failed to check recipe cache version:', err);
  }

  return getCachedData<any[]>(RECIPES_CACHE_KEY);
}

/**
 * Invalidate cache for specific recipes
 */
export function invalidateRecipeCache(recipeIds: string[]): void {
  try {
    const metadataStr = sessionStorage.getItem(RECIPE_CACHE_VERSION_KEY);
    if (metadataStr) {
      const metadata: RecipeCacheMetadata = JSON.parse(metadataStr);
      recipeIds.forEach(id => {
        delete metadata.recipeTimestamps[id];
      });
      metadata.timestamp = Date.now();
      sessionStorage.setItem(RECIPE_CACHE_VERSION_KEY, JSON.stringify(metadata));
    }
  } catch (err) {
    logger.warn('Failed to invalidate recipe cache:', err);
  }

  // Also invalidate price cache for these recipes
  try {
    const pricesStr = sessionStorage.getItem(RECIPE_PRICES_CACHE_KEY);
    if (pricesStr) {
      const prices = JSON.parse(pricesStr);
      recipeIds.forEach(id => {
        delete prices[id];
      });
      sessionStorage.setItem(RECIPE_PRICES_CACHE_KEY, JSON.stringify(prices));
    }
  } catch (err) {
    logger.warn('Failed to invalidate recipe price cache:', err);
  }
}

/**
 * Clear recipe cache
 */
export function clearRecipeCache(): void {
  clearCache(RECIPES_CACHE_KEY);
  clearCache(RECIPE_PRICES_CACHE_KEY);
  try {
    sessionStorage.removeItem(RECIPE_CACHE_VERSION_KEY);
  } catch (err) {
    logger.warn('Failed to clear recipe cache metadata:', err);
  }
}

/**
 * Prefetch recipes API - starts loading in background
 */
export function prefetchRecipes(): void {
  prefetchApi('/api/recipes');
}
