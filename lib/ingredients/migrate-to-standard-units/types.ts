/**
 * Types for ingredient migration to standard units.
 */

export interface IngredientRow {
  id: string;
  ingredient_name: string;
  pack_size?: string | number | null;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  standard_unit?: string;
  original_unit?: string;
}

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: number;
  errorDetails?: string[];
}
