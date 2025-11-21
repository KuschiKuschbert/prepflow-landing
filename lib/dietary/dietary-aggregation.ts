/**
 * Dietary status aggregation utilities
 * Aggregates vegetarian/vegan status for recipes and dishes
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  detectDietarySuitability,
  detectVegetarianVeganFromIngredients,
  DietaryDetectionResult,
} from './vegetarian-vegan-detection';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

interface Ingredient {
  ingredient_name: string;
  category?: string;
  allergens?: string[];
}

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

/**
 * Aggregate dietary status for a single dish
 * Aggregates from dish recipes and ingredients
 *
 * @param {string} dishId - Dish ID
 * @param {boolean} useAI - Use AI detection (optional)
 * @param {boolean} force - Force recalculation even if cached (optional, default: false)
 * @returns {Promise<DietaryDetectionResult | null>} Dietary detection result
 */
export async function aggregateDishDietaryStatus(
  dishId: string,
  useAI?: boolean,
  force: boolean = false,
): Promise<DietaryDetectionResult | null> {
  if (!supabaseAdmin) {
    logger.error('[Dietary Aggregation] Supabase admin client not available');
    return null;
  }

  try {
    // Check cached status
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('is_vegetarian, is_vegan, dietary_confidence, dietary_method, dietary_checked_at')
      .eq('id', dishId)
      .single();

    if (dishError) {
      // Dishes table might not exist
      return null;
    }

    // Return cached status if available and recent and not forcing
    if (
      !force &&
      dish?.is_vegetarian !== null &&
      dish?.is_vegan !== null &&
      dish?.dietary_checked_at
    ) {
      const checkedAt = new Date(dish.dietary_checked_at);
      const daysSinceCheck = (Date.now() - checkedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCheck < 7) {
        return {
          isVegetarian: dish.is_vegetarian,
          isVegan: dish.is_vegan,
          confidence: (dish.dietary_confidence as 'high' | 'medium' | 'low') || 'medium',
          method: (dish.dietary_method as 'non-ai' | 'ai') || 'non-ai',
        };
      }
    }

    const allIngredients: Ingredient[] = [];

    // Fetch ingredients from dish recipes
    const { data: dishRecipes } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        recipes (
          recipe_name,
          recipe_ingredients (
            ingredient_id,
            ingredients (
              ingredient_name,
              category,
              allergens
            )
          )
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipes) {
      dishRecipes.forEach(dr => {
        const recipe = dr.recipes as {
          recipe_ingredients?: Array<{
            ingredients?: {
              ingredient_name?: string;
              category?: string;
              allergens?: string[];
            } | null;
          }>;
        } | null;
        if (recipe?.recipe_ingredients) {
          recipe.recipe_ingredients.forEach(ri => {
            const ing = ri.ingredients;
            if (ing) {
              const rawAllergens = ing.allergens || [];
              // Consolidate allergens to handle old codes and ensure consistency
              const consolidatedAllergens = consolidateAllergens(
                Array.isArray(rawAllergens) ? rawAllergens : [],
              );
              allIngredients.push({
                ingredient_name: ing.ingredient_name || '',
                category: ing.category,
                allergens: consolidatedAllergens,
              });
            }
          });
        }
      });
    }

    // Fetch ingredients from dish ingredients
    const { data: dishIngredients } = await supabaseAdmin
      .from('dish_ingredients')
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
      .eq('dish_id', dishId);

    if (dishIngredients) {
      dishIngredients.forEach(di => {
        const ing = di.ingredients as {
          ingredient_name?: string;
          category?: string;
          allergens?: string[];
        } | null;
        if (ing) {
          const rawAllergens = ing.allergens || [];
          // Consolidate allergens to handle old codes and ensure consistency
          const consolidatedAllergens = consolidateAllergens(
            Array.isArray(rawAllergens) ? rawAllergens : [],
          );
          allIngredients.push({
            ingredient_name: ing.ingredient_name || '',
            category: ing.category,
            allergens: consolidatedAllergens,
          });
        }
      });
    }

    // Fetch dish name (needed for detection and name-based check)
    const { data: dishData } = await supabaseAdmin
      .from('dishes')
      .select('dish_name, description')
      .eq('id', dishId)
      .single();

    if (allIngredients.length === 0) {
      // No ingredients - check dish name for non-vegetarian keywords
      const { isNonVegetarianIngredient } = await import(
        '@/lib/dietary/vegetarian-vegan-detection'
      );
      const dishName = dishData?.dish_name || '';

      // If dish name contains meat/fish keywords, mark as non-vegetarian
      if (dishName && isNonVegetarianIngredient(dishName)) {
        const result: DietaryDetectionResult = {
          isVegetarian: false,
          isVegan: false,
          confidence: 'high',
          reason: `Dish name "${dishName}" contains meat/fish keywords`,
          method: 'non-ai',
        };
        await cacheDietaryStatus(dishId, result, 'dish', []);
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
      await cacheDietaryStatus(dishId, result, 'dish', []);
      return result;
    }

    // Collect all allergens from ingredients for validation
    const allIngredientAllergens: string[] = [];
    allIngredients.forEach(ing => {
      if (ing.allergens && Array.isArray(ing.allergens)) {
        allIngredientAllergens.push(...ing.allergens);
      }
    });
    const aggregatedAllergens = consolidateAllergens(allIngredientAllergens);

    // Run detection
    const result = await detectDietarySuitability(
      dishId,
      allIngredients,
      dishData?.dish_name,
      dishData?.description,
      useAI,
    );

    // Cache the result (pass aggregated allergens for validation)
    await cacheDietaryStatus(dishId, result, 'dish', aggregatedAllergens);

    return result;
  } catch (err) {
    logger.error('[Dietary Aggregation] Error aggregating dish dietary status:', err);
    return null;
  }
}

/**
 * Invalidate dietary cache for a recipe or dish
 * Clears the dietary_checked_at timestamp to force recalculation
 */
export async function invalidateDietaryCache(id: string, type: 'recipe' | 'dish'): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const table = type === 'recipe' ? 'recipes' : 'dishes';
    const { error } = await supabaseAdmin
      .from(table)
      .update({ dietary_checked_at: null })
      .eq('id', id);

    if (error) {
      logger.error('[Dietary Aggregation] Failed to invalidate dietary cache:', {
        id,
        type,
        error: error.message,
      });
    } else {
      logger.dev('[Dietary Aggregation] Successfully invalidated dietary cache:', {
        id,
        type,
      });
    }
  } catch (err) {
    logger.error('[Dietary Aggregation] Failed to invalidate dietary cache:', err);
  }
}

