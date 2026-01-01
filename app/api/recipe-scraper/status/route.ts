/**
 * Recipe Scraper Status API
 * Returns current scraping progress and statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { getComprehensiveScraperJob } from '../../../../scripts/recipe-scraper/jobs/comprehensive-scraper';

/**
 * GET /api/recipe-scraper/status
 * Get current scraping progress and statistics
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Scraping status
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const job = getComprehensiveScraperJob();
    const status = job.getStatus();

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (err) {
    logger.error('[Recipe Scraper Status API] Error fetching status:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/recipe-scraper/status', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch scraping status', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
