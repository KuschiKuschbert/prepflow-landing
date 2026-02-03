import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export interface RosterTemplate {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Check if template exists and return it
 */
export async function checkTemplateExists(
  supabase: SupabaseClient,
  templateId: string,
  userId: string,
): Promise<{ template: RosterTemplate } | NextResponse> {
  const { data: existingTemplate, error: fetchError } = await supabase
    .from('roster_templates')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !existingTemplate) {
    if (fetchError) {
      logger.error('[Roster Templates API] Error fetching template or template not found:', {
        templateId,
        error: fetchError?.message,
        context: { endpoint: '/api/roster/templates/[id]', operation: 'checkTemplateExists' },
      });
    }
    return NextResponse.json(ApiErrorHandler.createError('Template not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { template: existingTemplate };
}
