/**
 * Template Shifts API Route
 * Handles GET (list template shifts) and POST (create template shift) operations for a template.
 *
 * @module api/roster/templates/[id]/template-shifts
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/roster/templates/[id]/template-shifts
 * List template shifts for a template.
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templateId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data: templateShifts, error } = await supabaseAdmin
      .from('template_shifts')
      .select('*')
      .eq('template_id', templateId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      logger.error('[Template Shifts API] Database error fetching template shifts:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/roster/templates/[id]/template-shifts',
          operation: 'GET',
          templateId,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      templateShifts: templateShifts || [],
    });
  } catch (err) {
    logger.error('[Template Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]/template-shifts', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
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
 * POST /api/roster/templates/[id]/template-shifts
 * Create a new template shift for a template.
 *
 * Request body:
 * - day_of_week: Day of week (0=Sunday, 1=Monday, ..., 6=Saturday) (required)
 * - start_time: Start time (HH:MM:SS) (required)
 * - end_time: End time (HH:MM:SS) (required)
 * - role_required: Role required for shift (optional)
 * - min_employees: Minimum employees needed (optional, default: 1)
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templateId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify template exists
    const { data: template, error: templateError } = await supabaseAdmin
      .from('roster_templates')
      .select('id')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    const body = await request.json();
    const { day_of_week, start_time, end_time, role_required, min_employees } = body;

    if (day_of_week === undefined || day_of_week < 0 || day_of_week > 6) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Day of week must be between 0 (Sunday) and 6 (Saturday)',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!start_time || !end_time) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Start time and end time are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const templateShiftData = {
      template_id: templateId,
      day_of_week,
      start_time,
      end_time,
      role_required: role_required || null,
      min_employees: min_employees || 1,
    };

    const { data: templateShift, error: insertError } = await supabaseAdmin
      .from('template_shifts')
      .insert(templateShiftData)
      .select()
      .single();

    if (insertError) {
      logger.error('[Template Shifts API] Database error creating template shift:', {
        error: insertError.message,
        code: (insertError as any).code,
        context: {
          endpoint: '/api/roster/templates/[id]/template-shifts',
          operation: 'POST',
          templateId,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      templateShift,
      message: 'Template shift created successfully',
    });
  } catch (err) {
    logger.error('[Template Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]/template-shifts', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}



