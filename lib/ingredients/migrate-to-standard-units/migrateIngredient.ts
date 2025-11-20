import { createSupabaseAdmin } from '@/lib/supabase';
import { normalizeUnit } from '@/lib/unit-conversion';
import type { IngredientRow } from './types';
import { convertIngredientCosts, determineStandardUnit } from './conversion';

/**
 * Migrate a single ingredient to standard units.
 *
 * @param {IngredientRow} ingredient - Ingredient to migrate
 * @param {ReturnType<typeof createSupabaseAdmin>} supabaseAdmin - Supabase admin client
 * @returns {Promise<Object>} Migration result
 */
export async function migrateIngredient(
  ingredient: IngredientRow,
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const unitToMigrate = ingredient.pack_size_unit || ingredient.unit || 'pc';
    const normalizedUnit = normalizeUnit(unitToMigrate);
    const standardUnit = determineStandardUnit(unitToMigrate);

    if (normalizedUnit === standardUnit) {
      const { error } = await supabaseAdmin
        .from('ingredients')
        .update({ standard_unit: standardUnit.toUpperCase(), original_unit: unitToMigrate })
        .eq('id', ingredient.id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const {
      convertedPackSize,
      convertedCostPerUnit,
      convertedCostPerUnitAsPurchased,
      convertedCostPerUnitInclTrim,
    } = convertIngredientCosts(ingredient, normalizedUnit, standardUnit);

    const updateData: Partial<IngredientRow> = {
      unit: standardUnit.toUpperCase(),
      cost_per_unit: convertedCostPerUnit,
      standard_unit: standardUnit.toUpperCase(),
      original_unit: unitToMigrate,
    };
    if (convertedPackSize !== null) updateData.pack_size = convertedPackSize.toString();
    if (convertedCostPerUnitAsPurchased !== undefined)
      updateData.cost_per_unit_as_purchased = convertedCostPerUnitAsPurchased;
    if (convertedCostPerUnitInclTrim !== undefined)
      updateData.cost_per_unit_incl_trim = convertedCostPerUnitInclTrim;

    const { error } = await supabaseAdmin
      .from('ingredients')
      .update(updateData)
      .eq('id', ingredient.id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: errorMsg };
  }
}
