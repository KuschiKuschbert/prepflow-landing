/**
 * Recipe Scraper Status API
 * Returns current scraping progress and statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';

// Dynamic import to handle potential import failures gracefully
async function getComprehensiveScraperJob() {
  try {
    const scraperJobMod =
      await import('../../../../scripts/recipe-scraper/jobs/comprehensive-scraper');
    return scraperJobMod.getComprehensiveScraperJob();
  } catch (importErr) {
    logger.error('[Recipe Scraper Status API] Failed to import comprehensive scraper job:', {
      error: importErr instanceof Error ? importErr.message : String(importErr),
    });
    throw new Error('Failed to load comprehensive scraper job module');
  }
}

/**
 * GET /api/recipe-scraper/status
 * Get current scraping progress and statistics
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Scraping status
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    try {
      await requireAuth(request);
    } catch (authErr) {
      // requireAuth throws NextResponse for auth errors, return it
      if (authErr instanceof NextResponse) {
        return authErr;
      }
      logger.error('[Recipe Scraper Status API] Authentication error:', {
        error: authErr instanceof Error ? authErr.message : String(authErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Get job status with error handling
    let status;
    try {
      const job = await getComprehensiveScraperJob();
      status = job.getStatus();
    } catch (jobErr) {
      logger.error('[Recipe Scraper Status API] Error getting job status:', {
        error: jobErr instanceof Error ? jobErr.message : String(jobErr),
        stack: jobErr instanceof Error ? jobErr.stack : undefined,
      });
      // Return default status object instead of failing
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

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (err) {
    // Catch any unexpected errors
    logger.error('[Recipe Scraper Status API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/status', method: 'GET' },
    });

    // Always return JSON, never let Next.js return HTML error page
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch scraping status', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
