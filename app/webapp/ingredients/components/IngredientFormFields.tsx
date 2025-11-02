'use client';

import React from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  storage_location?: string;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  min_stock_level?: number;
  current_stock?: number;
}

interface IngredientFormFieldsProps {
  formData: Partial<Ingredient>;
  errors: Record<string, string>;
  availableUnits: string[];
  handleInputChange: (field: keyof Ingredient, value: string | number) => void;
}

export function IngredientFormFields({
  formData,
  errors,
  availableUnits,
  handleInputChange,
}: IngredientFormFieldsProps) {
  return (
    <>
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Ingredient Name *</label>
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
            onChange={e => handleInputChange('yield_percentage', parseFloat(e.target.value) || 100)}
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
    </>
  );
}
