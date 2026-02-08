/**
 * Rating Filter Utility
 * Centralized rating filtering logic for recipe scraping
 */

import { RATING_CONFIG } from '../config';
import { ScrapedRecipe, SourceType } from '../types';
import { scraperLogger } from './logger';

/**
 * Normalize rating to star scale (0-5)
 * Handles both star ratings (0-5) and percentage ratings (0-100)
 *
 * @param rating - The raw rating value
 * @returns Normalized rating in star scale (0-5), or undefined if invalid
 */
function normalizeRatingToStars(rating: number): number | undefined {
  if (rating <= 0) return undefined;

  // If rating is > 5, assume it's a percentage (0-100 scale)
  // Convert to star scale: percentage / 20 (e.g., 97.5% = 4.875 stars)
  if (rating > 5) {
    // Percentage rating (0-100) - convert to stars
    if (rating > 100) return undefined; // Invalid percentage
    const normalized = rating / 20; // Convert percentage to stars (97.5% = 4.875 stars)
    scraperLogger.debug(`Normalized percentage rating ${rating}% to ${normalized} stars`);
    return normalized;
  }

  // Already in star scale (0-5)
  return rating;
}

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

  // Normalize rating to star scale (handles both star and percentage ratings)
  const normalizedRating = normalizeRatingToStars(recipe.rating);
  if (!normalizedRating) {
    // Invalid rating - exclude unless source allows unrated
    return sourceConfig.includeUnrated;
  }

  // Check if normalized rating meets threshold (4.875 = 97.5%)
  return normalizedRating >= sourceConfig.minRating;
}
