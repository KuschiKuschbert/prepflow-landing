import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { detectCategory } from '@/lib/error-detection/category-detector';
import { detectSeverity } from '@/lib/error-detection/severity-detector';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const clientErrorSchema = z.object({
  message: z.string(),
  source: z.string().optional(),
  lineno: z.number().optional(),
  colno: z.number().optional(),
  stack: z.string().optional(),
  filename: z.string().optional(),
  error: z
    .object({
      message: z.string(),
      stack: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  url: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string(),
});

/**
 * POST /api/admin/errors/client
 * Receive client-side errors and store in admin_error_logs table
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = clientErrorSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid error data',
          'VALIDATION_ERROR',
          400,
          validationResult.error.issues,
        ),
        { status: 400 },
      );
    }

    const errorData = validationResult.data;

    // Get user session to associate error with user
    let userId: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        // Look up user_id from email
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();
        if (userData) {
          userId = userData.id;
        }
      }
    } catch (err) {
      // Silently fail - continue without user_id if lookup fails
      logger.dev('[Client Error API] Failed to get user_id:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Auto-detect severity and category
    const detectionContext = {
      message: errorData.message,
      error: errorData.error?.message || errorData.message,
      endpoint: errorData.url,
      component: errorData.filename || errorData.source,
    };

    const severity = detectSeverity(detectionContext);
    const category = detectCategory(detectionContext);

    // Build error message with context
    const errorMessage = errorData.error?.message || errorData.message;
    const stackTrace = errorData.error?.stack || errorData.stack || undefined;

    // Build context object
    const context = {
      source: errorData.source,
      lineno: errorData.lineno,
      colno: errorData.colno,
      filename: errorData.filename,
      url: errorData.url,
      userAgent: errorData.userAgent,
      timestamp: errorData.timestamp,
    };

    // Store error in database
    const { data: insertedError, error: dbError } = await supabaseAdmin
      .from('admin_error_logs')
      .insert({
        user_id: userId, // Associate error with user if authenticated
        endpoint: errorData.url || null,
        error_message: errorMessage,
        stack_trace: stackTrace,
        context: context,
        severity,
        category,
        status: 'new',
      })
      .select('id')
      .single();

    if (dbError) {
      logger.error('[Client Error API] Database error:', {
        error: dbError.message,
        context: { endpoint: '/api/admin/errors/client', method: 'POST' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(dbError, 500), { status: 500 });
    }

    // Check if user has auto-report enabled and error is critical/safety
    if (userId && insertedError && (severity === 'critical' || severity === 'safety')) {
      try {
        // Get user's auto-report preference
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('notification_preferences')
          .eq('id', userId)
          .single();

        const preferences = (userData?.notification_preferences as Record<string, unknown>) || {};
        const errorReporting = (preferences.errorReporting as Record<string, unknown>) || {};
        const autoReport = Boolean(errorReporting.autoReport);

        if (autoReport) {
          // Automatically create support ticket
          // Use fetch to call auto-report endpoint (non-blocking)
          fetch('/api/user/errors/auto-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error_id: insertedError.id }),
          }).catch(err => {
            // Silently fail - don't break error logging
            logger.dev('[Client Error API] Failed to auto-report error:', {
              error: err instanceof Error ? err.message : String(err),
            });
          });
        }
      } catch (err) {
        // Silently fail - don't break error logging
        logger.dev('[Client Error API] Failed to check auto-report preference:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully',
      error_id: insertedError?.id,
    });
  } catch (error) {
    logger.error('[Client Error API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/errors/client', method: 'POST' },
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
