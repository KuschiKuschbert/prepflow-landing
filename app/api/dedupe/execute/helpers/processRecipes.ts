import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface RecipeRow {
  id: string;
  recipe_name: string;
}

interface RecipeMerge {
  key: string;
  survivor: string;
  removed: string[];
}

/**
 * Process recipe deduplication
 *
 * @param {RecipeRow[]} recipes - All recipes
 * @param {Record<string, number>} usageByRecipe - Usage count by recipe ID
 * @param {boolean} dry - Dry run mode
 * @returns {Promise<RecipeMerge[]>} List of merges performed
 */
export async function processRecipeDeduplication(
  recipes: RecipeRow[],
  usageByRecipe: Record<string, number>,
  dry: boolean,
): Promise<RecipeMerge[]> {
  // Group recipes by normalized name
  const recGroups: Record<string, { ids: string[]; survivor?: string }> = {};
  recipes.forEach(row => {
    const key = String(row.recipe_name || '')
      .toLowerCase()
      .trim();
    if (!recGroups[key]) recGroups[key] = { ids: [] };
    recGroups[key].ids.push(row.id);
  });

  // Identify merges
  const recMerges: RecipeMerge[] = [];
  for (const [key, group] of Object.entries(recGroups)) {
    if (group.ids.length <= 1) continue;
    // Choose survivor by usage
    const enriched = group.ids.map(id => ({ id, usage: usageByRecipe[id] || 0 }));
    enriched.sort((a, b) => b.usage - a.usage);
    const survivor = enriched[0].id;
    const removed = group.ids.filter(id => id !== survivor);
    group.survivor = survivor;
    recMerges.push({ key, survivor, removed });
  }

  // Execute merges
  if (!dry) {
    for (const m of recMerges) {
      if (m.removed.length > 0) {
        // Repoint menu_items to survivor
        const { error: updateError } = await supabaseAdmin!
          .from('menu_items')
          .update({ recipe_id: m.survivor })
          .in('recipe_id', m.removed);
        if (updateError) {
          logger.error('[Dedupe Execute API] Error updating menu items:', {
            error: updateError.message,
            code: (updateError as unknown).code,
            merge: m,
            context: { endpoint: '/api/dedupe/execute', operation: 'updateMenuItems' },
          });
          // Continue with other merges even if one fails
        }

        // Delete removed recipes
        const { error: deleteError } = await supabaseAdmin!
          .from('recipes')
          .delete()
          .in('id', m.removed);
        if (deleteError) {
          logger.error('[Dedupe Execute API] Error deleting duplicate recipes:', {
            error: deleteError.message,
            code: (deleteError as unknown).code,
            merge: m,
            context: { endpoint: '/api/dedupe/execute', operation: 'deleteRecipes' },
          });
          // Continue with other merges even if one fails
        }
      }
    }
  }

  return recMerges;
}
