'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
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

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  suppliers: Supplier[];
  availableUnits: string[];
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function IngredientForm({
  ingredient,
  suppliers,
  availableUnits,
  onSave,
  onCancel,
  loading = false,
}: IngredientFormProps) {
  const handlePersonalitySave = useOnSave();
  const { formData, errors, handleInputChange, validateForm } = useIngredientFormLogic({
    ingredient,
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
      // Autosave saves silently in the background via syncToDatabase
      // Don't call the parent's onSave prop here - that would close the modal
      // The onSave prop is only called when user explicitly clicks "Save" button
      // This allows autosave to work without closing the edit modal
      if (!ingredient) {
        // For new ingredients (wizard), autosave can call onSave
        // The wizard handles its own logic and won't close unexpectedly
        if (onSave) {
          await onSave(savedData as Partial<Ingredient>);
        }
      }
      // For existing ingredients (edit modal), autosave saves to DB silently
      // The modal stays open so user can continue editing
    },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {!ingredient && <h2 className="text-xl font-bold text-white">Add Ingredient</h2>}
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>

      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        <IngredientFormFields
          formData={formData}
          errors={errors}
          availableUnits={availableUnits}
          handleInputChange={handleInputChange}
        />

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            disabled={loading || status === 'saving'}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={async e => {
              e.preventDefault();
              if (validateForm()) {
                await saveNow();
                handlePersonalitySave();
                await onSave(formData);
              }
            }}
          >
            {loading || status === 'saving' ? 'Saving...' : ingredient ? 'Save' : 'Add Ingredient'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-[#2a2a2a] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
