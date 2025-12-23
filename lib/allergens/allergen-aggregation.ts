/**
 * Allergen aggregation utilities
 * Aggregates allergens from ingredients up to recipe and dish level
 * Uses PostgreSQL JSONB operations for efficient aggregation
 */

import { getAllergenDisplayName } from './australian-allergens';
export {
  aggregateRecipeAllergens,
  batchAggregateRecipeAllergens,
} from './allergen-aggregation/helpers/recipeAggregation';
export { aggregateDishAllergens } from './allergen-aggregation/helpers/dishAggregation';
export {
  extractAllergenSources,
  mergeAllergenSources,
} from './allergen-aggregation/helpers/sourceExtraction';

/**
 * Get display names for allergen codes
 */
export function getAllergenDisplayNames(allergenCodes: string[]): string[] {
  return allergenCodes.map(code => getAllergenDisplayName(code));
}
