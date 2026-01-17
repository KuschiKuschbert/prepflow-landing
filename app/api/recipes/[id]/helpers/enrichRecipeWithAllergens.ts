/**
 * Helper for enriching recipe with allergen and dietary data
 */

import { aggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Enriches recipe with aggregated allergens and dietary status
 *
 * @param {string} recipeId - Recipe ID
 * @param {any} recipe - Recipe data
 * @returns {Promise<any>} Enriched recipe
 */
export async function enrichRecipeWithAllergens(recipeId: string, recipe: Record<string, unknown>) {
  // Always aggregate allergens and dietary status (even if cached)
  const [allergens, dietaryStatus] = await Promise.all([
    aggregateRecipeAllergens(recipeId),
    aggregateRecipeDietaryStatus(recipeId),
  ]);

  // Consolidate allergens for validation
  const consolidatedAllergens = consolidateAllergens(allergens || []);

  // Runtime validation: check for conflict between vegan status and allergens
  let validatedIsVegan = dietaryStatus?.isVegan ?? null;
  if (validatedIsVegan === true) {
    const hasMilk = consolidatedAllergens.includes('milk');
    const hasEggs = consolidatedAllergens.includes('eggs');
    if (hasMilk || hasEggs) {
      logger.warn('[Recipes API] Runtime validation: vegan=true but allergens include milk/eggs', {
        recipeId,
        recipeName: recipe.recipe_name,
        allergens: consolidatedAllergens,
        hasMilk,
        hasEggs,
      });
      validatedIsVegan = false;
    }
  }

  // Update recipe cache with aggregated allergens if they differ
  if (
    allergens &&
    allergens.length > 0 &&
    (!recipe.allergens || JSON.stringify(recipe.allergens) !== JSON.stringify(allergens))
  ) {
    // Update cache in background (don't await)
    supabaseAdmin
      ?.from('recipes')
      .update({ allergens })
      .eq('id', recipeId)
      .then(({ error }) => {
        if (error) {
          logger.warn('[Recipes API] Failed to cache aggregated allergens:', {
            recipeId,
            error: error.message,
          });
        }
      });
  }

  return {
    ...recipe,
    allergens: consolidatedAllergens,
    is_vegetarian: dietaryStatus?.isVegetarian ?? null,
    is_vegan: validatedIsVegan,
    dietary_confidence: dietaryStatus?.confidence ?? null,
    dietary_method: dietaryStatus?.method ?? null,
  };
}
