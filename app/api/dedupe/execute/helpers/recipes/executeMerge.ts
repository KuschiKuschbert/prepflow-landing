import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { RecipeMerge } from './types';

export async function executeRecipeMerge(m: RecipeMerge): Promise<void> {
  if (m.removed.length === 0) return;
  if (!supabaseAdmin) return;

  // Repoint menu_items to survivor
  const { error: updateError } = await supabaseAdmin
    .from('menu_items')
    .update({ recipe_id: m.survivor })
    .in('recipe_id', m.removed);

  if (updateError) {
    logger.error('[Dedupe Execute API] Error updating menu items:', {
      error: updateError.message,
      code: updateError.code,
      merge: m,
      context: { endpoint: '/api/dedupe/execute', operation: 'updateMenuItems' },
    });
    // Continue with other merges even if one fails
    return;
  }

  // Delete removed recipes
  const { error: deleteError } = await supabaseAdmin
    .from('recipes')
    .delete()
    .in('id', m.removed);

  if (deleteError) {
    logger.error('[Dedupe Execute API] Error deleting duplicate recipes:', {
      error: deleteError.message,
      code: deleteError.code,
      merge: m,
      context: { endpoint: '/api/dedupe/execute', operation: 'deleteRecipes' },
    });
  }
}
