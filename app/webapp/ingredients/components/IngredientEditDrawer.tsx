'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { useOnSave } from '@/lib/personality/hooks';
import { IngredientFormFields } from './IngredientFormFields';
import { useIngredientFormLogic } from './useIngredientFormLogic';

interface Ingredient {
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

interface Supplier {
  id: string;
  supplier_name?: string;
  name?: string;
  created_at?: string;
}

interface IngredientEditDrawerProps {
  isOpen: boolean;
  ingredient: Ingredient | null;
  suppliers: Supplier[];
  availableUnits: string[];
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function IngredientEditDrawer({
  isOpen,
  ingredient,
  suppliers,
  availableUnits,
  onSave,
  onClose,
  loading = false,
}: IngredientEditDrawerProps) {
  const handlePersonalitySave = useOnSave();
  const { formData, errors, handleInputChange, validateForm } = useIngredientFormLogic({
    ingredient: ingredient || undefined,
    onSave,
  });

  const entityId = deriveAutosaveId('ingredients', ingredient?.id, [
    formData.ingredient_name || '',
    formData.supplier || '',
    formData.product_code || '',
  ]);
  const canAutosave = Boolean(
    formData.ingredient_name && formData.pack_price && formData.pack_size,
  );

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'ingredients',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
    onSave: async savedData => {
      // Autosave saves silently in the background
      // Don't call the parent's onSave prop here - that would close the drawer
    },
  });

  const handleSave = async () => {
    if (validateForm()) {
      await saveNow();
      handlePersonalitySave();
      await onSave(formData);
      onClose();
    }
  };

  if (!ingredient) return null;

  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${ingredient.ingredient_name}`}
      maxWidth="xl"
      onSave={handleSave}
      saving={loading || status === 'saving'}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[#2a2a2a] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || status === 'saving'}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading || status === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        <IngredientFormFields
          formData={formData}
          errors={errors}
          availableUnits={availableUnits}
          handleInputChange={handleInputChange}
        />
      </form>
    </EditDrawer>
  );
}
