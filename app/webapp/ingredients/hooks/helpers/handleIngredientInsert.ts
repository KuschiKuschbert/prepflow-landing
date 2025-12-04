import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';

interface ApiError {
  message: string;
  isApiError: true;
}

type InsertError = PostgrestError | ApiError;

/**
 * Insert ingredient via Supabase with fallback to API route.
 *
 * @param {any} normalized - Normalized ingredient data
 * @param {any} originalIngredientData - Original ingredient data for API fallback
 * @returns {Promise<{data: any, error: InsertError | null}>} Insert result
 */
export async function handleIngredientInsert(
  normalized: any,
  originalIngredientData: any,
): Promise<{ data: any; error: InsertError | null }> {
  // Automatically detect allergens if not manually set (same logic as createIngredient)
  const isManuallySet =
    normalized.allergen_source &&
    typeof normalized.allergen_source === 'object' &&
    normalized.allergen_source.manual === true;

  if (!isManuallySet && normalized.ingredient_name) {
    try {
      const { enrichIngredientWithAllergensHybrid } =
        await import('@/lib/allergens/hybrid-allergen-detection');
      const enriched = await enrichIngredientWithAllergensHybrid({
        ingredient_name: normalized.ingredient_name,
        brand: normalized.brand || undefined,
        allergens: (normalized.allergens as string[]) || [],
        allergen_source:
          (normalized.allergen_source as {
            manual?: boolean;
            ai?: boolean;
          }) || {},
      });

      normalized.allergens = enriched.allergens;
      normalized.allergen_source = enriched.allergen_source;
    } catch (err) {
      // Don't fail insertion if allergen detection fails
      logger.warn('[handleIngredientInsert] Failed to auto-detect allergens:', {
        error: err instanceof Error ? err.message : String(err),
        ingredient_name: normalized.ingredient_name,
      });
    }
  }

  const { data, error } = await supabase.from('ingredients').insert([normalized]).select();

  if (error) {
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      logger.warn('RLS policy blocked direct insert, falling back to API route');
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalIngredientData),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        return {
          data: null,
          error: {
            message: result.details || result.error || 'Failed to add ingredient',
            isApiError: true as const,
          },
        };
      }

      return { data: result.data, error: null };
    }

    return { data: null, error };
  }

  return { data: data && data.length > 0 ? data[0] : null, error: null };
}
