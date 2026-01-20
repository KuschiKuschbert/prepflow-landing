import { searchRecipesByIngredients } from '@/lib/ai/recipe-database';
import { logger } from '@/lib/logger';
import {
    filterByFormatAfterLoad,
    filterByFormatAtIndex,
    filterBySource,
} from '../helpers/filter-helpers';
import { StorageInterface } from '../helpers/storage-helpers';

export async function processSearchRequest(
  search: string,
  sourceFilter: string | undefined,
  formatFilter: string,
  offset: number,
  pageSize: number
) {
  const ingredients = search
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);
  const allMatchingRecipes = await searchRecipesByIngredients(
    ingredients,
    10000,
    sourceFilter,
  );

  const filteredRecipes = filterByFormatAfterLoad(allMatchingRecipes, formatFilter);
  const totalRecipes = filteredRecipes.length;
  const recipes = filteredRecipes.slice(offset, offset + pageSize);

  return { recipes, totalRecipes };
}

export async function processListRequest(
  storage: StorageInterface,
  sourceFilter: string | undefined,
  formatFilter: string,
  offset: number,
  pageSize: number
) {
  let recipes: unknown[] = [];
  let totalRecipes = 0;

  try {
    const allRecipes = storage.getAllRecipes();
    let filteredRecipes = filterByFormatAtIndex(allRecipes, formatFilter);
    filteredRecipes = filterBySource(filteredRecipes, sourceFilter);
    totalRecipes = filteredRecipes.length;

    if (filteredRecipes.length > 0) {
      const paginatedEntries = filteredRecipes.slice(offset, offset + pageSize);
      const recipePromises = paginatedEntries.map(entry =>
        storage.loadRecipe(entry.file_path!),
      );
      const loadedRecipes = await Promise.all(recipePromises);
      recipes = loadedRecipes.filter((recipe: unknown) => recipe !== null);
    }
  } catch (loadErr) {
    logger.error('[Recipe Scraper API] Error loading recipes:', {
      error: loadErr instanceof Error ? loadErr.message : String(loadErr),
    });
    recipes = [];
  }

  return { recipes, totalRecipes };
}
