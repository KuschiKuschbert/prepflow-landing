/**
 * Filter helpers for recipe scraper API
 */

import { isRecipeFormatted } from '@/lib/utils/recipe-format-detection';

interface RecipeEntry {
  id?: string;
  recipe_name?: string;
  updated_at?: string;
  scraped_at?: string;
  source?: string;
  source_url?: string;
  file_path?: string;
}

/**
 * Filter recipes by format status at index level (FAST - no file loading)
 */
export function filterByFormatAtIndex(entries: RecipeEntry[], formatFilter: string): RecipeEntry[] {
  if (formatFilter === 'all') {
    return entries;
  }

  return entries.filter(entry => {
    if (!entry.updated_at || !entry.scraped_at || entry.updated_at === entry.scraped_at) {
      return formatFilter === 'unformatted';
    }

    try {
      const isFormatted = new Date(entry.updated_at) > new Date(entry.scraped_at);
      return formatFilter === 'formatted' ? isFormatted : !isFormatted;
    } catch {
      const isFormatted = entry.updated_at > entry.scraped_at;
      return formatFilter === 'formatted' ? isFormatted : !isFormatted;
    }
  });
}

/**
 * Filter recipes by format status after loading (SLOW - requires file loading)
 */
export function filterByFormatAfterLoad(recipes: any[], formatFilter: string): unknown[] {
  if (formatFilter === 'all') {
    return recipes;
  }

  return recipes.filter(recipe => {
    const formatted = isRecipeFormatted(recipe);
    return formatFilter === 'formatted' ? formatted : !formatted;
  });
}

/**
 * Filter recipes by source
 */
export function filterBySource(entries: RecipeEntry[], sourceFilter?: string): RecipeEntry[] {
  if (!sourceFilter) {
    return entries;
  }
  return entries.filter(entry => entry.source === sourceFilter);
}
