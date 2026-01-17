import { executeIngredientMerge } from './ingredients/executeMerge';
import { groupIngredients } from './ingredients/groupIngredients';
import { identifyIngredientMerges } from './ingredients/identifyMerges';
import { IngredientMerge, IngredientRow, UsageMap } from './ingredients/types';

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
  // 1. Group ingredients by composite key
  const ingGroups = groupIngredients(ingredients);

  // 2. Identify merges
  const ingMerges = identifyIngredientMerges(ingGroups, usageByIng);

  // 3. Execute merges
  if (!dry) {
    for (const m of ingMerges) {
      await executeIngredientMerge(m);
    }
  }

  return ingMerges;
}