/**
 * Validate dietary status against allergens
 * Returns corrected result if conflict detected (vegan=true but allergens include milk/eggs)
 */
function validateDietaryAgainstAllergens(
  result: DietaryDetectionResult,
  allergens: string[],
  id: string,
  type: 'recipe' | 'dish',
): DietaryDetectionResult {
  // Consolidate allergens to handle old codes
  const consolidatedAllergens = consolidateAllergens(allergens || []);

  // Check for conflict: vegan=true but allergens include milk or eggs
  if (result.isVegan === true) {
    const hasMilk = consolidatedAllergens.includes('milk');
    const hasEggs = consolidatedAllergens.includes('eggs');

    if (hasMilk || hasEggs) {
      logger.warn(
        '[Dietary Aggregation] Conflict detected: vegan=true but allergens include milk/eggs',
        {
          id,
          type,
          allergens: consolidatedAllergens,
          hasMilk,
          hasEggs,
          originalResult: result,
        },
      );

      // Correct the result
      return {
        ...result,
        isVegan: false,
        confidence: 'high', // We know for certain it's not vegan
        reason: result.reason
          ? `${result.reason}; Corrected: contains ${hasMilk ? 'milk' : ''}${hasMilk && hasEggs ? ' and ' : ''}${hasEggs ? 'eggs' : ''}`
          : `Contains ${hasMilk ? 'milk' : ''}${hasMilk && hasEggs ? ' and ' : ''}${hasEggs ? 'eggs' : ''}`,
      };
    }
  }

  return result;
}

/**
 * Cache dietary status in database
 * Validates against allergens before saving to prevent conflicts
 * @param aggregatedAllergens - Allergens aggregated from ingredients (optional, for validation)
 */
async function cacheDietaryStatus(
  id: string,
  result: DietaryDetectionResult,
  type: 'recipe' | 'dish',
  aggregatedAllergens?: string[],
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    // Fetch current cached allergens to validate against
    const table = type === 'recipe' ? 'recipes' : 'dishes';
    const { data: currentData } = await supabaseAdmin
      .from(table)
      .select('allergens')
      .eq('id', id)
      .single();

    const currentAllergens = (currentData?.allergens as string[]) || [];

    // Use aggregated allergens if provided (more accurate), otherwise use cached allergens
    const allergensToCheck =
      aggregatedAllergens && aggregatedAllergens.length > 0
        ? aggregatedAllergens
        : currentAllergens;

    // Validate dietary status against allergens
    const validatedResult = validateDietaryAgainstAllergens(result, allergensToCheck, id, type);

    const { error } = await supabaseAdmin
      .from(table)
      .update({
        is_vegetarian: validatedResult.isVegetarian,
        is_vegan: validatedResult.isVegan,
        dietary_confidence: validatedResult.confidence,
        dietary_method: validatedResult.method,
        dietary_checked_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      logger.error('[Dietary Aggregation] Failed to cache dietary status:', {
        id,
        type,
        error: error.message,
        result: validatedResult,
      });
    } else {
      logger.dev('[Dietary Aggregation] Successfully cached dietary status:', {
        id,
        type,
        isVegetarian: validatedResult.isVegetarian,
        isVegan: validatedResult.isVegan,
        wasCorrected: validatedResult.isVegan !== result.isVegan,
      });
    }
  } catch (err) {
    logger.error('[Dietary Aggregation] Failed to cache dietary status:', err);
  }
}
