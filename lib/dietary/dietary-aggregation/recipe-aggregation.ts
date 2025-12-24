/**
 * Recipe dietary status aggregation.
 * Aggregates vegetarian/vegan status for recipes.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { detectDietarySuitability, DietaryDetectionResult } from '../vegetarian-vegan-detection';
import { cacheDietaryStatus } from './cache-management';
import { checkCachedRecipeDietaryStatus } from './recipe-aggregation/helpers/checkCachedStatus';
import { fetchRecipeIngredients } from './recipe-aggregation/helpers/fetchRecipeIngredients';
import { aggregateIngredientAllergens } from './recipe-aggregation/helpers/aggregateAllergens';

/**
 * Aggregate dietary status for a single recipe
 * Checks cache first, then runs detection if needed
 *
 * @param {string} recipeId - Recipe ID
 * @param {boolean} useAI - Use AI detection (optional)
 * @param {boolean} force - Force recalculation even if cached (optional, default: false)
 * @returns {Promise<DietaryDetectionResult | null>} Dietary detection result
 */
export async function aggregateRecipeDietaryStatus(
  recipeId: string,
  useAI?: boolean,
  force: boolean = false,
): Promise<DietaryDetectionResult | null> {
  if (!supabaseAdmin) {
    logger.error('[Dietary Aggregation] Supabase admin client not available');
    return null;
  }

  try {
    // Check cached status
    const cachedStatus = await checkCachedRecipeDietaryStatus(recipeId, force);
    if (cachedStatus) {
      return cachedStatus;
    }

    // Fetch recipe ingredients
    const ingredients = await fetchRecipeIngredients(recipeId);

    // Fetch recipe name (needed for detection and name-based check)
    const { data: recipeData, error: recipeDataError } = await supabaseAdmin
      .from('recipes')
      .select('recipe_name, description')
      .eq('id', recipeId)
      .single();

    if (recipeDataError) {
      logger.error('[Dietary Aggregation] Error fetching recipe data:', {
        error: recipeDataError.message,
        recipeId,
        context: { operation: 'aggregateRecipeDietaryStatus' },
      });
    }

    if (ingredients.length === 0) {
      // No ingredients - check recipe name for non-vegetarian keywords
      const { isNonVegetarianIngredient } =
        await import('@/lib/dietary/vegetarian-vegan-detection');
      const recipeName = recipeData?.recipe_name || '';

      // If recipe name contains meat/fish keywords, mark as non-vegetarian
      if (recipeName && isNonVegetarianIngredient(recipeName)) {
        const result: DietaryDetectionResult = {
          isVegetarian: false,
          isVegan: false,
          confidence: 'high',
          reason: `Recipe name "${recipeName}" contains meat/fish keywords`,
          method: 'non-ai',
        };
        await cacheDietaryStatus(recipeId, result, 'recipe', []);
        return result;
      }

      // No ingredients and no meat/fish in name, default to vegetarian/vegan
      const result: DietaryDetectionResult = {
        isVegetarian: true,
        isVegan: true,
        confidence: 'high',
        reason: 'No ingredients specified',
        method: 'non-ai',
      };
      await cacheDietaryStatus(recipeId, result, 'recipe', []);
      return result;
    }

    logger.dev('[Dietary Aggregation] Recipe ingredients for detection:', {
      recipeId,
      recipeName: recipeData?.recipe_name,
      ingredientCount: ingredients.length,
      ingredientNames: ingredients.map(i => i.ingredient_name),
    });

    // Aggregate allergens from ingredients for validation
    const aggregatedAllergens = aggregateIngredientAllergens(ingredients);

    // Run detection
    const result = await detectDietarySuitability(
      recipeId,
      ingredients,
      recipeData?.recipe_name,
      recipeData?.description,
      useAI,
    );

    // Cache the result (pass aggregated allergens for validation)
    await cacheDietaryStatus(recipeId, result, 'recipe', aggregatedAllergens);

    return result;
  } catch (err) {
    logger.error('[Dietary Aggregation] Error aggregating recipe dietary status:', err);
    return null;
  }
}
