import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getComprehensiveScraperJob } from '@/lib/recipes/jobs/comprehensive-scraper';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/recipe-scraper/stop
 * Stop the running comprehensive scraping job
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Stop confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    // Get job instance and stop it
    try {
      const job = getComprehensiveScraperJob();
      const statusBefore = job.getStatus();

      if (!statusBefore.isRunning) {
        return NextResponse.json({
          success: true,
          message: 'Scraper is not currently running',
          data: { wasRunning: false },
        });
      }

      // Stop the job
      job.stop();

      // Get status after stopping
      const statusAfter = job.getStatus();

      logger.info('[Recipe Scraper Stop API] Scraper stopped successfully', {
        wasRunning: statusBefore.isRunning,
        isRunning: statusAfter.isRunning,
      });

      return NextResponse.json({
        success: true,
        message: 'Scraping job stopped successfully',
        data: {
          wasRunning: statusBefore.isRunning,
          isRunning: statusAfter.isRunning,
          status: statusAfter,
        },
      });
    } catch (jobErr) {
      logger.error('[Recipe Scraper Stop API] Error stopping job:', {
        error: jobErr instanceof Error ? jobErr.message : String(jobErr),
        stack: jobErr instanceof Error ? jobErr.stack : undefined,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to stop scraping job', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }
  } catch (err) {
    // Catch any unexpected errors
    logger.error('[Recipe Scraper Stop API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/stop', method: 'POST' },
    });

    // Always return JSON, never let Next.js return HTML error page
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to stop scraping job', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
