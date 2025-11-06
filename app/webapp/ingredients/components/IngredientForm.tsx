'use client';

import { formatTextInput } from '@/lib/text-utils';
import { convertUnit } from '@/lib/unit-conversion';
import { useState, useEffect } from 'react';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { IngredientFormFields } from './IngredientFormFields';

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
  supplier_name?: string; // Actual column name in database
  name?: string; // Fallback for compatibility
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
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '',
    pack_size_unit: 'GM',
    pack_price: 0,
    unit: 'GM',
    cost_per_unit: 0,
    cost_per_unit_as_purchased: 0,
    cost_per_unit_incl_trim: 0,
    trim_peel_waste_percentage: 0,
    yield_percentage: 100,
    supplier: '',
    product_code: '',
    storage_location: '',
    min_stock_level: 0,
    current_stock: 0,
    ...ingredient,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when ingredient prop changes (for editing)
  useEffect(() => {
    if (ingredient) {
      setFormData({
        ingredient_name: ingredient.ingredient_name || '',
        brand: ingredient.brand || '',
        pack_size: ingredient.pack_size || '',
        pack_size_unit: ingredient.pack_size_unit || 'GM',
        pack_price: ingredient.pack_price || 0,
        unit: ingredient.unit || 'GM',
        cost_per_unit: ingredient.cost_per_unit || 0,
        cost_per_unit_as_purchased:
          ingredient.cost_per_unit_as_purchased || ingredient.cost_per_unit || 0,
        cost_per_unit_incl_trim:
          ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0,
        trim_peel_waste_percentage: ingredient.trim_peel_waste_percentage || 0,
        yield_percentage: ingredient.yield_percentage || 100,
        supplier: ingredient.supplier || '',
        product_code: ingredient.product_code || '',
        storage_location: ingredient.storage_location || '',
        min_stock_level: ingredient.min_stock_level || 0,
        current_stock: ingredient.current_stock || 0,
      });
    } else {
      // Reset form when ingredient is null (new ingredient)
      setFormData({
        ingredient_name: '',
        brand: '',
        pack_size: '',
        pack_size_unit: 'GM',
        pack_price: 0,
        unit: 'GM',
        cost_per_unit: 0,
        cost_per_unit_as_purchased: 0,
        cost_per_unit_incl_trim: 0,
        trim_peel_waste_percentage: 0,
        yield_percentage: 100,
        supplier: '',
        product_code: '',
        storage_location: '',
        min_stock_level: 0,
        current_stock: 0,
      });
    }
    // Clear errors when ingredient changes
    setErrors({});
  }, [ingredient]);

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
      // Optionally handle successful save
      if (ingredient && onSave) {
        await onSave(savedData as Partial<Ingredient>);
      }
    },
  });

  // Calculate cost per unit from pack price and pack size
  const calculateCostPerUnit = (
    packPrice: number,
    packSize: number,
    packSizeUnit: string,
    targetUnit: string,
  ): number => {
    if (packPrice === 0 || packSize === 0) return 0;

    const conversion = convertUnit(1, packSizeUnit, targetUnit);
    const packSizeInTargetUnit = packSize * conversion.value;

    return packPrice / packSizeInTargetUnit;
  };

  // Auto-calculate cost per unit when pack price or pack size changes
  const updateCostPerUnit = () => {
    if (formData.pack_price && formData.pack_size && formData.pack_size_unit && formData.unit) {
      const calculatedCost = calculateCostPerUnit(
        formData.pack_price,
        parseFloat(formData.pack_size),
        formData.pack_size_unit,
        formData.unit,
      );
      setFormData(prev => ({
        ...prev,
        cost_per_unit: calculatedCost,
        cost_per_unit_as_purchased: calculatedCost,
        cost_per_unit_incl_trim: calculatedCost,
      }));
    }
  };

  const handleInputChange = (field: keyof Ingredient, value: string | number) => {
    const formattedValue = typeof value === 'string' ? formatTextInput(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate cost per unit for relevant fields
    if (['pack_price', 'pack_size', 'pack_size_unit', 'unit'].includes(field)) {
      setTimeout(updateCostPerUnit, 100);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ingredient_name?.trim()) {
      newErrors.ingredient_name = 'Ingredient name is required';
    }

    if (!formData.pack_price || formData.pack_price <= 0) {
      newErrors.pack_price = 'Pack price must be greater than 0';
    }

    if (!formData.pack_size || parseFloat(formData.pack_size) <= 0) {
      newErrors.pack_size = 'Pack size must be greater than 0';
    }

    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Client-side duplicate check
      const qs = new URLSearchParams({
        ingredient_name: (formData.ingredient_name || '').toString().toLowerCase(),
        supplier: (formData.supplier || '').toString(),
        brand: (formData.brand || '').toString(),
        pack_size: (formData.pack_size || '').toString(),
        unit: (formData.unit || '').toString(),
        cost_per_unit: String(formData.cost_per_unit || 0),
      }).toString();
      const existsRes = await fetch(`/api/ingredients/exists?${qs}`, { cache: 'no-store' });
      const existsJson = await existsRes.json();
      if (existsJson?.exists) {
        setErrors(prev => ({ ...prev, ingredient_name: 'This ingredient already exists' }));
        return;
      }

      await onSave(formData);
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
        </h2>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <IngredientFormFields
          formData={formData}
          errors={errors}
          availableUnits={availableUnits}
          handleInputChange={handleInputChange}
        />

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading || status === 'saving'}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={async e => {
              e.preventDefault();
              if (validateForm()) {
                await saveNow();
                await onSave(formData);
              }
            }}
          >
            {loading || status === 'saving' ? 'Saving...' : ingredient ? 'Save' : 'Add Ingredient'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
