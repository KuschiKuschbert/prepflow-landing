import { DishBuilderState } from '../../types';
import { COGSCalculation } from '../../../cogs/types';
import { logger } from '@/lib/logger';

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
  try {
    logger.dev('[saveRecipe] Starting recipe creation:', {
      dishName: dishState.dishName,
      ingredientCount: itemIngredients.length,
    });

    // Step 1: Create recipe with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let recipeResponse: Response;
    try {
      recipeResponse = await fetch('/api/recipes', {
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
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        logger.error('[saveRecipe] Recipe creation timed out after 30 seconds');
        return { success: false, error: 'Recipe creation timed out. Please try again.' };
      }
      throw fetchErr;
    }

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

    // Extract recipe ID - API returns { success: true, recipe: {...}, isNew: true/false }
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

    // Step 2: Save ingredients (only if there are ingredients)
    if (itemIngredients.length > 0) {
      logger.dev('[saveRecipe] Saving ingredients:', {
        recipeId,
        ingredientCount: itemIngredients.length,
      });

      const ingredientsController = new AbortController();
      const ingredientsTimeoutId = setTimeout(() => ingredientsController.abort(), 30000); // 30 second timeout

      let ingredientsResponse: Response;
      try {
        ingredientsResponse = await fetch(`/api/recipes/${recipeId}/ingredients`, {
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
          signal: ingredientsController.signal,
        });
        clearTimeout(ingredientsTimeoutId);
      } catch (fetchErr: any) {
        clearTimeout(ingredientsTimeoutId);
        if (fetchErr.name === 'AbortError') {
          logger.error('[saveRecipe] Ingredients save timed out after 30 seconds');
          return {
            success: false,
            error: 'Ingredients save timed out. Recipe was created but ingredients were not saved.',
          };
        }
        throw fetchErr;
      }

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
    } else {
      logger.dev('[saveRecipe] No ingredients to save, skipping ingredients step');
    }

    return { success: true, recipe: recipeResult.recipe };
  } catch (err) {
    logger.error('[saveRecipe] Unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save recipe',
    };
  }
}
