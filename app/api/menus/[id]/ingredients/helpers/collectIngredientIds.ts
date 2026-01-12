/**
 * Collect ingredient IDs from dishes and recipes
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface IngredientIdResult {
  ingredient_id: string;
}

interface RecipeIdResult {
  recipe_id: string;
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

  // Fetch dish ingredients
  if (dishIds.size > 0) {
    try {
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
        (dishIngredients as unknown as IngredientIdResult[]).forEach((di) => {
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
        const dishRecipeIds = (dishRecipes as unknown as RecipeIdResult[])
          .map((dr) => dr.recipe_id)
          .filter((id) => id);

        if (dishRecipeIds.length > 0) {
          const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
            .from('recipe_ingredients')
            .select('ingredient_id')
            .in('recipe_id', dishRecipeIds);

          if (recipeIngredientsError) {
            logger.warn('[Menu Ingredients API] Error fetching recipe ingredients (continuing):', {
              error: recipeIngredientsError.message,
              context: { menuId },
            });
          } else if (recipeIngredients) {
            (recipeIngredients as unknown as IngredientIdResult[]).forEach((ri) => {
              if (ri.ingredient_id) ingredientIds.add(ri.ingredient_id);
            });
          }
        }
      }
    } catch (err) {
      logger.error('[Menu Ingredients API] Error collecting dish ingredients:', {
        error: err instanceof Error ? err.message : String(err),
        context: { menuId },
      });
    }
  }

  // Fetch recipe ingredients
  if (recipeIds.size > 0) {
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
        (recipeIngredients as unknown as IngredientIdResult[]).forEach((ri) => {
          if (ri.ingredient_id) ingredientIds.add(ri.ingredient_id);
        });
      }
    } catch (err) {
      logger.error('[Menu Ingredients API] Error collecting recipe ingredients:', {
        error: err instanceof Error ? err.message : String(err),
        context: { menuId },
      });
    }
  }

  return ingredientIds;
}
