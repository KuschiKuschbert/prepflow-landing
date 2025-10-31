'use client';

import { WizardStepProps } from './types';

export default function IngredientWizardStep1({
  formData,
  availableUnits,
  errors,
  onInputChange,
  formatCost,
}: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">📦 Basic Information</h3>
        <p className="text-gray-400">Let&apos;s start with the essential details</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Ingredient Name *</label>
          <input
            type="text"
            required
            value={formData.ingredient_name || ''}
            onChange={e => onInputChange('ingredient_name', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="e.g., Fresh Tomatoes"
          />
          {errors.ingredient_name && (
            <p className="mt-1 text-sm text-red-400">{errors.ingredient_name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Brand (Optional)</label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={e => onInputChange('brand', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="e.g., Coles, Woolworths"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
          📦 Packaging Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Pack Size *</label>
            <input
              type="text"
              required
              value={formData.pack_size || ''}
              onChange={e => onInputChange('pack_size', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              placeholder="e.g., 5"
            />
            {errors.pack_size && <p className="mt-1 text-sm text-red-400">{errors.pack_size}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Pack Unit *</label>
            <select
              required
              value={formData.pack_size_unit || ''}
              onChange={e => onInputChange('pack_size_unit', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            >
              <option value="">Select unit</option>
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.pack_size_unit && (
              <p className="mt-1 text-sm text-red-400">{errors.pack_size_unit}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Pack Price *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.pack_price || ''}
              onChange={e => onInputChange('pack_price', parseFloat(e.target.value) || 0)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              placeholder="e.g., 12.99"
            />
            {errors.pack_price && <p className="mt-1 text-sm text-red-400">{errors.pack_price}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
          🧮 Cost Calculation
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Working Unit *</label>
            <select
              required
              value={formData.unit || ''}
              onChange={e => onInputChange('unit', e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            >
              <option value="">Select unit</option>
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && <p className="mt-1 text-sm text-red-400">{errors.unit}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Cost per Unit</label>
            <div className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white">
              ${formData.cost_per_unit ? formatCost(formData.cost_per_unit) : '0.000'}
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Automatically calculated from pack price and size
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
