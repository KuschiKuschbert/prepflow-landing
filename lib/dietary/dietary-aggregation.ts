/**
 * Dietary status aggregation utilities
 * Aggregates vegetarian/vegan status for recipes and dishes
 *
 * Main orchestrator that exports all aggregation functions.
 */

// Re-export all functions from focused modules
export { aggregateRecipeDietaryStatus } from './dietary-aggregation/recipe-aggregation';
export { aggregateDishDietaryStatus } from './dietary-aggregation/dish-aggregation';
export { cacheDietaryStatus, invalidateDietaryCache } from './dietary-aggregation/cache-management';
export { validateDietaryAgainstAllergens } from './dietary-aggregation/validation';
export type { Ingredient } from './dietary-aggregation/types';
