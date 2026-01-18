import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { buildUpdateData } from './buildUpdateData';
import { checkTemplateExists } from './checkTemplateExists';

/**
 * Update template by ID
 */
export async function updateTemplate(
  supabase: SupabaseClient,
  templateId: string,
  body: unknown,
): Promise<NextResponse> {
  // Check if template exists
  const existsResult = await checkTemplateExists(supabase, templateId);
  if (existsResult instanceof NextResponse) {
    return existsResult;
  }

  // Build update data
  const updateData = buildUpdateData(body as Record<string, unknown>);

  // Update template
  const { data: template, error: updateError } = await supabase
    .from('roster_templates')
    .update(updateData)
    .eq('id', templateId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Templates API] Database error updating template:', {
      error: updateError.message,
      code: updateError.code,
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
}
