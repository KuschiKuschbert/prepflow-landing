// Ingredient Wizard Types
export interface Ingredient {
  id?: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  category?: string;
  unit?: string;
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
}

export interface WizardStepProps {
  formData: Partial<Ingredient>;
  suppliers?: any[];
  availableUnits: string[];
  errors: Record<string, string>;
  onInputChange: (field: keyof Ingredient, value: string | number) => void;
  formatCost: (value: number) => string;
  onWastagePercentageChange?: (wastage: number) => void;
  onYieldPercentageChange?: (yieldPercent: number) => void;
  onAddSupplier?: (supplier: any) => void;
}

export interface IngredientWizardProps {
  suppliers?: any[];
  availableUnits?: string[];
  onSave: (ingredient: Ingredient) => void;
  onCancel: () => void;
  onAddSupplier?: (supplier: any) => void;
  loading?: boolean;
}
