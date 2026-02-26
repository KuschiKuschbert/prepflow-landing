/**
 * Helpers for useDishFormData. Extracted to stay under 120-line hook limit.
 */
import type { DishWithDetails, Ingredient, Recipe } from '@/lib/types/recipes';
import type {
  APIResponse,
  SelectedRecipe,
  SelectedIngredient,
} from '../../components/DishEditDrawerTypes';

export async function fetchResourcesForDishForm(): Promise<{
  recipes: Recipe[];
  ingredients: Ingredient[];
}> {
  const [recipesRes, ingredientsRes] = await Promise.all([
    fetch('/api/recipes/catalog'),
    fetch('/api/ingredients/catalog'),
  ]);
  const recipesData = await recipesRes.json();
  const ingredientsData = await ingredientsRes.json();
  return {
    recipes: recipesData.success ? (recipesData.recipes as Recipe[]) || [] : [],
    ingredients: ingredientsData.success ? (ingredientsData.ingredients as Ingredient[]) || [] : [],
  };
}

export async function fetchDishWithDetails(
  dishId: string,
): Promise<{ success: boolean; dish?: DishWithDetails }> {
  const r = await fetch(`/api/dishes/${dishId}`);
  if (!r.ok) throw new Error(`Failed to fetch dish: ${r.status} ${r.statusText}`);
  return r.json();
}

interface DishRecipeRow {
  recipe_id: string;
  quantity: number;
  recipes?: { recipe_name: string };
}

interface DishIngredientRow {
  ingredient_id: string;
  quantity: number;
  unit?: string;
  ingredients?: { ingredient_name: string };
}

export function mapDishRecipesToSelected(recipes: DishRecipeRow[]): SelectedRecipe[] {
  return recipes.map(r => ({
    recipe_id: r.recipe_id,
    quantity: r.quantity || 1,
    recipe_name: r.recipes?.recipe_name,
  }));
}

export function mapDishIngredientsToSelected(
  ingredients: DishIngredientRow[],
): SelectedIngredient[] {
  return ingredients.map(i => ({
    ingredient_id: i.ingredient_id,
    quantity: i.quantity || 0,
    unit: i.unit || 'kg',
    ingredient_name: i.ingredients?.ingredient_name,
  }));
}

export function extractDishFormFromResponse(data: {
  success: boolean;
  dish?: DishWithDetails;
}): { recipes: SelectedRecipe[]; ingredients: SelectedIngredient[] } | null {
  if (!data.success || !data.dish) return null;
  const recipes = mapDishRecipesToSelected(data.dish.recipes || []);
  const ingredients = mapDishIngredientsToSelected(data.dish.ingredients || []);
  return { recipes, ingredients };
}
