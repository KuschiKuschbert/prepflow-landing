import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { RawMenuItem } from '../../../../types';

/**
 * Sync actual selling price to dish or recipe table.
 *
 * @param {RawMenuItem} menuItem - Menu item with dish_id or recipe_id
 * @param {number | null} actualSellingPrice - Price to sync (null to clear)
 * @returns {Promise<void>} Resolves when sync completes (errors are logged but don't throw)
 */
export async function syncPrice(menuItem: RawMenuItem, actualSellingPrice: number | null) {
  const priceToSync = actualSellingPrice === null ? null : actualSellingPrice;

  if (menuItem.dish_id) {
    // Update dish.selling_price
    const { error: dishUpdateError } = await supabaseAdmin!
      .from('dishes')
      .update({ selling_price: priceToSync })
      .eq('id', menuItem.dish_id);

    if (dishUpdateError) {
      logger.error('Error syncing price to dish:', dishUpdateError);
      // Don't fail the request, but log the error
    }
  } else if (menuItem.recipe_id) {
    // Update recipe.selling_price (per serving)
    const { error: recipeUpdateError } = await supabaseAdmin!
      .from('recipes')
      .update({ selling_price: priceToSync })
      .eq('id', menuItem.recipe_id);

    if (recipeUpdateError) {
      logger.error('Error syncing price to recipe:', recipeUpdateError);
      // Don't fail the request, but log the error
    }
  }
}
