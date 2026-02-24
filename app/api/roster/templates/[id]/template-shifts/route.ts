/**
 * Template Shifts API Route
 * Handles GET (list template shifts) and POST (create template shift) operations.
 *
 * @module api/roster/templates/[id]/template-shifts
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

/**
 * GET /api/roster/templates/[id]/template-shifts
 * List template shifts for a template.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { id } = await context.params;
    const templateId = id;

    // Verify template exists and belongs to user
    const { data: template, error: templateError } = await supabase
      .from('roster_templates')
      .select('id')
      .eq('id', templateId)
      .eq('user_id', userId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const { data: templateShifts, error: dbError } = await supabase
      .from('template_shifts')
      .select('*')
      .eq('template_id', templateId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (dbError) {
      logger.error('[Template Shifts API] Database error fetching template shifts:', {
        error: dbError.message,
        code: dbError.code,
        context: {
          endpoint: '/api/roster/templates/[id]/template-shifts',
          operation: 'GET',
          templateId,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      templateShifts: templateShifts || [],
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Template Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]/template-shifts', method: 'GET' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }

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
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { id } = await context.params;
    const templateId = id;

    // Verify template exists and belongs to user
    const { data: template, error: templateError } = await supabase
      .from('roster_templates')
      .select('id')
      .eq('id', templateId)
      .eq('user_id', userId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

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

    const { data: templateShift, error: insertError } = await supabase
      .from('template_shifts')
      .insert(templateShiftData)
      .select()
      .single();

    if (insertError) {
      logger.error('[Template Shifts API] Database error creating template shift:', {
        error: insertError.message,
        code: insertError.code,
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
    if (err instanceof NextResponse) return err;
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          err.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    logger.error('[Template Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]/template-shifts', method: 'POST' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }

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
