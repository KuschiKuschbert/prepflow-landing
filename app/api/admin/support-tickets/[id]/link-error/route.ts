import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const linkErrorSchema = z.object({
  error_id: z.string().uuid(),
});

/**
 * POST /api/admin/support-tickets/[id]/link-error
 * Link ticket to an error log
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    // Validate request body
    const validationResult = linkErrorSchema.safeParse(body);
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

    // Verify error exists
    const { data: errorLog, error: errorCheck } = await supabaseAdmin
      .from('admin_error_logs')
      .select('id')
      .eq('id', error_id)
      .single();

    if (errorCheck || !errorLog) {
      return NextResponse.json(
        ApiErrorHandler.createError('Error log not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Update ticket with related_error_id
    const { data: ticket, error: updateError } = await supabaseAdmin
      .from('support_tickets')
      .update({ related_error_id: error_id })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          ApiErrorHandler.createError('Ticket not found', 'NOT_FOUND', 404),
          { status: 404 },
        );
      }

      logger.error('[Admin Support Tickets API] Database error:', {
        error: updateError.message,
        context: { endpoint: `/api/admin/support-tickets/${id}/link-error`, method: 'POST' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(updateError, 500), {
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket linked to error log successfully',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Support Tickets API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: `/api/admin/support-tickets/[id]/link-error`, method: 'POST' },
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




