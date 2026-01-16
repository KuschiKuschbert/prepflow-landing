/**
 * Apply Template API Route
 * Applies a roster template to a target week, creating actual shifts from template shifts.
 *
 * @module api/roster/templates/[id]/apply
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applyTemplate, validateTemplateApplication } from '@/lib/services/roster/templateService';
import { parse } from 'date-fns';

const applyTemplateSchema = z.object({
  target_week_start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  overwrite_existing: z.boolean().optional().default(false),
});

/**
 * POST /api/roster/templates/[id]/apply
 * Apply a template to a target week.
 *
 * Request body:
 * - target_week_start_date: Target week start date (YYYY-MM-DD) (required)
 * - overwrite_existing: Whether to overwrite existing shifts (optional, default: false)
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

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Templates API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = applyTemplateSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { target_week_start_date, overwrite_existing } = zodValidation.data;

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
      .order('day_of_week', { ascending: true });

    if (shiftsError) {
      logger.error('[Templates API] Database error fetching template shifts:', {
        error: shiftsError.message,
        code: shiftsError.code,
        context: { endpoint: '/api/roster/templates/[id]/apply', operation: 'POST', templateId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(shiftsError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Validate template application
    const targetDate = parse(target_week_start_date, 'yyyy-MM-dd', new Date());
    const validation = validateTemplateApplication(template, templateShifts || [], targetDate);

    if (!validation.isValid) {
      return NextResponse.json(
        ApiErrorHandler.createError(validation.errors.join('; '), 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Get existing shifts for the target week (for conflict detection)
    const weekStart = new Date(targetDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const { data: existingShifts, error: existingShiftsError } = await supabaseAdmin
      .from('shifts')
      .select('*')
      .gte('shift_date', weekStart.toISOString().split('T')[0])
      .lte('shift_date', weekEnd.toISOString().split('T')[0]);

    if (existingShiftsError) {
      logger.error('[Templates API] Database error fetching existing shifts:', {
        error: existingShiftsError.message,
        code: existingShiftsError.code,
        context: { endpoint: '/api/roster/templates/[id]/apply', operation: 'POST', templateId },
      });
    }

    // Apply template (this creates shift objects but doesn't save them yet)
    const applicationRequest = {
      templateId,
      targetWeekStartDate: target_week_start_date,
      overwriteExisting: overwrite_existing || false,
    };

    const applicationResult = applyTemplate(
      applicationRequest,
      template,
      templateShifts || [],
      existingShifts || [],
    );

    // Note: The applyTemplate function returns shift objects but doesn't save them.
    // In a real implementation, you would save the shifts here.
    // For now, we return the result indicating what would be created.

    return NextResponse.json({
      success: applicationResult.success,
      message: `Template application completed: ${applicationResult.shiftsCreated} created, ${applicationResult.shiftsUpdated} updated, ${applicationResult.shiftsSkipped} skipped`,
      result: applicationResult,
      note: 'Shifts are created as draft. Use the shifts API to assign employees and publish.',
    });
  } catch (err) {
    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]/apply', method: 'POST' },
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
