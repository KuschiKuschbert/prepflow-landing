import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Get template by ID with template shifts
 */
export async function getTemplate(supabase: SupabaseClient, templateId: string): Promise<NextResponse> {
  // Get template
  const { data: template, error: templateError } = await supabase
    .from('roster_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (templateError || !template) {
    return NextResponse.json(ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  // Get template shifts
  const { data: templateShifts, error: shiftsError } = await supabase
    .from('template_shifts')
    .select('*')
    .eq('template_id', templateId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (shiftsError) {
    logger.error('[Templates API] Database error fetching template shifts:', {
      error: shiftsError.message,
      code: shiftsError.code,
      context: { endpoint: '/api/roster/templates/[id]', operation: 'GET', templateId },
    });
  }

  return NextResponse.json({
    success: true,
    template,
    templateShifts: templateShifts || [],
  });
}
