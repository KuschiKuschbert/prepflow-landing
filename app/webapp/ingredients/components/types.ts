export interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  created_at: string;
}

export interface IngredientWizardProps {
  suppliers: Supplier[];
  availableUnits: string[];
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
  onCancel: () => void;
  onAddSupplier: (name: string) => Promise<void>;
  loading?: boolean;
}

export interface WizardStepProps {
  formData: Partial<Ingredient>;
  suppliers: Supplier[];
  availableUnits: string[];
  errors: Record<string, string>;
  onInputChange: (field: keyof Ingredient, value: string | number) => void;
  onWastagePercentageChange: (wastage: number) => void;
  onYieldPercentageChange: (yieldPercent: number) => void;
  onAddSupplier: (name: string) => Promise<void>;
  formatCost: (cost: number) => string;
}
