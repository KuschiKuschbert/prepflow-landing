import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function fetchIngredientsWithCategoryFallback(
  supabase: SupabaseClient,
  normalizedId: string,
) {
  let { data, error } = await supabase
    .from('recipe_ingredients')
    .select(
      `
        id,
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          unit,
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category,
          brand,
          allergens,
          allergen_source
        )
      `,
    )
    .eq('recipe_id', normalizedId);

  // If category column doesn't exist, retry without it
  if (error && error.code === '42703' && error.message.includes('category')) {
    logger.warn('[Recipes API] Category column not found, retrying without category', {
      context: { endpoint: '/api/recipes/[id]/ingredients', recipeId: normalizedId },
    });

    const { data: retryData, error: retryError } = await supabase
      .from('recipe_ingredients')
      .select(
        `
          id,
          recipe_id,
          ingredient_id,
          quantity,
          unit,
          ingredients (
            id,
            ingredient_name,
            unit,
            cost_per_unit,
            cost_per_unit_incl_trim,
            trim_peel_waste_percentage,
            yield_percentage,
            brand,
            allergens,
            allergen_source
          )
        `,
      )
      .eq('recipe_id', normalizedId);

    // Normalize the retry result to include category as null for type compatibility
    data =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (retryData?.map((item: any) => {
        const rawIngs = item.ingredients as unknown as
          | Record<string, unknown>
          | Record<string, unknown>[];
        const rawIng = Array.isArray(rawIngs) ? rawIngs[0] : rawIngs;
        return {
          ...item,
          ingredients: rawIng
            ? {
                ...rawIng,
                category: rawIng.category ?? null,
              }
            : null,
        };
      }) as unknown as typeof data) || null;
    error = retryError;
  }
  return { data, error };
}
