'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import React from 'react';
import { formatCost } from '../utils/wizard-helpers';
import { SupplierCombobox } from './SupplierCombobox';
import { StorageCombobox } from './StorageCombobox';

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
  // Calculate cost per pack unit (like wizard Step 1)
  const costPerPackUnit =
    formData.pack_price && formData.pack_size && parseFloat(formData.pack_size) > 0
      ? formData.pack_price / parseFloat(formData.pack_size)
      : 0;
  const packUnit = formData.pack_size_unit || '';

  return (
    <>
      {/* Basic Information */}
      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Ingredient Name *</label>
          <input
            type="text"
            value={formData.ingredient_name || ''}
            onChange={e => handleInputChange('ingredient_name', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Tomatoes"
            required
          />
          {errors.ingredient_name && (
            <p className="mt-1 text-sm text-red-400">{errors.ingredient_name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Brand</label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={e => handleInputChange('brand', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Coles"
          />
        </div>
      </div>

      {/* Pack Information */}
      <div className="desktop:grid-cols-3 grid grid-cols-1 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Pack Size *</label>
          <input
            type="number"
            step="0.01"
            value={formData.pack_size || ''}
            onChange={e => handleInputChange('pack_size', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., 5"
            required
          />
          {errors.pack_size && <p className="mt-1 text-sm text-red-400">{errors.pack_size}</p>}
        </div>

        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-300">
            Pack Size Unit
            <HelpTooltip content={getHelpText('packSizeUnit', true)} title="Pack Size Unit" />
          </label>
          <select
            value={formData.pack_size_unit || 'GM'}
            onChange={e => handleInputChange('pack_size_unit', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            {availableUnits.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Pack Price *</label>
          <input
            type="number"
            step="0.01"
            value={formData.pack_price || ''}
            onChange={e => handleInputChange('pack_price', parseFloat(e.target.value) || 0)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., 12.50"
            required
          />
          {errors.pack_price && <p className="mt-1 text-sm text-red-400">{errors.pack_price}</p>}
          {formData.pack_price !== undefined &&
            formData.pack_price > 0 &&
            formData.pack_size &&
            parseFloat(formData.pack_size) > 0 &&
            formData.pack_size_unit && (
              <div className="mt-0.5 space-y-0.5">
                <p className="text-xs text-gray-500">
                  ${formatCost(costPerPackUnit)}/{packUnit}
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        {/* Supplier */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Supplier</label>
          <SupplierCombobox
            value={formData.supplier || ''}
            onChange={value => handleInputChange('supplier', value)}
            placeholder="Search suppliers..."
          />
        </div>

        {/* Storage Location */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Storage Location</label>
          <StorageCombobox
            value={formData.storage_location || ''}
            onChange={value => handleInputChange('storage_location', value)}
            placeholder="Search equipment..."
          />
        </div>
      </div>

      {/* Yield - Slider like wizard Step 2 */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Yield %</label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.yield_percentage || 100}
              onChange={e => {
                const yieldValue = parseInt(e.target.value);
                const wasteValue = Math.max(0, 100 - yieldValue);
                handleInputChange('yield_percentage', yieldValue);
                handleInputChange('trim_peel_waste_percentage', wasteValue);
              }}
              className="slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#2a2a2a]"
            />
            <div className="w-16 text-center">
              <div className="text-lg font-bold text-[#29E7CD]">
                {String(formData.yield_percentage ?? 100)}%
              </div>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Waste: {100 - (formData.yield_percentage || 100)}%
          </p>
        </div>
      </div>
    </>
  );
}
