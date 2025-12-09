import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Check if template exists and return it
 */
export async function checkTemplateExists(
  templateId: string,
): Promise<{ template: any } | NextResponse> {
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
    return NextResponse.json(ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { template: existingTemplate };
}
