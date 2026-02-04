import { SupabaseClient } from '@supabase/supabase-js';
import { BatchIngredientData, BatchRecipeIngredientRow } from './types';

export async function handleMissingNestedIngredients(
  supabase: SupabaseClient,
  rows: BatchRecipeIngredientRow[],
): Promise<BatchRecipeIngredientRow[]> {
  const missingNested = rows.some((r: BatchRecipeIngredientRow) => !r.ingredients);
  if (missingNested) {
    const uniqueIds = Array.from(
      new Set(
        rows
          .map((r: BatchRecipeIngredientRow) => r.ingredient_id)
          .filter((v: string | undefined) => Boolean(v)),
      ),
    );
    if (uniqueIds.length > 0) {
      const { data: ingRows, error: ingError } = await supabase
        .from('ingredients')
        .select(
          'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
        )
        .in('id', uniqueIds);
      if (!ingError && ingRows) {
        const byId: Record<string, BatchIngredientData> = {};
        (ingRows as BatchIngredientData[]).forEach((ir: BatchIngredientData) => {
          byId[ir.id] = ir;
        });
        return rows.map((r: BatchRecipeIngredientRow) => ({
          ...r,
          ingredients: r.ingredients || byId[r.ingredient_id],
        }));
      }
    }
  }
  return rows;
}
