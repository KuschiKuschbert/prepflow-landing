/**
 * Helper for processing recipe allergens for a dish
 */

import { supabaseAdmin } from '@/lib/supabase';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

export interface AllergenSource {
  source_type: 'recipe' | 'ingredient';
  source_id: string;
  source_name: string;
  quantity?: number;
  unit?: string;
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

/**
 * Processes recipe allergens for a dish
 *
 * @param {string} dishId - Dish ID
 * @param {Record<string, AllergenSource[]>} allergenSources - Allergen sources map to populate
 * @param {Set<string>} allAllergens - Set of all allergens to populate
 * @returns {Promise<void>}
 */
export async function processRecipeAllergens(
  dishId: string,
  allergenSources: Record<string, AllergenSource[]>,
  allAllergens: Set<string>,
): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { data: dishRecipes, error: recipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      recipe_id,
      quantity,
      unit,
      recipes (
        id,
        name,
        recipe_name,
        allergens
      )
    `,
    )
    .eq('dish_id', dishId);

  if (recipesError || !dishRecipes) {
    return;
  }

  dishRecipes.forEach(dr => {
    const recipe = dr.recipes as unknown as {
      id: string;
      name?: string;
      recipe_name?: string;
      allergens?: string[];
    } | null;

    if (!recipe) return;

    const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';
    const allergens = (recipe.allergens as string[]) || [];
    const consolidatedAllergens = consolidateAllergens(allergens);

    consolidatedAllergens.forEach(allergen => {
      if (typeof allergen === 'string' && allergen.length > 0) {
        allAllergens.add(allergen);

        if (!allergenSources[allergen]) {
          allergenSources[allergen] = [];
        }

        allergenSources[allergen].push({
          source_type: 'recipe',
          source_id: recipe.id,
          source_name: recipeName,
          quantity: dr.quantity || undefined,
          unit: dr.unit || undefined,
        });
      }
    });
  });
}




