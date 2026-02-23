/**
 * Shared Ingredient type used across lib (AI, imports) and app.
 * Single source of truth - app/webapp/ingredients re-exports for backward compatibility.
 */

export interface Ingredient {
  id?: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  category?: string;
  unit?: string;
  original_unit?: string;
  standard_unit?: string;
  cost_per_unit?: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  supplier_name?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
    ai_detected_at?: string;
  };
  created_at?: string;
  updated_at?: string;
}
