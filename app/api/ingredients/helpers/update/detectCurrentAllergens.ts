import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { UpdateIngredientData } from '../schemas';

interface IngredientAllergenShape {
  ingredient_name?: string;
  brand?: string | null;
  allergens?: string[];
  allergen_source?: { manual?: boolean; ai?: boolean };
}

async function performHybridDetection(
  id: string,
  ingredientName: string,
  ingredientBrand: string | null,
  currentIngredient: IngredientAllergenShape,
  formattedUpdates: Record<string, unknown>,
) {
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
    return true;
  } catch (err) {
    logger.warn('[Ingredients API] Failed to auto-detect allergens on update:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return false;
  }
}

export async function detectCurrentAllergens(
  id: string,
  updates: UpdateIngredientData,
  formattedUpdates: Record<string, unknown>,
) {
  const allergensChanged = updates.allergens !== undefined;
  const nameOrBrandChanged = updates.ingredient_name !== undefined || updates.brand !== undefined;

  if (allergensChanged || !nameOrBrandChanged) {
    return allergensChanged;
  }

  if (!supabaseAdmin) {
    logger.error('[Ingredients API] Supabase admin not available for allergen check');
    return allergensChanged;
  }

  // 1. Fetch current data
  const { data: currentIngredient, error: fetchError } = await supabaseAdmin
    .from('ingredients')
    .select('ingredient_name, brand, allergens, allergen_source')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !currentIngredient) {
    if (fetchError && fetchError.code !== 'PGRST116') {
      logger.warn('[Ingredients API] Error fetching current ingredient for allergen check:', {
        error: fetchError.message,
        code: fetchError.code,
        ingredientId: id,
      });
    }
    return allergensChanged;
  }

  // 2. Check for manual allergens
  const hasManualAllergens =
    currentIngredient.allergen_source &&
    typeof currentIngredient.allergen_source === 'object' &&
    (currentIngredient.allergen_source as { manual?: boolean }).manual;

  if (hasManualAllergens) {
    return allergensChanged;
  }

  // 3. Perform detection
  const ingredientName = formattedUpdates.ingredient_name || currentIngredient.ingredient_name;
  const ingredientBrand =
    formattedUpdates.brand !== undefined ? formattedUpdates.brand : currentIngredient.brand;

  if (!ingredientName) {
    return allergensChanged;
  }

  const detected = await performHybridDetection(
    id,
    ingredientName,
    ingredientBrand,
    currentIngredient,
    formattedUpdates,
  );
  return detected || allergensChanged;
}
