/**
 * Save recipe ingredients via API
 */

import { logger } from '@/lib/logger';

const TIMEOUT_MS = 30000; // 30 seconds

interface Ingredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

/**
 * Save recipe ingredients via API
 *
 * @param {string} recipeId - Recipe ID
 * @param {Ingredient[]} itemIngredients - Ingredients to save
 * @returns {Promise<{success: true} | {success: false, error: string}>} Save result
 */
export async function saveIngredients(
  recipeId: string,
  itemIngredients: Ingredient[],
): Promise<{ success: true } | { success: false; error: string }> {
  if (itemIngredients.length === 0) {
    logger.dev('[saveRecipe] No ingredients to save, skipping ingredients step');
    return { success: true as const };
  }

  logger.dev('[saveRecipe] Saving ingredients:', {
    recipeId,
    ingredientCount: itemIngredients.length,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
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
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!ingredientsResponse.ok) {
      const ingredientsResult = await ingredientsResponse.json();
      logger.error('[saveRecipe] Ingredients save failed:', {
        status: ingredientsResponse.status,
        error: ingredientsResult.error,
        recipeId,
      });
      return {
        success: false,
        error: ingredientsResult.error || 'Failed to save recipe ingredients',
      };
    }

    logger.dev('[saveRecipe] Ingredients saved successfully');
    return { success: true as const };
  } catch (fetchErr: unknown) {
    clearTimeout(timeoutId);
    if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
      logger.error('[saveRecipe] Ingredients save timed out after 30 seconds');
      return {
        success: false,
        error: 'Ingredients save timed out. Recipe was created but ingredients were not saved.',
      };
    }
    throw fetchErr;
  }
}
