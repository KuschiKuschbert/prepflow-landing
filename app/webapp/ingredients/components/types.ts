// Ingredient Wizard Types - re-export shared types from lib for backward compatibility
export type { Ingredient } from '@/lib/types/ingredients';
import type { Ingredient } from '@/lib/types/ingredients';

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
