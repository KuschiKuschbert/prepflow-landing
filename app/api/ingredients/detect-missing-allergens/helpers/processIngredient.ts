/**
 * Helper for processing individual ingredients for allergen detection
 */

import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface ProcessResult {
  ingredient_id: string;
  ingredient_name: string;
  status: 'success' | 'failed' | 'skipped';
  allergens?: string[];
  error?: string;
}

interface IngredientInput {
  id: string;
  ingredient_name: string;
  brand?: string | null;
  allergens?: string[] | null;
  allergen_source?: { manual?: boolean; ai?: boolean } | null;
}

/**
 * Processes a single ingredient for allergen detection
 *
 * @param {IngredientInput} ingredient - Ingredient data
 * @param {boolean} force - Whether to force re-detection
 * @returns {Promise<ProcessResult>} Processing result
 */
export async function processIngredient(
  ingredient: IngredientInput,
  force: boolean,
): Promise<ProcessResult> {
  // Skip if manually set allergens (unless forcing)
  if (!force) {
    const hasManualAllergens =
      ingredient.allergen_source &&
      typeof ingredient.allergen_source === 'object' &&
      (ingredient.allergen_source as { manual?: boolean }).manual;

    if (hasManualAllergens) {
      return {
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name,
        status: 'skipped',
      };
    }
  }

  try {
    // Detect allergens
    const enriched = await enrichIngredientWithAllergensHybrid({
      ingredient_name: ingredient.ingredient_name,
      brand: ingredient.brand || undefined,
      allergens: (ingredient.allergens as string[]) || [],
      allergen_source:
        (ingredient.allergen_source as {
          manual?: boolean;
          ai?: boolean;
        }) || {},
    });

    // Update ingredient with detected allergens
    if (!supabaseAdmin) {
      throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
    }

    const { error: updateError } = await supabaseAdmin
      .from('ingredients')
      .update({
        allergens: enriched.allergens,
        allergen_source: enriched.allergen_source,
      })
      .eq('id', ingredient.id);

    if (updateError) {
      throw updateError;
    }

    return {
      ingredient_id: ingredient.id,
      ingredient_name: ingredient.ingredient_name,
      status: 'success',
      allergens: enriched.allergens,
    };
  } catch (err) {
    logger.error('[Detect Missing Allergens API] Error processing ingredient:', {
      ingredient_id: ingredient.id,
      ingredient_name: ingredient.ingredient_name,
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      ingredient_id: ingredient.id,
      ingredient_name: ingredient.ingredient_name,
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
