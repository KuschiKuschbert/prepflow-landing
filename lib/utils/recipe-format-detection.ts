/**
 * Recipe Format Detection Utility
 * Shared utility to determine if a recipe has been formatted
 */

/**
 * Determine if a recipe is formatted based on updated_at and scraped_at timestamps
 * A recipe is considered formatted if updated_at exists, scraped_at exists,
 * and updated_at is after scraped_at (indicating it was formatted after scraping)
 *
 * @param recipe - Recipe object with optional updated_at and scraped_at fields
 * @returns true if recipe is formatted, false otherwise
 */
export function isRecipeFormatted(recipe: { updated_at?: string; scraped_at?: string }): boolean {
  if (!recipe.updated_at || !recipe.scraped_at || recipe.updated_at === recipe.scraped_at) {
    return false;
  }

  try {
    // Use Date comparison for safety (handles timezone and edge cases)
    const updatedDate = new Date(recipe.updated_at);
    const scrapedDate = new Date(recipe.scraped_at);
    return updatedDate > scrapedDate;
  } catch {
    // Fallback: ISO timestamps are sortable as strings
    return recipe.updated_at > recipe.scraped_at;
  }
}
