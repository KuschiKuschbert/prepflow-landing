/**
 * Recipe Scraper API
 * Triggers recipe scraping from URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { handleAuth, handleComprehensiveScrape, createScraper, scrapeRecipes } from './helpers';
import { loadStorage, handleDiscovery, handleManualUrls } from './helpers/scrape-helpers';

const scrapeSchema = z.object({
  source: z.enum(['allrecipes', 'bbc-good-food', 'food-network']).optional(),
  urls: z.array(z.string().url()).optional(),
  discovery: z.boolean().optional().default(false),
  limit: z.number().int().positive().max(200).optional().default(50),
  comprehensive: z.boolean().optional().default(false),
});

/**
 * POST /api/recipe-scraper/scrape
 * Scrape recipes from provided URLs
 */
export async function POST(request: NextRequest) {
  try {
    let loadedStorage;
    try {
      loadedStorage = await loadStorage();
    } catch (loadErr) {
      logger.error('[Recipe Scraper API] Failed to load storage module:', {
        error: loadErr instanceof Error ? loadErr.message : String(loadErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Recipe scraper service unavailable',
          'SERVICE_UNAVAILABLE',
          503,
        ),
        { status: 503 },
      );
    }

    const authResponse = await handleAuth(request);
    if (authResponse) return authResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Recipe Scraper API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = scrapeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { source, urls, discovery, limit, comprehensive } = validationResult.data;

    if (comprehensive) {
      return handleComprehensiveScrape();
    }

    if (!source) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Source is required for non-comprehensive scraping',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    let scraper;
    try {
      scraper = createScraper(source);
    } catch (scraperErr) {
      logger.error('[Recipe Scraper API] Error creating scraper:', {
        error: scraperErr instanceof Error ? scraperErr.message : String(scraperErr),
        source,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Failed to initialize scraper for ${source}`,
          'SERVER_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    let storage;
    try {
      storage = new loadedStorage();
    } catch (storageErr) {
      logger.error('[Recipe Scraper API] Error initializing storage:', {
        error: storageErr instanceof Error ? storageErr.message : String(storageErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to initialize storage', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    let recipeUrls: string[] = [];

    if (discovery) {
      recipeUrls = await handleDiscovery(scraper, source, limit);
    } else {
      recipeUrls = handleManualUrls(urls);
    }

    if (recipeUrls.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No recipe URLs found',
        data: {
          results: [],
          summary: { total: 0, success: 0, errors: 0 },
        },
      });
    }

    const { results, summary } = await scrapeRecipes(scraper, storage, recipeUrls);

    return NextResponse.json({
      success: true,
      message: `Scraped ${summary.success} recipe(s) successfully, ${summary.errors} failed`,
      data: { results, summary },
    });
  } catch (err) {
    logger.error('[Recipe Scraper API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/scrape', operation: 'POST' },
    });

    if (err instanceof NextResponse) {
      return err;
    }

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to scrape recipes', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
