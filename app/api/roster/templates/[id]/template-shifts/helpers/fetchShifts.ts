/**
 * Fetch template shifts for GET.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function fetchTemplateShifts(
  supabase: SupabaseClient,
  templateId: string,
  userId: string,
): Promise<NextResponse | { templateShifts: unknown[] }> {
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

  return { templateShifts: templateShifts || [] };
}
