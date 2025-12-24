import { supabaseAdmin } from '@/lib/supabase';
import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { logger } from '@/lib/logger';

/**
 * Process a batch of ingredients for allergen detection
 */
export async function processIngredientBatch(
  batch: Array<{
    id: string;
    ingredient_name: string;
    brand?: string | null;
    allergens?: any;
    allergen_source?: any;
  }>,
  forceAI: boolean,
) {
  const results: Array<{
    ingredient_id: string;
    ingredient_name: string;
    status: 'success' | 'failed' | 'skipped';
    allergens?: string[];
    method?: string;
    error?: string;
  }> = [];

  let successful = 0;
  let failed = 0;

  for (const ingredient of batch) {
    try {
      const enriched = await enrichIngredientWithAllergensHybrid({
        ingredient_name: ingredient.ingredient_name,
        brand: ingredient.brand || undefined,
        allergens: (ingredient.allergens as string[]) || [],
        allergen_source: (ingredient.allergen_source as { manual?: boolean; ai?: boolean }) || {},
        forceAI,
      });

      const { error: updateError } = await supabaseAdmin!
        .from('ingredients')
        .update({
          allergens: enriched.allergens,
          allergen_source: enriched.allergen_source,
        })
        .eq('id', ingredient.id);

      if (updateError) {
        throw updateError;
      }

      results.push({
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name,
        status: 'success',
        allergens: enriched.allergens,
        method: enriched.method || (enriched.allergen_source?.ai ? 'ai' : 'lookup'),
      });
      successful++;
    } catch (error: any) {
      logger.warn('[Populate All Allergens] Failed to process ingredient:', {
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name,
        error: error.message || String(error),
      });
      results.push({
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name,
        status: 'failed',
        error: error.message || String(error),
      });
      failed++;
    }
  }

  return { results, successful, failed };
}
