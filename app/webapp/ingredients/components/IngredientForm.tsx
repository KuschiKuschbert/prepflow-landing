'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from '@/lib/text-utils';
import { convertUnit } from '@/lib/unit-conversion';

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
  name: string;
  created_at: string;
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
  const { t } = useTranslation();

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

  // Calculate cost per unit from pack price and pack size
  const calculateCostPerUnit = (
    packPrice: number,
    packSize: number,
    packSizeUnit: string,
    targetUnit: string,
  ): number => {
    if (packPrice === 0 || packSize === 0) return 0;

    const conversion = convertUnit(1, packSizeUnit, targetUnit);
    const packSizeInTargetUnit = packSize * conversion.conversionFactor;

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
      await onSave(formData);
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Ingredient Name *
            </label>
            <input
              type="text"
              value={formData.ingredient_name || ''}
              onChange={e => handleInputChange('ingredient_name', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Tomatoes"
              required
            />
            {errors.ingredient_name && (
              <p className="mt-1 text-sm text-red-400">{errors.ingredient_name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Brand</label>
            <input
              type="text"
              value={formData.brand || ''}
              onChange={e => handleInputChange('brand', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Coles"
            />
          </div>
        </div>

        {/* Pack Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Pack Size *</label>
            <input
              type="number"
              step="0.01"
              value={formData.pack_size || ''}
              onChange={e => handleInputChange('pack_size', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 5"
              required
            />
            {errors.pack_size && <p className="mt-1 text-sm text-red-400">{errors.pack_size}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Pack Size Unit</label>
            <select
              value={formData.pack_size_unit || 'GM'}
              onChange={e => handleInputChange('pack_size_unit', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            >
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Pack Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.pack_price || ''}
              onChange={e => handleInputChange('pack_price', parseFloat(e.target.value) || 0)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 12.50"
              required
            />
            {errors.pack_price && <p className="mt-1 text-sm text-red-400">{errors.pack_price}</p>}
          </div>
        </div>

        {/* Cost Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Cost Per Unit *</label>
            <input
              type="number"
              step="0.01"
              value={formData.cost_per_unit || ''}
              onChange={e => handleInputChange('cost_per_unit', parseFloat(e.target.value) || 0)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Auto-calculated"
              required
            />
            {errors.cost_per_unit && (
              <p className="mt-1 text-sm text-red-400">{errors.cost_per_unit}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Unit *</label>
            <select
              value={formData.unit || 'GM'}
              onChange={e => handleInputChange('unit', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              required
            >
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && <p className="mt-1 text-sm text-red-400">{errors.unit}</p>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Supplier</label>
            <input
              type="text"
              value={formData.supplier || ''}
              onChange={e => handleInputChange('supplier', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Coles"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Storage Location</label>
            <input
              type="text"
              value={formData.storage_location || ''}
              onChange={e => handleInputChange('storage_location', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Coolroom"
            />
          </div>
        </div>

        {/* Waste and Yield */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Trim/Peel Waste (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.trim_peel_waste_percentage || 0}
              onChange={e =>
                handleInputChange('trim_peel_waste_percentage', parseFloat(e.target.value) || 0)
              }
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Yield (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.yield_percentage || 100}
              onChange={e =>
                handleInputChange('yield_percentage', parseFloat(e.target.value) || 100)
              }
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 90"
            />
          </div>
        </div>

        {/* Stock Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Min Stock Level</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.min_stock_level || 0}
              onChange={e => handleInputChange('min_stock_level', parseFloat(e.target.value) || 0)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Current Stock</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.current_stock || 0}
              onChange={e => handleInputChange('current_stock', parseFloat(e.target.value) || 0)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving...' : ingredient ? 'Update Ingredient' : 'Add Ingredient'}
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
