/**
 * Recipe Scraper Resume API
 * Resumes a paused/stopped comprehensive scraping job
 */
import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getComprehensiveScraperJob } from '@/lib/recipes/jobs/comprehensive-scraper';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    // Get job instance and resume it
    try {
      const job = getComprehensiveScraperJob();
      const statusBefore = job.getStatus() as any;

      if (statusBefore.isRunning) {
        return NextResponse.json({
          success: true,
          message: 'Scraper is already running',
          data: { wasRunning: true, isRunning: true },
        });
      }

      // Resume the job
      await job.resume();

      // Get status after resuming
      const statusAfter = job.getStatus() as any;

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
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to resume scraping job', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }
  } catch (err) {
    logger.error('[Recipe Scraper Resume API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to resume scraping job', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
