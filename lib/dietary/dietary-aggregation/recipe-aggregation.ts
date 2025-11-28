/**
 * Recipe dietary status aggregation.
 * Aggregates vegetarian/vegan status for recipes.
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { detectDietarySuitability, DietaryDetectionResult } from '../vegetarian-vegan-detection';
import { cacheDietaryStatus } from './cache-management';
import type { Ingredient } from './types';

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
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('is_vegetarian, is_vegan, dietary_confidence, dietary_method, dietary_checked_at')
      .eq('id', recipeId)
      .single();

    if (recipeError) {
      logger.error('[Dietary Aggregation] Failed to fetch recipe:', {
        recipeId,
        error: recipeError.message,
      });
      return null;
    }

    // Return cached status if available and recent (within 7 days) and not forcing
    if (
      !force &&
      recipe?.is_vegetarian !== null &&
      recipe?.is_vegan !== null &&
      recipe?.dietary_checked_at
    ) {
      const checkedAt = new Date(recipe.dietary_checked_at);
      const daysSinceCheck = (Date.now() - checkedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCheck < 7) {
        return {
          isVegetarian: recipe.is_vegetarian,
          isVegan: recipe.is_vegan,
          confidence: (recipe.dietary_confidence as 'high' | 'medium' | 'low') || 'medium',
          method: (recipe.dietary_method as 'non-ai' | 'ai') || 'non-ai',
        };
      }
    }

    // Fetch recipe with ingredients
    const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        ingredient_id,
        ingredients (
          ingredient_name,
          category,
          allergens
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      logger.error('[Dietary Aggregation] Failed to fetch recipe ingredients:', {
        recipeId,
        error: ingredientsError.message,
      });
      return null;
    }

    // Fetch recipe name (needed for detection and name-based check)
    const { data: recipeData } = await supabaseAdmin
      .from('recipes')
      .select('recipe_name, description')
      .eq('id', recipeId)
      .single();

    if (!recipeIngredients || recipeIngredients.length === 0) {
      // No ingredients - check recipe name for non-vegetarian keywords
      const { isNonVegetarianIngredient } = await import(
        '@/lib/dietary/vegetarian-vegan-detection'
      );
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

    // Convert to ingredient format and consolidate allergens
    const ingredients: Ingredient[] = recipeIngredients.map(ri => {
      const ing = ri.ingredients as {
        ingredient_name?: string;
        category?: string;
        allergens?: string[];
      } | null;
      const rawAllergens = ing?.allergens || [];
      // Consolidate allergens to handle old codes and ensure consistency
      const consolidatedAllergens = consolidateAllergens(
        Array.isArray(rawAllergens) ? rawAllergens : [],
      );
      return {
        ingredient_name: ing?.ingredient_name || '',
        category: ing?.category,
        allergens: consolidatedAllergens,
      };
    });

    logger.dev('[Dietary Aggregation] Recipe ingredients for detection:', {
      recipeId,
      recipeName: recipeData?.recipe_name,
      ingredientCount: ingredients.length,
      ingredientNames: ingredients.map(i => i.ingredient_name),
    });

    // Collect all allergens from ingredients for validation
    const allIngredientAllergens: string[] = [];
    ingredients.forEach(ing => {
      if (ing.allergens && Array.isArray(ing.allergens)) {
        allIngredientAllergens.push(...ing.allergens);
      }
    });
    const aggregatedAllergens = consolidateAllergens(allIngredientAllergens);

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
