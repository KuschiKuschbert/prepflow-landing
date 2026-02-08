/**
 * Scrape operation helpers (API Helper)
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { BaseScraper } from '@/lib/recipes/scrapers/base-scraper';
import { JSONStorage } from '@/lib/recipes/storage/json-storage';
import { NextResponse } from 'next/server';

export async function loadStorage() {
  return JSONStorage;
}

export async function handleDiscovery(
  scraper: BaseScraper,
  source: string,
  limit: number,
): Promise<string[]> {
  try {
    logger.info(`[Recipe Scraper API] Starting discovery mode for ${source} (limit: ${limit})`);
    const recipeUrls = await scraper.getRecipeUrls(limit);
    logger.info(`[Recipe Scraper API] Discovered ${recipeUrls.length} recipe URLs`);
    return recipeUrls;
  } catch (discoveryErr) {
    logger.error('[Recipe Scraper API] Error in discovery mode:', {
      error: discoveryErr instanceof Error ? discoveryErr.message : String(discoveryErr),
      source,
      limit,
    });
    throw NextResponse.json(
      ApiErrorHandler.createError(`Failed to discover recipes from ${source}`, 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

export function handleManualUrls(urls: string[] | undefined): string[] {
  if (!urls || urls.length === 0) {
    throw NextResponse.json(
      ApiErrorHandler.createError('URLs required when discovery is false', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }
  return urls;
}
