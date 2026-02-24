/**
 * Shared types for recipe filtering and sorting.
 * Extracted to avoid circular dependencies.
 */

export type RecipeSortField =
  | 'name'
  | 'recommended_price'
  | 'profit_margin'
  | 'contributing_margin'
  | 'created';
