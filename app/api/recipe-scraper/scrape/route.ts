/**
 * Recipe Scraper API
 * Triggers recipe scraping from URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SourceType } from '../../../../scripts/recipe-scraper/config';
import { JSONStorage } from '../../../../scripts/recipe-scraper/storage/json-storage';
import { z } from 'zod';
import { handleAuth, handleComprehensiveScrape, createScraper, scrapeRecipes } from './helpers';

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
    // Require authentication
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

    // Comprehensive mode - start background job for all sources
    if (comprehensive) {
      return handleComprehensiveScrape();
    }

    // Regular scraping mode (existing logic)
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

    // Get scraper instance
    let scraper;
    try {
      scraper = createScraper(source as SourceType);
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

    // Initialize storage
    let storage: JSONStorage;
    try {
      storage = new JSONStorage();
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

    // Discovery mode - automatically find recipes
    if (discovery) {
      try {
        logger.info(`[Recipe Scraper API] Starting discovery mode for ${source} (limit: ${limit})`);
        recipeUrls = await scraper.getRecipeUrls(limit);
        logger.info(`[Recipe Scraper API] Discovered ${recipeUrls.length} recipe URLs`);
      } catch (discoveryErr) {
        logger.error('[Recipe Scraper API] Error in discovery mode:', {
          error: discoveryErr instanceof Error ? discoveryErr.message : String(discoveryErr),
          source,
          limit,
        });
        return NextResponse.json(
          ApiErrorHandler.createError(
            `Failed to discover recipes from ${source}`,
            'SERVER_ERROR',
            500,
          ),
          { status: 500 },
        );
      }
    } else {
      // Manual URLs provided
      if (!urls || urls.length === 0) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'URLs required when discovery is false',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }
      recipeUrls = urls;
    }

    if (recipeUrls.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No recipe URLs found',
        data: {
          results: [],
          summary: {
            total: 0,
            success: 0,
            errors: 0,
          },
        },
      });
    }

    // Scrape recipes
    const { results, summary } = await scrapeRecipes(scraper, storage, recipeUrls);

    return NextResponse.json({
      success: true,
      message: `Scraped ${summary.success} recipe(s) successfully, ${summary.errors} failed`,
      data: { results, summary },
    });
  } catch (err) {
    // Catch any unexpected errors and ensure JSON response
    logger.error('[Recipe Scraper API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/scrape', operation: 'POST' },
    });

    // requireAuth and other helpers may throw NextResponse
    if (err instanceof NextResponse) {
      return err;
    }

    // Always return JSON, never let Next.js return HTML error page
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to scrape recipes', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
