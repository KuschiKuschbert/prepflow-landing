import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Checks if the cross-referencing migration has been run by testing if recipe_id column exists.
 *
 * @param {SupabaseClient} supabase - Supabase client instance.
 * @returns {Promise<boolean>} True if migration has been run, false otherwise.
 */
export async function checkCrossReferencingEnabled(supabase: SupabaseClient): Promise<boolean> {
  try {
    const { error: testError } = await supabase
      .from('menu_recipe_cards')
      .select('recipe_id')
      .limit(0);

    // If no error (or error is about no rows, not missing column), migration is run
    if (
      !testError ||
      (testError.code !== '42703' &&
        !testError.message?.includes('column') &&
        !testError.message?.includes('does not exist'))
    ) {
      logger.dev('Cross-referencing enabled - migration detected');
      return true;
    } else {
      logger.dev('Cross-referencing disabled - migration not run, using old method');
      return false;
    }
  } catch (err) {
    logger.dev('Could not determine migration status, using old method:', err);
    return false;
  }
}
