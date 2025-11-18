import { DishBuilderState } from '../../types';
import { COGSCalculation } from '../../../cogs/types';

interface SaveRecipeProps {
  dishState: DishBuilderState;
  itemIngredients: Array<{ ingredient_id: string; quantity: number; unit: string }>;
}

/**
 * Save recipe via API.
 *
 * @param {SaveRecipeProps} props - Recipe save props
 * @returns {Promise<{success: boolean, recipe?: any}>} Save result
 */
export async function saveRecipe({ dishState, itemIngredients }: SaveRecipeProps) {
  const recipeResponse = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: dishState.dishName.trim(),
      yield: dishState.yield || 1,
      yield_unit: dishState.yield_unit || 'portion',
      category: 'Uncategorized',
      description: dishState.description?.trim() || null,
      instructions: dishState.instructions?.trim() || null,
    }),
  });

  const recipeResult = await recipeResponse.json();
  if (!recipeResponse.ok) {
    return { success: false, error: recipeResult.error || recipeResult.message || 'Failed to save recipe' };
  }

  const recipeId = recipeResult.recipe?.id || recipeResult.recipe?.[0]?.id;
  if (!recipeId) {
    return { success: false, error: 'Failed to get recipe ID after creation' };
  }

  const ingredientsResponse = await fetch(`/api/recipes/${recipeId}/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredients: itemIngredients.map(ing => ({
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      isUpdate: false,
    }),
  });

  if (!ingredientsResponse.ok) {
    const ingredientsResult = await ingredientsResponse.json();
    return { success: false, error: ingredientsResult.error || 'Failed to save recipe ingredients' };
  }

  return { success: true, recipe: recipeResult.recipe };
}
