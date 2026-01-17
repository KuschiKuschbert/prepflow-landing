import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PrepListToCreate } from '../types';

export async function createPrepList(userId: string, prepListData: PrepListToCreate) {
  if (!supabaseAdmin) {
    const error = new Error('Database connection could not be established');
    logger.error('[Prep Lists API] Database error creating prep list:', {
      error: error.message,
      prepListName: prepListData.name,
    });
    throw error;
  }

  const { data: prepList, error: prepError } = await supabaseAdmin
    .from('prep_lists')
    .insert({
      user_id: userId,
      kitchen_section_id: prepListData.sectionId,
      name: prepListData.name,
      notes: prepListData.notes || null,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (prepError) {
    logger.error('[Prep Lists API] Database error creating prep list:', {
      error: prepError.message,
      code: prepError.code,
      prepListName: prepListData.name,
    });
    return { prepList: null, error: prepError };
  }

  return { prepList, error: null };
}
