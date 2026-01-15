import { logger } from '@/lib/logger';
import { IngredientData, RecipeSource } from '../../useIngredientData';
import { fetchRecipeIngredients } from './fetchRecipeIngredients';

interface DishApiResponse {
  success: boolean;
  dish?: {
    recipes?: Array<{
      recipe_id: string;
      quantity?: number;
      unit?: string;
      recipes?: {
        recipe_name: string;
      };
    }>;
    ingredients?: Array<{
      ingredient_id: string;
      quantity?: number;
      unit?: string;
      ingredients?: {
        id: string;
        ingredient_name: string;
        brand?: string;
        allergens?: string[];
        allergen_source?: { manual?: boolean; ai?: boolean };
      };
    }>;
  };
  error?: string;
}

export async function fetchDishIngredients(
  dishId: string,
): Promise<{ ingredients: IngredientData[]; recipeSources: RecipeSource[] }> {
  const dishResponse = await fetch(`/api/dishes/${dishId}`);
  const dishData: DishApiResponse = await dishResponse.json();

  if (!dishResponse.ok) {
    throw new Error(dishData.error || 'Failed to fetch dish');
  }

  if (!dishData.success || !dishData.dish) {
    return { ingredients: [], recipeSources: [] };
  }

  const dish = dishData.dish;
  const allIngredients: IngredientData[] = [];
  const recipes: RecipeSource[] = [];

  if (dish.recipes && Array.isArray(dish.recipes)) {
    dish.recipes.forEach(dr => {
      if (dr.recipe_id && dr.recipes) {
        recipes.push({
          source_type: 'recipe',
          source_id: dr.recipe_id,
          source_name: dr.recipes.recipe_name || 'Unknown Recipe',
          quantity: dr.quantity,
          unit: dr.unit,
        });
      }
    });
  }

  if (dish.ingredients && Array.isArray(dish.ingredients)) {
    dish.ingredients.forEach(di => {
      const ingredient = di.ingredients;
      if (ingredient) {
        const ingredientData: IngredientData = {
          id: ingredient.id || di.ingredient_id,
          ingredient_name: ingredient.ingredient_name || 'Unknown',
          brand: ingredient.brand || undefined,
          quantity: di.quantity,
          unit: di.unit,
          allergens: Array.isArray(ingredient.allergens) ? ingredient.allergens : [],
          allergen_source: ingredient.allergen_source || undefined,
        };

        if (!ingredient.ingredient_name) {
          logger.warn('[IngredientPopover] Dish ingredient missing ingredient_name', {
            dishId,
            ingredientId: ingredient.id || di.ingredient_id,
          });
        }

        allIngredients.push(ingredientData);
      } else {
        logger.warn('[IngredientPopover] Dish ingredient has null ingredient relation', {
          dishId,
          ingredientId: di.ingredient_id,
        });
      }
    });
  }

  for (const recipe of recipes) {
    await fetchRecipeIngredients(recipe.source_id, allIngredients);
  }

  return { ingredients: allIngredients, recipeSources: recipes };
}
