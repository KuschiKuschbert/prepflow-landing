import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { checkTemplateExists } from './checkTemplateExists';
import { buildUpdateData } from './buildUpdateData';

/**
 * Update template by ID
 */
export async function updateTemplate(templateId: string, body: unknown): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Check if template exists
  const existsResult = await checkTemplateExists(templateId);
  if (existsResult instanceof NextResponse) {
    return existsResult;
  }

  // Build update data
  const updateData = buildUpdateData(body);

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
      code: (updateError as unknown).code,
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
