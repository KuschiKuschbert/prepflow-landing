/**
 * Validation and create logic for template shifts POST.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function verifyTemplateAndCreateShift(
  supabase: SupabaseClient,
  templateId: string,
  userId: string,
  body: {
    day_of_week?: number;
    start_time?: string;
    end_time?: string;
    role_required?: string | null;
    min_employees?: number;
  },
): Promise<{ success: true; templateShift: unknown } | NextResponse> {
  const { data: template, error: templateError } = await supabase
    .from('roster_templates')
    .select('id')
    .eq('id', templateId)
    .eq('user_id', userId)
    .single();

  if (templateError || !template) {
    return NextResponse.json(ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404), {
      status: 404,
    });
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
      ApiErrorHandler.createError('Start time and end time are required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  const templateShiftData = {
    template_id: templateId,
    day_of_week,
    start_time,
    end_time,
    role_required: role_required || null,
    min_employees: min_employees ?? 1,
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

  return { success: true, templateShift };
}
