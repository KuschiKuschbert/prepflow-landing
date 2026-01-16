/**
 * Types for Allergen Matrix Export
 */

export interface MatrixItem {
  name: string;
  type: 'Dish' | 'Recipe';
  category?: string;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
}
