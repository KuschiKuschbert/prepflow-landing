/**
 * Storage helpers for recipe scraper API
 */

import { logger } from '@/lib/logger';

/**
 * Load JSONStorage class dynamically
 */
export async function loadJSONStorage() {
  try {
    const storageMod = await import('../../../../../scripts/recipe-scraper/storage/json-storage');
    return storageMod.JSONStorage;
  } catch (importErr) {
    logger.error('[Recipe Scraper API] Failed to import JSONStorage:', {
      error: importErr instanceof Error ? importErr.message : String(importErr),
    });
    throw new Error('Failed to load JSONStorage module');
  }
}

/**
 * Initialize storage with error handling
 */
export function initializeStorage(JSONStorageClass: any) {
  try {
    return new JSONStorageClass();
  } catch (storageErr) {
    logger.error('[Recipe Scraper API] Error initializing storage:', {
      error: storageErr instanceof Error ? storageErr.message : String(storageErr),
    });
    return null;
  }
}
