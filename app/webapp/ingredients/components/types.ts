// Ingredient Wizard Types

export interface Supplier {
  id: string;
  name?: string;
  supplier_name?: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  payment_terms?: string | null;
  delivery_schedule?: string | null;
  minimum_order_amount?: number | null;
  is_active?: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

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

export type ExistingIngredient = Ingredient & { id: string };

export interface WizardStepProps {
  formData: Partial<Ingredient>;
  suppliers?: Supplier[];
  availableUnits: string[];
  errors: Record<string, string>;
  onInputChange: (
    field: keyof Ingredient,
    value: string | number | string[] | Ingredient['allergen_source'],
  ) => void;
  onInputBlur?: (field: keyof Ingredient, value: string | number) => void;
  formatCost: (value: number) => string;
  onWastagePercentageChange?: (wastage: number) => void;
  onYieldPercentageChange?: (yieldPercent: number) => void;
  onAddSupplier?: (supplier: Supplier | string) => void;
  detectingAllergens?: boolean;
}

export interface IngredientWizardProps {
  suppliers?: Supplier[];
  availableUnits?: string[];
  onSave: (ingredient: Ingredient) => void;
  onCancel: () => void;
  onAddSupplier?: (supplier: Supplier | string) => void;
  loading?: boolean;
}
