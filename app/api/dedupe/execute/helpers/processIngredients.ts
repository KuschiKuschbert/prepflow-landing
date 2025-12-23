import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';

interface IngredientRow {
  id: string;
  ingredient_name: string;
  supplier?: string;
  brand?: string;
  pack_size?: string;
  unit?: string;
  cost_per_unit?: number;
}

interface UsageMap {
  [key: string]: number;
}

interface IngredientGroup {
  ids: string[];
  survivor?: string;
}

interface IngredientMerge {
  key: string;
  survivor: string;
  removed: string[];
}

/**
 * Process ingredient deduplication
 *
 * @param {IngredientRow[]} ingredients - All ingredients
 * @param {UsageMap} usageByIng - Usage count by ingredient ID
 * @param {boolean} dry - Dry run mode
 * @returns {Promise<IngredientMerge[]>} List of merges performed
 */
export async function processIngredientDeduplication(
  ingredients: IngredientRow[],
  usageByIng: UsageMap,
  dry: boolean,
): Promise<IngredientMerge[]> {
  // Group ingredients by composite key
  const ingGroups: Record<string, IngredientGroup> = {};
  ingredients.forEach(row => {
    const key = [
      String(row.ingredient_name || '').toLowerCase().trim(),
      row.supplier || '',
      row.brand || '',
      row.pack_size || '',
      row.unit || '',
      row.cost_per_unit ?? '',
    ].join('|');
    if (!ingGroups[key]) ingGroups[key] = { ids: [] };
    ingGroups[key].ids.push(row.id);
  });

  // Identify merges
  const ingMerges: IngredientMerge[] = [];
  for (const [key, group] of Object.entries(ingGroups)) {
    if (group.ids.length <= 1) continue;
    // Choose survivor by usage, then recency
    const enriched = group.ids.map(id => ({ id, usage: usageByIng[id] || 0 }));
    enriched.sort((a, b) => b.usage - a.usage);
    const survivor = enriched[0].id;
    const removed = group.ids.filter(id => id !== survivor);
    group.survivor = survivor;
    ingMerges.push({ key, survivor, removed });
  }

  // Execute merges
  if (!dry) {
    for (const m of ingMerges) {
      if (m.removed.length > 0) {
        // Repoint recipe_ingredients to survivor
        const { error: updateError } = await supabaseAdmin!
          .from('recipe_ingredients')
          .update({ ingredient_id: m.survivor })
          .in('ingredient_id', m.removed);
        if (updateError) {
          logger.error('[Dedupe Execute API] Error updating recipe ingredients:', {
            error: updateError.message,
            code: (updateError as any).code,
            merge: m,
            context: { endpoint: '/api/dedupe/execute', operation: 'updateRecipeIngredients' },
          });
          // Continue with other merges even if one fails
        }

        // Delete removed ingredients
        const { error: deleteError } = await supabaseAdmin!.from('ingredients').delete().in('id', m.removed);
        if (deleteError) {
          logger.error('[Dedupe Execute API] Error deleting duplicate ingredients:', {
            error: deleteError.message,
            code: (deleteError as any).code,
            merge: m,
            context: { endpoint: '/api/dedupe/execute', operation: 'deleteIngredients' },
          });
          // Continue with other merges even if one fails
        }
      }
    }
  }

  return ingMerges;
}

