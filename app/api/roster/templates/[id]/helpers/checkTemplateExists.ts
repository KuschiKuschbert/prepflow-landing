import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if template exists and return it
 */
export async function checkTemplateExists(
  templateId: string,
): Promise<{ template: unknown } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: existingTemplate, error: fetchError } = await supabaseAdmin
    .from('roster_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (fetchError || !existingTemplate) {
    logger.error('[Roster Templates API] Error fetching template or template not found:', {
      templateId,
      error: fetchError?.message,
      context: { endpoint: '/api/roster/templates/[id]', operation: 'checkTemplateExists' },
    });
    return NextResponse.json(ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { template: existingTemplate };
}
