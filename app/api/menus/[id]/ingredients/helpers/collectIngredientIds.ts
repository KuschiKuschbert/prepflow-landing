/**
 * Collect ingredient IDs from dishes and recipes
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface IngredientIdRow {
  ingredient_id: string;
}

interface RecipeIdRow {
  recipe_id: string;
}

async function collectDishIngredients(
  dishIds: Set<string>,
  menuId: string,
  ingredientIds: Set<string>
): Promise<void> {
  if (dishIds.size === 0 || !supabaseAdmin) return;

  try {
    // Fetch dish ingredients
    const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select('ingredient_id')
      .in('dish_id', Array.from(dishIds));

    if (dishIngredientsError) {
      logger.warn('[Menu Ingredients API] Error fetching dish ingredients (continuing):', {
        error: dishIngredientsError.message,
        context: { menuId },
      });
    } else if (dishIngredients) {
      (dishIngredients as IngredientIdRow[]).forEach(di => {
        if (di.ingredient_id) ingredientIds.add(di.ingredient_id);
      });
    }

    // Fetch dish recipes and their ingredients
    const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select('recipe_id')
      .in('dish_id', Array.from(dishIds));

    if (dishRecipesError) {
      logger.warn('[Menu Ingredients API] Error fetching dish recipes (continuing):', {
        error: dishRecipesError.message,
        context: { menuId },
      });
    } else if (dishRecipes) {
      const dRecipeIds = (dishRecipes as RecipeIdRow[]).map(dr => dr.recipe_id).filter(id => id);

      if (dRecipeIds.length > 0) {
        const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
          .from('recipe_ingredients')
          .select('ingredient_id')
          .in('recipe_id', dRecipeIds);

        if (recipeIngredientsError) {
          logger.warn('[Menu Ingredients API] Error fetching recipe ingredients (continuing):', {
            error: recipeIngredientsError.message,
            context: { menuId },
          });
        } else if (recipeIngredients) {
          (recipeIngredients as IngredientIdRow[]).forEach(ri => {
            if (ri.ingredient_id) ingredientIds.add(ri.ingredient_id);
          });
        }
      }
    }
  } catch (err: unknown) {
    logger.error('[Menu Ingredients API] Error collecting dish ingredients:', {
      error: err instanceof Error ? err.message : String(err),
      context: { menuId },
    });
  }
}

async function collectRecipeIngredients(
  recipeIds: Set<string>,
  menuId: string,
  ingredientIds: Set<string>
): Promise<void> {
  if (recipeIds.size === 0 || !supabaseAdmin) return;

  try {
    const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('ingredient_id')
      .in('recipe_id', Array.from(recipeIds));

    if (recipeIngredientsError) {
      logger.warn('[Menu Ingredients API] Error fetching recipe ingredients (continuing):', {
        error: recipeIngredientsError.message,
        context: { menuId },
      });
    } else if (recipeIngredients) {
      (recipeIngredients as IngredientIdRow[]).forEach(ri => {
        if (ri.ingredient_id) ingredientIds.add(ri.ingredient_id);
      });
    }
  } catch (err: unknown) {
    logger.error('[Menu Ingredients API] Error collecting recipe ingredients:', {
      error: err instanceof Error ? err.message : String(err),
      context: { menuId },
    });
  }
}

export async function collectIngredientIds(
  dishIds: Set<string>,
  recipeIds: Set<string>,
  menuId: string,
): Promise<Set<string>> {
  if (!supabaseAdmin) {
    return new Set<string>();
  }

  const ingredientIds = new Set<string>();

  await Promise.all([
    collectDishIngredients(dishIds, menuId, ingredientIds),
    collectRecipeIngredients(recipeIds, menuId, ingredientIds)
  ]);

  return ingredientIds;
}
