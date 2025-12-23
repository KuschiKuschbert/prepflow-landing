import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { supabaseAdmin } from '@/lib/supabase';
import type { Ingredient } from '../../types';

/**
 * Fetch and combine ingredients from dish recipes and dish ingredients
 */
export async function fetchDishIngredients(dishId: string): Promise<Ingredient[]> {
  const allIngredients: Ingredient[] = [];

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
