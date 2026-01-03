/**
 * Rating Filter Utility
 * Centralized rating filtering logic for recipe scraping
 */

import { ScrapedRecipe } from '../parsers/types';
import { SourceType, RATING_CONFIG } from '../config';

/**
 * Determine if a recipe should be included based on its rating and source configuration
 *
 * @param recipe - The scraped recipe to evaluate
 * @param source - The source website identifier
 * @returns true if recipe should be included, false if it should be filtered out
 */
export function shouldIncludeRecipe(recipe: ScrapedRecipe, source: SourceType): boolean {
  const sourceConfig = RATING_CONFIG.SOURCE_CONFIG[source] || {
    minRating: RATING_CONFIG.DEFAULT_MIN_RATING,
    includeUnrated: RATING_CONFIG.DEFAULT_INCLUDE_UNRATED,
  };

  // If recipe has no rating
  if (!recipe.rating) {
    // Include if source allows unrated recipes (professional sites)
    return sourceConfig.includeUnrated;
  }

  // If recipe has rating, check if it meets threshold
  return recipe.rating >= sourceConfig.minRating;
}
