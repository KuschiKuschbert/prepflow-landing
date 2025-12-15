/**
 * Save recipe ingredients.
 */
import type { COGSCalculation, RecipeDishItem } from '../../types';
import type { Recipe } from '../../../types';

export async function saveRecipeIngredients(
  selectedItem: RecipeDishItem,
  calculations: COGSCalculation[],
  allRecipes: Recipe[],
): Promise<{ ingredients: Array<{ ingredient_id: string; quantity: number; unit: string }> }> {
  const recipe = allRecipes.find(r => r.id === selectedItem.id);
  const recipeYield = recipe?.yield || 1;
  const recipeIngredients = calculations.map(calc => ({
    ingredient_id: calc.ingredientId,
    quantity: calc.quantity * recipeYield,
    unit: calc.unit,
  }));
  const response = await fetch(`/api/recipes/${selectedItem.id}/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: recipeIngredients, isUpdate: true }),
  });
  if (!response.ok) throw response;
  return { ingredients: recipeIngredients };
}
