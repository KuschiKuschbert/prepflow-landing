import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { checkTemplateExists } from './checkTemplateExists';

/**
 * Delete template by ID
 */
export async function deleteTemplate(templateId: string): Promise<NextResponse> {
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

  // Delete template (template_shifts will be deleted via CASCADE)
  const { error: deleteError } = await supabaseAdmin
    .from('roster_templates')
    .delete()
    .eq('id', templateId);

  if (deleteError) {
    logger.error('[Templates API] Database error deleting template:', {
      error: deleteError.message,
      code: (deleteError as unknown).code,
      context: { endpoint: '/api/roster/templates/[id]', operation: 'DELETE', templateId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Template deleted successfully',
  });
}
