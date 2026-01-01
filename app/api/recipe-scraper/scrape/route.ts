/**
 * Recipe Scraper API
 * Triggers recipe scraping from URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { AllRecipesScraper } from '../../../../scripts/recipe-scraper/scrapers/allrecipes-scraper';
import { BBCGoodFoodScraper } from '../../../../scripts/recipe-scraper/scrapers/bbc-good-food-scraper';
import { FoodNetworkScraper } from '../../../../scripts/recipe-scraper/scrapers/food-network-scraper';
import { JSONStorage } from '../../../../scripts/recipe-scraper/storage/json-storage';
import { SOURCES, SourceType } from '../../../../scripts/recipe-scraper/config';
import { z } from 'zod';

const scrapeSchema = z.object({
  source: z.enum(['allrecipes', 'bbc-good-food', 'food-network']),
  urls: z.array(z.string().url()).optional(),
  discovery: z.boolean().optional().default(false),
  limit: z.number().int().positive().max(200).optional().default(50),
});

/**
 * POST /api/recipe-scraper/scrape
 * Scrape recipes from provided URLs
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

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

    const { source, urls, discovery, limit } = validationResult.data;

    // Get scraper instance
    let scraper: AllRecipesScraper | BBCGoodFoodScraper | FoodNetworkScraper;
    switch (source as SourceType) {
      case SOURCES.ALLRECIPES:
        scraper = new AllRecipesScraper();
        break;
      case SOURCES.BBC_GOOD_FOOD:
        scraper = new BBCGoodFoodScraper();
        break;
      case SOURCES.FOOD_NETWORK:
        scraper = new FoodNetworkScraper();
        break;
      default:
        return NextResponse.json(
          ApiErrorHandler.createError(`Unknown source: ${source}`, 'VALIDATION_ERROR', 400),
          { status: 400 },
        );
    }

    // Initialize storage
    const storage = new JSONStorage();

    let recipeUrls: string[] = [];

    // Discovery mode - automatically find recipes
    if (discovery) {
      logger.info(`[Recipe Scraper API] Starting discovery mode for ${source} (limit: ${limit})`);
      recipeUrls = await scraper.getRecipeUrls(limit);
      logger.info(`[Recipe Scraper API] Discovered ${recipeUrls.length} recipe URLs`);
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
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const url of recipeUrls) {
      try {
        const result = await scraper.scrapeRecipe(url);
        if (result.success && result.recipe) {
          const saveResult = await storage.saveRecipe(result.recipe);
          if (saveResult.saved) {
            successCount++;
            results.push({
              success: true,
              recipe: result.recipe,
              url,
            });
          } else {
            results.push({
              success: false,
              error: saveResult.reason || 'Failed to save',
              url,
            });
          }
        } else {
          errorCount++;
          results.push({
            success: false,
            error: result.error || 'Failed to scrape',
            url,
          });
        }
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`[Recipe Scraper API] Error scraping ${url}:`, { error: errorMessage });
        results.push({
          success: false,
          error: errorMessage,
          url,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${successCount} recipe(s) successfully, ${errorCount} failed`,
      data: {
        results,
        summary: {
          total: recipeUrls.length,
          success: successCount,
          errors: errorCount,
        },
      },
    });
  } catch (err) {
    logger.error('[Recipe Scraper API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
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
