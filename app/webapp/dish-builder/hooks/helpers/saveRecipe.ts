import { logger } from '@/lib/logger';
import type { Recipe } from '@/lib/types/cogs';
import type { DishBuilderState } from '../../types';
import { createRecipe } from './saveRecipe/createRecipe';
import { saveIngredients } from './saveRecipe/saveIngredients';

interface SaveRecipeProps {
  dishState: DishBuilderState;
  itemIngredients: Array<{ ingredient_id: string; quantity: number; unit: string }>;
}

/**
 * Save recipe via API
 *
 * @param {SaveRecipeProps} props - Recipe save props
 * @returns {Promise<{success: true, recipe: Recipe} | {success: false, error: string}>} Save result
 */
export async function saveRecipe({
  dishState,
  itemIngredients,
}: SaveRecipeProps): Promise<
  { success: true; recipe: Recipe } | { success: false; error: string }
> {
  try {
    logger.dev('[saveRecipe] Starting recipe creation:', {
      dishName: dishState.dishName,
      ingredientCount: itemIngredients.length,
    });

    // Step 1: Create recipe
    const createResult = await createRecipe(dishState);
    if (!createResult.success) {
      return createResult;
    }

    const recipeId = createResult.recipe.id;
    if (!recipeId) {
      return { success: false, error: 'Failed to get recipe ID after creation' };
    }

    // Step 2: Save ingredients
    const ingredientsResult = await saveIngredients(recipeId, itemIngredients);
    if (!ingredientsResult.success) {
      return { success: false, error: ingredientsResult.error || 'Failed to save ingredients' };
    }

    return { success: true, recipe: createResult.recipe };
  } catch (err) {
    logger.error('[saveRecipe] Unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save recipe',
    };
  }
}
