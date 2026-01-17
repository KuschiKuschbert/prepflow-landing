import { executeRecipeMerge } from './recipes/executeMerge';
import { groupRecipes } from './recipes/groupRecipes';
import { identifyRecipeMerges } from './recipes/identifyMerges';
import { RecipeMerge, RecipeRow } from './recipes/types';

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
  // 1. Group recipes by normalized name
  const recGroups = groupRecipes(recipes);

  // 2. Identify merges
  const recMerges = identifyRecipeMerges(recGroups, usageByRecipe);

  // 3. Execute merges
  if (!dry) {
    for (const m of recMerges) {
      await executeRecipeMerge(m);
    }
  }

  return recMerges;
}
