/**
 * Recipe Scraper API Helpers
 * Helper functions for recipe scraping operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { AllRecipesScraper } from '../../../../scripts/recipe-scraper/scrapers/allrecipes-scraper';
// import { BBCGoodFoodScraper } from '../../../../scripts/recipe-scraper/scrapers/bbc-good-food-scraper'; // DISABLED - Terms of Service violation
import { FoodNetworkScraper } from '../../../../scripts/recipe-scraper/scrapers/food-network-scraper';
import { EpicuriousScraper } from '../../../../scripts/recipe-scraper/scrapers/epicurious-scraper';
import { BonAppetitScraper } from '../../../../scripts/recipe-scraper/scrapers/bon-appetit-scraper';
import { TastyScraper } from '../../../../scripts/recipe-scraper/scrapers/tasty-scraper';
import { SOURCES, SourceType } from '../../../../scripts/recipe-scraper/config';
import { getComprehensiveScraperJob } from '../../../../scripts/recipe-scraper/jobs/comprehensive-scraper';
import { JSONStorage } from '../../../../scripts/recipe-scraper/storage/json-storage';

/**
 * Handle authentication with proper error handling
 */
export async function handleAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    await requireAuth(request);
    return null; // Success
  } catch (authErr) {
    if (authErr instanceof NextResponse) {
      return authErr;
    }
    logger.error('[Recipe Scraper API] Authentication error:', {
      error: authErr instanceof Error ? authErr.message : String(authErr),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
      { status: 401 },
    );
  }
}

/**
 * Handle comprehensive scraping job
 */
export async function handleComprehensiveScrape(): Promise<NextResponse> {
  try {
    logger.info('[Recipe Scraper API] Starting comprehensive scraping job');
    const job = getComprehensiveScraperJob();
    let status;
    try {
      status = job.getStatus();
    } catch (statusErr) {
      logger.error('[Recipe Scraper API] Error getting job status:', {
        error: statusErr instanceof Error ? statusErr.message : String(statusErr),
      });
      status = {
        isRunning: false,
        sources: {},
        overall: {
          totalDiscovered: 0,
          totalScraped: 0,
          totalFailed: 0,
          totalRemaining: 0,
          overallProgressPercent: 0,
        },
        lastUpdated: new Date().toISOString(),
      };
    }

    job.start().catch(error => {
      logger.error('[Recipe Scraper API] Comprehensive scraping job failed:', {
        error: error instanceof Error ? error.message : String(error),
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Comprehensive scraping job started',
      data: { jobStatus: status },
    });
  } catch (comprehensiveErr) {
    logger.error('[Recipe Scraper API] Error starting comprehensive job:', {
      error:
        comprehensiveErr instanceof Error ? comprehensiveErr.message : String(comprehensiveErr),
      stack: comprehensiveErr instanceof Error ? comprehensiveErr.stack : undefined,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to start comprehensive scraping job',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

/**
 * Create scraper instance for source
 */
export function createScraper(
  source: SourceType,
):
  | AllRecipesScraper
  | FoodNetworkScraper
  | EpicuriousScraper
  | BonAppetitScraper
  | TastyScraper {
  switch (source) {
    case SOURCES.ALLRECIPES:
      return new AllRecipesScraper();
    case SOURCES.BBC_GOOD_FOOD:
      throw new Error('BBC Good Food scraper is disabled due to Terms of Service violation. See docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md');
    case SOURCES.FOOD_NETWORK:
      return new FoodNetworkScraper();
    case SOURCES.EPICURIOUS:
      return new EpicuriousScraper();
    case SOURCES.BON_APPETIT:
      return new BonAppetitScraper();
    case SOURCES.TASTY:
      return new TastyScraper();
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}

/**
 * Scrape recipes from URLs
 */
export async function scrapeRecipes(
  scraper:
    | AllRecipesScraper
    | FoodNetworkScraper
    | EpicuriousScraper
    | BonAppetitScraper
    | TastyScraper,
  storage: JSONStorage,
  urls: string[],
): Promise<{
  results: Array<{ success: boolean; recipe?: any; error?: string; url: string }>;
  summary: { total: number; success: number; errors: number };
}> {
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const url of urls) {
    try {
      const result = await scraper.scrapeRecipe(url);
      if (result.success && result.recipe) {
        const saveResult = await storage.saveRecipe(result.recipe);
        if (saveResult.saved) {
          successCount++;
          results.push({ success: true, recipe: result.recipe, url });
        } else {
          results.push({ success: false, error: saveResult.reason || 'Failed to save', url });
        }
      } else {
        errorCount++;
        results.push({ success: false, error: result.error || 'Failed to scrape', url });
      }
    } catch (error) {
      errorCount++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`[Recipe Scraper API] Error scraping ${url}:`, { error: errorMessage });
      results.push({ success: false, error: errorMessage, url });
    }
  }

  return {
    results,
    summary: { total: urls.length, success: successCount, errors: errorCount },
  };
}
