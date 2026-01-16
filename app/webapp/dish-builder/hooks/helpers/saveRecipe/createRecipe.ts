/**
 * Create recipe via API
 */

import { logger } from '@/lib/logger';
import type { DishBuilderState, Recipe } from '../../../types';

const TIMEOUT_MS = 30000; // 30 seconds

/**
 * Create recipe via API
 *
 * @param {DishBuilderState} dishState - Dish builder state
 * @returns {Promise<{success: true, recipe: Recipe} | {success: false, error: string}>} Create result
 */
export async function createRecipe(
  dishState: DishBuilderState,
): Promise<{ success: true; recipe: Recipe } | { success: false; error: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
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
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const recipeResult = await recipeResponse.json();
    if (!recipeResponse.ok) {
      logger.error('[saveRecipe] Recipe creation failed:', {
        status: recipeResponse.status,
        error: recipeResult.error || recipeResult.message,
      });
      return {
        success: false,
        error: recipeResult.error || recipeResult.message || 'Failed to save recipe',
      };
    }

    const recipeId = recipeResult.recipe?.id;
    if (!recipeId) {
      logger.error('[saveRecipe] Failed to get recipe ID from response:', {
        recipeResult,
        hasRecipe: !!recipeResult.recipe,
        recipeKeys: recipeResult.recipe ? Object.keys(recipeResult.recipe) : [],
      });
      return { success: false, error: 'Failed to get recipe ID after creation' };
    }

    logger.dev('[saveRecipe] Recipe created successfully:', { recipeId });
    return { success: true, recipe: recipeResult.recipe };
  } catch (fetchErr: unknown) {
    clearTimeout(timeoutId);
    if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
      logger.error('[saveRecipe] Recipe creation timed out after 30 seconds');
      return { success: false, error: 'Recipe creation timed out. Please try again.' };
    }
    throw fetchErr;
  }
}
