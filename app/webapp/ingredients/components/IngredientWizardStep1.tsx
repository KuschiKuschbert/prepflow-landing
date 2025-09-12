'use client';

import { WizardStepProps } from './types';

export default function IngredientWizardStep1({
  formData,
  availableUnits,
  errors,
  onInputChange,
  formatCost
}: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">📦 Basic Information</h3>
        <p className="text-gray-400">Let's start with the essential details</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ingredient Name *
          </label>
          <input
            type="text"
            required
            value={formData.ingredient_name || ''}
            onChange={(e) => onInputChange('ingredient_name', e.target.value)}
            className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
            placeholder="e.g., Fresh Tomatoes"
          />
          {errors.ingredient_name && (
            <p className="text-red-400 text-sm mt-1">{errors.ingredient_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Brand (Optional)
          </label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={(e) => onInputChange('brand', e.target.value)}
            className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
            placeholder="e.g., Coles, Woolworths"
          />
        </div>
      </div>

      <div className="bg-[#2a2a2a]/30 p-6 rounded-2xl border border-[#2a2a2a]/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          📦 Packaging Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pack Size *
            </label>
            <input
              type="text"
              required
              value={formData.pack_size || ''}
              onChange={(e) => onInputChange('pack_size', e.target.value)}
              className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
              placeholder="e.g., 5"
            />
            {errors.pack_size && (
              <p className="text-red-400 text-sm mt-1">{errors.pack_size}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pack Unit *
            </label>
            <select
              required
              value={formData.pack_size_unit || ''}
              onChange={(e) => onInputChange('pack_size_unit', e.target.value)}
              className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
            >
              <option value="">Select unit</option>
              {availableUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.pack_size_unit && (
              <p className="text-red-400 text-sm mt-1">{errors.pack_size_unit}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pack Price *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.pack_price || ''}
              onChange={(e) => onInputChange('pack_price', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
              placeholder="e.g., 12.99"
            />
            {errors.pack_price && (
              <p className="text-red-400 text-sm mt-1">{errors.pack_price}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a2a]/30 p-6 rounded-2xl border border-[#2a2a2a]/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          🧮 Cost Calculation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Working Unit *
            </label>
            <select
              required
              value={formData.unit || ''}
              onChange={(e) => onInputChange('unit', e.target.value)}
              className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
            >
              <option value="">Select unit</option>
              {availableUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="text-red-400 text-sm mt-1">{errors.unit}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cost per Unit
            </label>
            <div className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl">
              ${formData.cost_per_unit ? formatCost(formData.cost_per_unit) : '0.000'}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Automatically calculated from pack price and size
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
