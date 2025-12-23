import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { getPreferences } from './helpers/getPreferences';
import { updatePreferences } from './helpers/updatePreferences';
import { z } from 'zod';

/**
 * GET /api/user/error-reporting-preferences
 * Get user's error reporting preferences
 * Requires authentication
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    return await getPreferences(user.email);
  } catch (error) {
    logger.error('[Error Reporting Preferences API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/error-reporting-preferences', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

/**
 * PUT /api/user/error-reporting-preferences
 * Update user's error reporting preferences
 * Requires authentication
 */
const errorReportingPreferencesSchema = z.object({
  auto_report_enabled: z.boolean().optional(),
  report_level: z.enum(['none', 'errors', 'warnings', 'all']).optional(),
  include_stack_trace: z.boolean().optional(),
  include_user_context: z.boolean().optional(),
  include_browser_info: z.boolean().optional(),
}).passthrough(); // Allow additional fields

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = user.email;

    let body: unknown;
    try {
      body = await req.json();
    } catch (err) {
      logger.warn('[Error Reporting Preferences API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = errorReportingPreferencesSchema.safeParse(body);
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

    return await updatePreferences(userEmail, validationResult.data);
  } catch (error) {
    logger.error('[Error Reporting Preferences API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/error-reporting-preferences', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
