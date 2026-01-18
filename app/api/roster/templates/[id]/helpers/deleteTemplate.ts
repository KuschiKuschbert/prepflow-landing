import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { checkTemplateExists } from './checkTemplateExists';

/**
 * Delete template by ID
 */
export async function deleteTemplate(supabase: SupabaseClient, templateId: string): Promise<NextResponse> {
  // Check if template exists
  const existsResult = await checkTemplateExists(supabase, templateId);
  if (existsResult instanceof NextResponse) {
    return existsResult;
  }

  // Delete template (template_shifts will be deleted via CASCADE)
  const { error: deleteError } = await supabase
    .from('roster_templates')
    .delete()
    .eq('id', templateId);

  if (deleteError) {
    logger.error('[Templates API] Database error deleting template:', {
      error: deleteError.message,
      code: deleteError.code,
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
