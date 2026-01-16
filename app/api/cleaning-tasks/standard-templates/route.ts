import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getStandardTaskTemplates } from '@/lib/cleaning/standard-tasks';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * GET /api/cleaning-tasks/standard-templates
 * Get list of standard task templates
 *
 * @returns {Promise<NextResponse>} List of standard task templates
 */
export async function GET() {
  try {
    const templates = getStandardTaskTemplates();

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (err: unknown) {
    logger.error('[Cleaning Tasks API] Error fetching standard templates:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks/standard-templates', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Failed to fetch standard task templates',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
