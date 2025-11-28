/**
 * Types for dietary aggregation utilities.
 */

export interface Ingredient {
  ingredient_name: string;
  category?: string;
  allergens?: string[];
}
