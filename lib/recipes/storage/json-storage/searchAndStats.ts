/**
 * Search and stats for JSONStorage. Extracted for filesize limit.
 */
import type { ScrapedRecipe } from '../../types';

export interface RecipeIndexEntry {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  file_path: string;
  scraped_at: string;
  updated_at?: string;
}

export interface RecipeIndex {
  recipes: RecipeIndexEntry[];
  lastUpdated: string;
  totalCount: number;
}

export async function searchByIngredientInIndex(
  index: RecipeIndex,
  loadRecipe: (filePath: string) => Promise<ScrapedRecipe | null>,
  ingredientName: string,
  limit: number = 10,
): Promise<ScrapedRecipe[]> {
  const results: ScrapedRecipe[] = [];
  const lowerIngredient = ingredientName.toLowerCase();
  for (const entry of index.recipes) {
    if (results.length >= limit) break;
    try {
      const recipe = await loadRecipe(entry.file_path);
      if (!recipe) continue;
      const hasIngredient = recipe.ingredients.some(ing => {
        const ingName =
          typeof ing === 'string'
            ? ing
            : ((ing as { name?: string; original_text?: string }).name ??
              (ing as { original_text?: string }).original_text ??
              '');
        return String(ingName).toLowerCase().includes(lowerIngredient);
      });
      if (hasIngredient) results.push(recipe);
    } catch {}
  }
  return results;
}

export function getStatisticsFromIndex(index: RecipeIndex): {
  totalRecipes: number;
  bySource: Record<string, number>;
  lastUpdated: string;
} {
  const counts: Record<string, number> = {};
  for (const entry of index.recipes) counts[entry.source] = (counts[entry.source] || 0) + 1;
  return { totalRecipes: index.totalCount, bySource: counts, lastUpdated: index.lastUpdated };
}
