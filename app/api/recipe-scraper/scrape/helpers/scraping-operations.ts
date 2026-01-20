/**
 * Scraping operations helpers
 */

import { logger } from '@/lib/logger';
import { JSONStorage } from '../../../../../scripts/recipe-scraper/storage/json-storage';
import type { ScraperInstance } from './scraper-factory';

/**
 * Scrape recipes from URLs
 */
export async function scrapeRecipes(
  scraper: ScraperInstance,
  storage: JSONStorage,
  urls: string[],
): Promise<{
  results: Array<{ success: boolean; recipe?: unknown; error?: string; url: string }>;
  summary: { total: number; success: number; errors: number };
}> {
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const url of urls) {
    const result = await processSingleUrl(scraper, storage, url);
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
    results.push(result);
  }

  return {
    results,
    summary: { total: urls.length, success: successCount, errors: errorCount },
  };
}

async function processSingleUrl(
    scraper: ScraperInstance,
    storage: JSONStorage,
    url: string
): Promise<{ success: boolean; recipe?: unknown; error?: string; url: string }> {
    try {
      const result = await scraper.scrapeRecipe(url);
      if (result.success && result.recipe) {
        const saveResult = await storage.saveRecipe(result.recipe);
        if (saveResult.saved) {
          return { success: true, recipe: result.recipe, url };
        } else {
          return { success: false, error: saveResult.reason || 'Failed to save', url };
        }
      } else {
        return { success: false, error: result.error || 'Failed to scrape', url };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`[Recipe Scraper API] Error scraping ${url}:`, { error: errorMessage });
      return { success: false, error: errorMessage, url };
    }
}
