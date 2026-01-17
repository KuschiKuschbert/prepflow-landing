import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { IngredientMerge } from './types';

export async function executeIngredientMerge(m: IngredientMerge): Promise<void> {
  if (m.removed.length === 0) return;
  if (!supabaseAdmin) return;

  // Repoint recipe_ingredients to survivor
  const { error: updateError } = await supabaseAdmin
    .from('recipe_ingredients')
    .update({ ingredient_id: m.survivor })
    .in('ingredient_id', m.removed);

  if (updateError) {
    logger.error('[Dedupe Execute API] Error updating recipe ingredients:', {
      error: updateError.message,
      code: updateError.code,
      merge: m,
      context: { endpoint: '/api/dedupe/execute', operation: 'updateRecipeIngredients' },
    });
    // Continue with other merges even if one fails
    return;
  }

  // Delete removed ingredients
  const { error: deleteError } = await supabaseAdmin
    .from('ingredients')
    .delete()
    .in('id', m.removed);

  if (deleteError) {
    logger.error('[Dedupe Execute API] Error deleting duplicate ingredients:', {
      error: deleteError.message,
      code: deleteError.code,
      merge: m,
      context: { endpoint: '/api/dedupe/execute', operation: 'deleteIngredients' },
    });
  }
}
