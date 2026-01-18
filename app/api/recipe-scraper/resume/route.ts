/**
 * Recipe Scraper Resume API
 * Resumes a paused/stopped comprehensive scraping job
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Resume confirmation
 */
import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getComprehensiveScraperJob } from '@/scripts/recipe-scraper/jobs/comprehensive-scraper';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    // Get job instance and resume it
    try {
      const job = getComprehensiveScraperJob();
      const statusBefore = job.getStatus();

      if (statusBefore.isRunning) {
        return NextResponse.json({
          success: true,
          message: 'Scraper is already running',
          data: { wasRunning: true, isRunning: true },
        });
      }

      // Resume the job (this will check for saved progress and continue)
      await job.resume();

      // Get status after resuming
      const statusAfter = job.getStatus();

      logger.info('[Recipe Scraper Resume API] Scraper resumed successfully', {
        wasRunning: statusBefore.isRunning,
        isRunning: statusAfter.isRunning,
      });

      return NextResponse.json({
        success: true,
        message: 'Scraping job resumed successfully',
        data: {
          wasRunning: statusBefore.isRunning,
          isRunning: statusAfter.isRunning,
          status: statusAfter,
        },
      });
    } catch (jobErr) {
      logger.error('[Recipe Scraper Resume API] Error resuming job:', {
        error: jobErr instanceof Error ? jobErr.message : String(jobErr),
        stack: jobErr instanceof Error ? jobErr.stack : undefined,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to resume scraping job', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }
  } catch (err) {
    logger.error('[Recipe Scraper Resume API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/resume', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to resume scraping job', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
