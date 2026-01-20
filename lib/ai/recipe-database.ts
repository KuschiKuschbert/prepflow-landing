/**
 * Recipe Database
 * Loads and searches recipes from JSON database for AI specials feature
 */

import { logger } from '@/lib/logger';
import { ScrapedRecipe } from '../../scripts/recipe-scraper/parsers/types';
import {
    formatRecipesForPrompt,
    getRecipeDatabaseStats,
    loadIndex
} from './recipe-database-helpers';
import {
    processRecipeEntry,
    RecipeMatch,
    selectDiverseRecipes,
    sortRecipeMatches,
} from './recipe-database/helpers/search-helpers';

/**
 * Search recipes by ingredients with rating prioritization and source diversity
 */
export async function searchRecipesByIngredients(
  ingredientNames: string[],
  limit: number = 5,
  sourceFilter?: string,
): Promise<ScrapedRecipe[]> {
  try {
    const index = loadIndex();
    if (!index || index.recipes.length === 0) {
      logger.debug('No recipes in database');
      return [];
    }

    const lowerIngredients = ingredientNames.map(ing => ing.toLowerCase());

    // First pass: collect all matching recipes
    const matchPromises: Promise<RecipeMatch | null>[] = [];
    for (const entry of index.recipes) {
      if (sourceFilter && entry.source !== sourceFilter) {
        continue;
      }
      matchPromises.push(processRecipeEntry(entry, lowerIngredients));
    }

    const results = await Promise.all(matchPromises);
    // Reuse the matches variable logic but cleaner
    const validMatches = results.filter((match): match is RecipeMatch => match !== null);

    // Sort matches
    const sortedMatches = sortRecipeMatches(validMatches);

    // Second pass: ensure source diversity
    return selectDiverseRecipes(sortedMatches, limit);
  } catch (error) {
    logger.error('Error searching recipes by ingredients:', error);
    return [];
  }
}

// Re-export helper functions
export { formatRecipesForPrompt, getRecipeDatabaseStats };
