import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { detectSeverity } from '@/lib/error-detection/severity-detector';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const autoReportSchema = z.object({
  error_id: z.string().uuid(),
});

/**
 * POST /api/user/errors/auto-report
 * Automatically create support ticket from error (called when auto-report is enabled)
 * Requires authentication
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
    const body = await req.json();

    // Validate request body
    const validationResult = autoReportSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid request data',
          'VALIDATION_ERROR',
          400,
          validationResult.error.issues,
        ),
        { status: 400 },
      );
    }

    const { error_id } = validationResult.data;

    // Get user_id from email
    let userId: string | null = null;
    try {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();
      if (userData) {
        userId = userData.id;
      }
    } catch (err) {
      // User not found - continue with null userId
      logger.dev('[Auto-Report API] User not found in database:', {
        userEmail,
      });
    }

    // Get error details
    const { data: errorData, error: errorFetchError } = await supabaseAdmin
      .from('admin_error_logs')
      .select('error_message, severity, category, stack_trace, context')
      .eq('id', error_id)
      .single();

    if (errorFetchError || !errorData) {
      logger.error('[Auto-Report API] Error not found:', {
        error: errorFetchError?.message,
        error_id,
        context: { endpoint: '/api/user/errors/auto-report', method: 'POST' },
      });

      return NextResponse.json(ApiErrorHandler.createError('Error not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Only auto-report critical or safety errors
    if (errorData.severity !== 'critical' && errorData.severity !== 'safety') {
      return NextResponse.json({
        success: true,
        message: 'Error severity does not require auto-reporting',
        skipped: true,
      });
    }

    // Build ticket subject and message
    const subject = `Auto-reported ${errorData.severity} error: ${errorData.error_message.substring(0, 150)}`;
    const message = `This error was automatically reported due to critical severity.

Error Message: ${errorData.error_message}
Severity: ${errorData.severity}
Category: ${errorData.category}

${errorData.stack_trace ? `Stack Trace:\n${errorData.stack_trace}` : ''}

${errorData.context ? `Context:\n${JSON.stringify(errorData.context, null, 2)}` : ''}`;

    // Auto-detect severity for ticket
    const detectionContext = {
      message: `${subject} ${message}`,
      endpoint: '/api/user/errors/auto-report',
    };
    const ticketSeverity = detectSeverity(detectionContext);

    // Create support ticket
    const { data: ticket, error: dbError } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: userId,
        user_email: userEmail,
        subject,
        message,
        type: 'error',
        severity: ticketSeverity,
        status: 'open',
        related_error_id: error_id,
      })
      .select('id')
      .single();

    if (dbError) {
      logger.error('[Auto-Report API] Database error:', {
        error: dbError.message,
        context: { endpoint: '/api/user/errors/auto-report', method: 'POST' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(dbError, 500), { status: 500 });
    }

    logger.info('[Auto-Report API] Auto-reported error as ticket:', {
      userEmail,
      error_id,
      ticket_id: ticket?.id,
      severity: errorData.severity,
    });

    return NextResponse.json({
      success: true,
      message: 'Error automatically reported as support ticket',
      ticket_id: ticket?.id,
    });
  } catch (error) {
    logger.error('[Auto-Report API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/errors/auto-report', method: 'POST' },
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
