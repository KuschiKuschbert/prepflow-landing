/**
 * Build usage map from recipe_ingredients rows
 *
 * @param {Array<{ingredient_id?: string; recipe_id?: string}>} rows - Recipe ingredient rows
 * @param {string} idField - Field name ('ingredient_id' or 'recipe_id')
 * @returns {Record<string, number>} Usage count by ID
 */
export function buildUsageMap(
  rows: Array<{ ingredient_id?: string; recipe_id?: string }>,
  idField: 'ingredient_id' | 'recipe_id',
): Record<string, number> {
  const usageMap: Record<string, number> = {};
  rows.forEach(r => {
    const row = r as Record<string, unknown>;
    const id = row[idField];
    if (typeof id !== 'string') return;
    usageMap[id] = (usageMap[id] || 0) + 1;
  });
  return usageMap;
}
