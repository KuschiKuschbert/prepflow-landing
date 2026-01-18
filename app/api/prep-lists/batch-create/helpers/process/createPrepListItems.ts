import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PrepListToCreate } from '../types';

export async function createPrepListItems(prepListId: string, items: PrepListToCreate['items']) {
  if (!supabaseAdmin) throw new Error('Database connection could not be established');

  const prepItems = items.map(item => ({
    prep_list_id: prepListId,
    ingredient_id: item.ingredientId,
    quantity: parseFloat(item.quantity || '0') || 0,
    unit: item.unit,
    notes: item.notes || null,
  }));

  if (prepItems.length === 0) return { error: null };

  const { error: itemsError } = await supabaseAdmin.from('prep_list_items').insert(prepItems);

  if (itemsError) {
    logger.error('[Prep Lists API] Error creating prep list items:', {
      error: itemsError.message,
      code: itemsError.code,
      prepListId: prepListId,
    });
    return { error: itemsError };
  }

  return { error: null };
}
