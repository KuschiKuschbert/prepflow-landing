import { MenuItemData } from './types';

// Types duplicated from original file to ensure self-containment or could be exported from a types file
// For now, defining locally to match expected shape
export interface IngredientResult {
  quantity: number;
  unit: string;
  ingredients: {
    ingredient_name: string;
  } | null;
}

export interface RecipeResult {
  id: string;
  name: string;
  recipe_name?: string;
  description: string | null;
  yield: number;
  yield_unit: string;
  instructions: string | null;
  recipe_ingredients: IngredientResult[];
}

export interface DishResult {
  id: string;
  dish_name: string;
  description: string | null;
  dish_ingredients: IngredientResult[];
  dish_recipes: {
    quantity: number;
    recipes: RecipeResult | null;
  }[];
}

export function mapDishToMenuItemData(dish: DishResult): MenuItemData {
  // Extract direct ingredients
  const directIngredients =
    dish.dish_ingredients?.map(di => ({
      name: di.ingredients?.ingredient_name || 'Unknown Ingredient',
      quantity: Number(di.quantity) || 0,
      unit: di.unit || '',
      source: 'direct',
    })) || [];

  // Extract sub-recipes with their ingredients
  const subRecipes: Array<{
    name: string;
    recipeId: string;
    quantity: number;
    yield: number;
    yieldUnit: string;
    ingredients: Array<{ name: string; quantity: number; unit: string; source: string }>;
    instructions?: string;
  }> = [];

  if (dish.dish_recipes) {
    for (const dr of dish.dish_recipes) {
      const recipe = dr.recipes;
      if (!recipe || !Array.isArray(recipe.recipe_ingredients)) continue;

      // Handle both recipe_name and name columns
      const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';

      const recipeIngredients = recipe.recipe_ingredients.map(ri => ({
        name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
        quantity: Number(ri.quantity) || 0,
        unit: ri.unit || '',
        source: `recipe:${recipeName}`,
      }));

      subRecipes.push({
        name: recipeName,
        recipeId: recipe.id,
        quantity: Number(dr.quantity) || 1,
        yield: Number(recipe.yield) || 1,
        yieldUnit: recipe.yield_unit || 'servings',
        ingredients: recipeIngredients,
        instructions: recipe.instructions || undefined,
      });
    }
  }

  return {
    id: dish.id,
    name: dish.dish_name,
    description: dish.description || undefined,
    type: 'dish',
    baseYield: 1,
    yieldUnit: 'serving',
    directIngredients,
    subRecipes,
    instructions: undefined,
  };
}
