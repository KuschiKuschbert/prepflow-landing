/**
 * Recipe Scraper API Helpers
 * Helper functions for recipe scraping operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { getComprehensiveScraperJob } from '../../../../scripts/recipe-scraper/jobs/comprehensive-scraper';
import { createScraper } from './helpers/scraper-factory';
import { scrapeRecipes } from './helpers/scraping-operations';
import type { SourceType } from '../../../../scripts/recipe-scraper/config';

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

// Re-export scraper factory and operations
export { createScraper } from './helpers/scraper-factory';
export { scrapeRecipes } from './helpers/scraping-operations';
