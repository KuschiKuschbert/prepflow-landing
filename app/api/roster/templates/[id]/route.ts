/**
 * Roster Template API Route (by ID)
 * Handles GET (get template), PUT (update template), and DELETE (delete template) operations.
 *
 * @module api/roster/templates/[id]
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/roster/templates/[id]
 * Get a single template by ID with its template shifts.
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

    // Get template
    const { data: template, error: templateError } = await supabaseAdmin
      .from('roster_templates')
      .select('*')
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

    // Get template shifts
    const { data: templateShifts, error: shiftsError } = await supabaseAdmin
      .from('template_shifts')
      .select('*')
      .eq('template_id', templateId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (shiftsError) {
      logger.error('[Templates API] Database error fetching template shifts:', {
        error: shiftsError.message,
        code: (shiftsError as any).code,
        context: { endpoint: '/api/roster/templates/[id]', operation: 'GET', templateId },
      });
    }

    return NextResponse.json({
      success: true,
      template,
      templateShifts: templateShifts || [],
    });
  } catch (err) {
    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]', method: 'GET' },
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
 * PUT /api/roster/templates/[id]
 * Update an existing template.
 *
 * Request body:
 * - name: Template name (optional)
 * - description: Template description (optional)
 * - is_active: Whether template is active (optional)
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templateId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if template exists
    const { data: existingTemplate, error: fetchError } = await supabaseAdmin
      .from('roster_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (fetchError || !existingTemplate) {
      return NextResponse.json(
        ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    // Update template
    const { data: template, error: updateError } = await supabaseAdmin
      .from('roster_templates')
      .update(updateData)
      .eq('id', templateId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Templates API] Database error updating template:', {
        error: updateError.message,
        code: (updateError as any).code,
        context: { endpoint: '/api/roster/templates/[id]', operation: 'PUT', templateId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      template,
      message: 'Template updated successfully',
    });
  } catch (err) {
    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]', method: 'PUT' },
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
 * DELETE /api/roster/templates/[id]
 * Delete a template and its template shifts (cascade).
 */
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const templateId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if template exists
    const { data: existingTemplate, error: fetchError } = await supabaseAdmin
      .from('roster_templates')
      .select('id')
      .eq('id', templateId)
      .single();

    if (fetchError || !existingTemplate) {
      return NextResponse.json(
        ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    // Delete template (template_shifts will be deleted via CASCADE)
    const { error: deleteError } = await supabaseAdmin
      .from('roster_templates')
      .delete()
      .eq('id', templateId);

    if (deleteError) {
      logger.error('[Templates API] Database error deleting template:', {
        error: deleteError.message,
        code: (deleteError as any).code,
        context: { endpoint: '/api/roster/templates/[id]', operation: 'DELETE', templateId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (err) {
    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]', method: 'DELETE' },
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
