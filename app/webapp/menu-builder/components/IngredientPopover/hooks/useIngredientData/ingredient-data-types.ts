/**
 * Shared types for ingredient data fetching in menu builder.
 * Extracted to avoid circular dependencies.
 */

export interface IngredientData {
  id: string;
  ingredient_name: string;
  brand?: string;
  quantity?: number;
  unit?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

export interface RecipeSource {
  source_type: 'recipe';
  source_id: string;
  source_name: string;
  quantity?: number;
  unit?: string;
}
