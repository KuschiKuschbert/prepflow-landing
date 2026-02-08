/**
 * Storage helpers for recipe scraper API
 */

import { logger } from '@/lib/logger';
import { JSONStorage } from '@/lib/recipes/storage/json-storage';

/**
 * Load JSONStorage class
 */
export async function loadJSONStorage() {
  return JSONStorage;
}

import { RecipeEntry } from './filter-helpers';

export interface StorageInterface {
  getAllRecipes(): RecipeEntry[];
  loadRecipe(path: string): Promise<unknown>;
}

/**
 * Initialize storage with error handling
 */
export function initializeStorage(JSONStorageClass: any): StorageInterface | null {
  try {
    return new JSONStorageClass() as StorageInterface;
  } catch (storageErr) {
    logger.error('[Recipe Scraper API] Error initializing storage:', {
      error: storageErr instanceof Error ? storageErr.message : String(storageErr),
    });
    return null;
  }
}
