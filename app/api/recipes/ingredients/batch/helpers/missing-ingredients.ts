import { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleMissingNestedIngredients(
  supabase: SupabaseClient,
  rows: any[],
): Promise<any[]> {
  const missingNested = rows.some((r: any) => !r.ingredients);
  if (missingNested) {
    const uniqueIds = Array.from(
      new Set(
        rows
          .map((r: any) => r.ingredient_id)
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
        const byId: Record<string, unknown> = {};
        ingRows.forEach((ir: any) => {
          byId[ir.id] = ir;
        });
        return rows.map((r: any) => ({
          ...r,
          ingredients: r.ingredients || (byId[r.ingredient_id] as any | undefined),
        }));
      }
    }
  }
  return rows;
}
