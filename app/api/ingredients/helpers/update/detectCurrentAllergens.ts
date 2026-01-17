import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { UpdateIngredientData } from '../schemas';

export async function detectCurrentAllergens(
  id: string,
  updates: UpdateIngredientData,
  formattedUpdates: any,
) {
  const allergensChanged = updates.allergens !== undefined;
  const nameOrBrandChanged = updates.ingredient_name !== undefined || updates.brand !== undefined;

  let currentIngredient: {
    ingredient_name: string;
    brand: string | null;
    allergens: string[];
    allergen_source: { manual?: boolean; ai?: boolean; method?: string } | null;
  } | null = null;

  if (nameOrBrandChanged && !allergensChanged) {
    if (!supabaseAdmin) {
       logger.error('[Ingredients API] Supabase admin not available for allergen check');
       return allergensChanged;
    }
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('ingredients')
      .select('ingredient_name, brand, allergens, allergen_source')
      .eq('id', id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      logger.warn('[Ingredients API] Error fetching current ingredient for allergen check:', {
        error: fetchError.message,
        code: fetchError.code,
        ingredientId: id,
      });
      // Continue without current ingredient - allergen detection will be skipped
    }

    if (!fetchError && current) {
      currentIngredient = current;
    }
  }

  // Auto-detect allergens if name/brand changed and allergens aren't manually set
  if (nameOrBrandChanged && !allergensChanged && currentIngredient) {
    const hasManualAllergens =
      currentIngredient.allergen_source &&
      typeof currentIngredient.allergen_source === 'object' &&
      (currentIngredient.allergen_source as { manual?: boolean }).manual;

    if (!hasManualAllergens) {
      const ingredientName = formattedUpdates.ingredient_name || currentIngredient.ingredient_name;
      const ingredientBrand =
        formattedUpdates.brand !== undefined ? formattedUpdates.brand : currentIngredient.brand;

      if (ingredientName) {
        try {
          const enriched = await enrichIngredientWithAllergensHybrid({
            ingredient_name: ingredientName,
            brand: ingredientBrand || undefined,
            allergens: (currentIngredient.allergens as string[]) || [],
            allergen_source:
              (currentIngredient.allergen_source as {
                manual?: boolean;
                ai?: boolean;
              }) || {},
          });

          formattedUpdates.allergens = enriched.allergens;
          formattedUpdates.allergen_source = enriched.allergen_source;

          if (enriched.allergens.length > 0) {
            logger.dev('[Ingredients API] Auto-detected allergens on update:', {
              ingredient_id: id,
              ingredient_name: ingredientName,
              allergens: enriched.allergens,
              method: enriched.method,
            });
          }
          return true; // allergensChanged = true
        } catch (err) {
          logger.warn('[Ingredients API] Failed to auto-detect allergens on update:', {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          });
        }
      }
    }
  }
  return allergensChanged;
}
