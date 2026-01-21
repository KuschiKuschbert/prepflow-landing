import { logger } from '@/lib/logger';
import { EnrichedRecipeData, RawMenuItem } from '../../../types';
import { normalizeAllergens } from './normalizeAllergens';
import { validateVeganStatus } from './validateDietaryStatus';

/**
 * Enriches a recipe item with allergens and dietary information
 *
 * @param {RawMenuItem} item - Menu item with recipe data
 * @returns {Promise<EnrichedRecipeData>} Enriched recipe data
 */
export async function enrichRecipeItem(item: RawMenuItem): Promise<EnrichedRecipeData> {
  const recipeName = item.recipes?.name || item.recipes?.recipe_name || 'Unknown Recipe';
  let allergens: string[] = [];
  let isVegetarian: boolean | null = null;
  let isVegan: boolean | null = null;
  let dietaryConfidence: string | null = null;
  let dietaryMethod: string | null = null;

  // Check if cached allergens exist
  const hasCachedAllergens =
    item.recipes?.allergens !== undefined &&
    item.recipes?.allergens !== null &&
    Array.isArray(item.recipes?.allergens) &&
    item.recipes?.allergens.length > 0;

  if (hasCachedAllergens) {
    // Use cached allergens (faster) but normalize them
    allergens = normalizeAllergens(item.recipes!.allergens as string[], recipeName);
    logger.dev('[Menus API] Using cached recipe allergens:', {
      recipeName,
      allergens,
      recipeId: item.recipes!.id,
    });
  } else {
    // Only aggregate if no cached allergens exist
    try {
      const { aggregateRecipeAllergens } = await import('@/lib/allergens/allergen-aggregation');
      if (item.recipes?.id) {
        allergens = (await aggregateRecipeAllergens(item.recipes.id, false)) as string[];
        logger.dev('[Menus API] Aggregated recipe allergens:', {
          recipeName,
          aggregated: allergens,
          recipeId: item.recipes.id,
        });
      }
    } catch (err: unknown) {
      logger.warn('[Menus API] Error aggregating recipe allergens:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      allergens = [];
    }
  }

  // Always trigger dietary recalculation to ensure fresh data
  try {
    const { aggregateRecipeDietaryStatus } = await import('@/lib/dietary/dietary-aggregation');
    if (item.recipes?.id) {
      const dietaryResult = await aggregateRecipeDietaryStatus(item.recipes.id, false, true);
      if (dietaryResult) {
        // Runtime validation: check for conflict between vegan status and allergens
        const validatedIsVegan = validateVeganStatus(
          dietaryResult.isVegan,
          allergens,
          'recipe',
          item.recipes.id,
          recipeName,
        );

        logger.dev('[Menus API] Recipe dietary recalculation result:', {
          recipeId: item.recipes.id,
          recipeName,
          isVegetarian: dietaryResult.isVegetarian,
          isVegan: validatedIsVegan,
          wasCorrected: validatedIsVegan !== dietaryResult.isVegan,
          confidence: dietaryResult.confidence,
          method: dietaryResult.method,
        });

        isVegetarian = dietaryResult.isVegetarian;
        isVegan = validatedIsVegan;
        dietaryConfidence = dietaryResult.confidence;
        dietaryMethod = dietaryResult.method;
      } else {
        // Fallback to cached values if recalculation fails
        const cachedIsVegan = validateVeganStatus(
          item.recipes?.is_vegan ?? null,
          allergens,
          'recipe',
          item.recipes.id,
          recipeName,
        );

        isVegetarian = item.recipes?.is_vegetarian ?? null;
        isVegan = cachedIsVegan;
        dietaryConfidence = item.recipes?.dietary_confidence ?? null;
        dietaryMethod = item.recipes?.dietary_method ?? null;
      }
    }
  } catch (err: unknown) {
    logger.warn('[Menus API] Error recalculating recipe dietary status, using cached values:', {
      recipeId: item.recipes?.id,
      error: err instanceof Error ? err.message : String(err),
    });

    if (item.recipes?.id) {
      // Fallback to cached values, but validate against allergens
      const cachedIsVegan = validateVeganStatus(
        item.recipes.is_vegan ?? null,
        allergens,
        'recipe',
        item.recipes.id,
        recipeName,
      );

      isVegetarian = item.recipes.is_vegetarian ?? null;
      isVegan = cachedIsVegan;
      dietaryConfidence = item.recipes.dietary_confidence ?? null;
      dietaryMethod = item.recipes.dietary_method ?? null;
    }
  }

  return {
    allergens,
    isVegetarian,
    isVegan,
    dietaryConfidence,
    dietaryMethod,
  };
}
