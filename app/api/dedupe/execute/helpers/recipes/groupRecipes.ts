import { RecipeRow } from './types';

export function groupRecipes(
  recipes: RecipeRow[],
): Record<string, { ids: string[]; survivor?: string }> {
  const recGroups: Record<string, { ids: string[]; survivor?: string }> = {};
  recipes.forEach(row => {
    const key = String(row.recipe_name || '')
      .toLowerCase()
      .trim();
    if (!recGroups[key]) recGroups[key] = { ids: [] };
    recGroups[key].ids.push(row.id);
  });
  return recGroups;
}
