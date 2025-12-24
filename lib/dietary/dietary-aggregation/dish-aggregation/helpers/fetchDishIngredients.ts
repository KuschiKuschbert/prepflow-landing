import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Ingredient } from '../../types';

/**
 * Fetch and combine ingredients from dish recipes and dish ingredients
 */
export async function fetchDishIngredients(dishId: string): Promise<Ingredient[]> {
  if (!supabaseAdmin) {
    return [];
  }

  const allIngredients: Ingredient[] = [];

  const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
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

  if (dishRecipesError) {
    logger.error('[Dietary Aggregation] Error fetching dish recipes:', {
      error: dishRecipesError.message,
      dishId,
      context: { operation: 'fetchDishIngredients' },
    });
  }

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

  const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
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

  if (dishIngredientsError) {
    logger.error('[Dietary Aggregation] Error fetching dish ingredients:', {
      error: dishIngredientsError.message,
      dishId,
      context: { operation: 'fetchDishIngredients' },
    });
  }

  if (dishIngredients) {
    dishIngredients.forEach(di => {
      const ing = di.ingredients as {
        ingredient_name?: string;
        category?: string;
        allergens?: string[];
      } | null;
      if (ing) {
        const rawAllergens = ing.allergens || [];
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

  return allIngredients;
}
