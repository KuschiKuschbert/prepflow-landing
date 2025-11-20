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

interface Ingredient {
  ingredient_name: string;
  category?: string;
  allergens?: string[];
}

/**
 * Aggregate dietary status for a single recipe
 * Checks cache first, then runs detection if needed
 */
export async function aggregateRecipeDietaryStatus(
  recipeId: string,
  useAI?: boolean,
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

    // Return cached status if available and recent (within 7 days)
    if (recipe?.is_vegetarian !== null && recipe?.is_vegan !== null && recipe?.dietary_checked_at) {
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

    if (!recipeIngredients || recipeIngredients.length === 0) {
      // No ingredients, default to vegetarian/vegan
      const result: DietaryDetectionResult = {
        isVegetarian: true,
        isVegan: true,
        confidence: 'high',
        reason: 'No ingredients specified',
        method: 'non-ai',
      };
      await cacheDietaryStatus(recipeId, result, 'recipe');
      return result;
    }

    // Convert to ingredient format
    const ingredients: Ingredient[] = recipeIngredients.map(ri => {
      const ing = ri.ingredients as {
        ingredient_name?: string;
        category?: string;
        allergens?: string[];
      } | null;
      return {
        ingredient_name: ing?.ingredient_name || '',
        category: ing?.category,
        allergens: ing?.allergens || [],
      };
    });

    // Fetch recipe name
    const { data: recipeData } = await supabaseAdmin
      .from('recipes')
      .select('recipe_name, description')
      .eq('id', recipeId)
      .single();

    // Run detection
    const result = await detectDietarySuitability(
      recipeId,
      ingredients,
      recipeData?.recipe_name,
      recipeData?.description,
      useAI,
    );

    // Cache the result
    await cacheDietaryStatus(recipeId, result, 'recipe');

    return result;
  } catch (err) {
    logger.error('[Dietary Aggregation] Error aggregating recipe dietary status:', err);
    return null;
  }
}

/**
 * Aggregate dietary status for a single dish
 * Aggregates from dish recipes and ingredients
 */
export async function aggregateDishDietaryStatus(
  dishId: string,
  useAI?: boolean,
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

    // Return cached status if available and recent
    if (dish?.is_vegetarian !== null && dish?.is_vegan !== null && dish?.dietary_checked_at) {
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
              allIngredients.push({
                ingredient_name: ing.ingredient_name || '',
                category: ing.category,
                allergens: ing.allergens || [],
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
          allIngredients.push({
            ingredient_name: ing.ingredient_name || '',
            category: ing.category,
            allergens: ing.allergens || [],
          });
        }
      });
    }

    if (allIngredients.length === 0) {
      // No ingredients, default to vegetarian/vegan
      const result: DietaryDetectionResult = {
        isVegetarian: true,
        isVegan: true,
        confidence: 'high',
        reason: 'No ingredients specified',
        method: 'non-ai',
      };
      await cacheDietaryStatus(dishId, result, 'dish');
      return result;
    }

    // Fetch dish name
    const { data: dishData } = await supabaseAdmin
      .from('dishes')
      .select('dish_name, description')
      .eq('id', dishId)
      .single();

    // Run detection
    const result = await detectDietarySuitability(
      dishId,
      allIngredients,
      dishData?.dish_name,
      dishData?.description,
      useAI,
    );

    // Cache the result
    await cacheDietaryStatus(dishId, result, 'dish');

    return result;
  } catch (err) {
    logger.error('[Dietary Aggregation] Error aggregating dish dietary status:', err);
    return null;
  }
}

/**
 * Cache dietary status in database
 */
async function cacheDietaryStatus(
  id: string,
  result: DietaryDetectionResult,
  type: 'recipe' | 'dish',
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const table = type === 'recipe' ? 'recipes' : 'dishes';
    await supabaseAdmin
      .from(table)
      .update({
        is_vegetarian: result.isVegetarian,
        is_vegan: result.isVegan,
        dietary_confidence: result.confidence,
        dietary_method: result.method,
        dietary_checked_at: new Date().toISOString(),
      })
      .eq('id', id);
  } catch (err) {
    logger.error('[Dietary Aggregation] Failed to cache dietary status:', err);
  }
}
