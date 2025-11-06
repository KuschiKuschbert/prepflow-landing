'use client';

import { WizardStepProps } from './types';

export default function IngredientWizardStep3({ formData, formatCost }: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">✅ Review & Save</h3>
        <p className="text-gray-400">Review your ingredient details before saving</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
            📦 Basic Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="font-medium text-white">
                {formData.ingredient_name || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Brand:</span>
              <span className="text-white">{formData.brand || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pack Size:</span>
              <span className="text-white">
                {formData.pack_size || 'Not set'} {formData.pack_size_unit || ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pack Price:</span>
              <span className="text-white">${String(formData.pack_price ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Working Unit:</span>
              <span className="text-white">{formData.unit || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-t border-[#2a2a2a] pt-3">
              <span className="font-medium text-[#29E7CD]">Cost per Unit:</span>
              <span className="font-bold text-[#29E7CD]">
                ${formData.cost_per_unit ? formatCost(formData.cost_per_unit) : '0.000'}
              </span>
            </div>
          </div>
        </div>

        {/* Supplier & Storage */}
        <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
            🏢 Supplier & Storage
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Supplier:</span>
              <span className="text-white">{formData.supplier || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Product Code:</span>
              <span className="text-white">{formData.product_code || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Storage Location:</span>
              <span className="text-white">{formData.storage_location || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Min Stock:</span>
              <span className="text-white">
                {String(formData.min_stock_level ?? 0)} {formData.unit || ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Stock:</span>
              <span className="text-white">
                {String(formData.current_stock ?? 0)} {formData.unit || ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yield Information */}
      <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
          🎯 Yield & Cost Analysis
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-[#D925C7]">
              {String(formData.trim_peel_waste_percentage ?? 0)}%
            </div>
            <div className="text-sm text-gray-400">Wastage</div>
            <div className="mt-1 text-xs text-gray-500">Lost during prep</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-[#29E7CD]">
              {String(formData.yield_percentage ?? 100)}%
            </div>
            <div className="text-sm text-gray-400">Yield</div>
            <div className="mt-1 text-xs text-gray-500">Usable portion</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-[#3B82F6]">
              $
              {formData.cost_per_unit_incl_trim
                ? formatCost(formData.cost_per_unit_incl_trim)
                : '0.000'}
            </div>
            <div className="text-sm text-gray-400">Adjusted Cost</div>
            <div className="mt-1 text-xs text-gray-500">Including waste</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#29E7CD]/20 bg-[#1f1f1f] p-4">
          <div className="flex items-start space-x-3">
            <span className="text-lg text-[#29E7CD]">💡</span>
            <div>
              <h4 className="mb-1 font-medium text-white">Cost Impact</h4>
              <p className="text-sm text-gray-300">
                Your actual cost per unit is{' '}
                <strong>
                  $
                  {formData.cost_per_unit_incl_trim
                    ? formatCost(formData.cost_per_unit_incl_trim)
                    : '0.000'}
                </strong>
                after accounting for {String(formData.trim_peel_waste_percentage ?? 0)}% wastage. This is
                the cost you should use for COGS calculations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-6">
        <div className="mb-4 flex items-center space-x-3">
          <span className="text-2xl">🎉</span>
          <h3 className="text-lg font-semibold text-white">Ready to Add Ingredient!</h3>
        </div>
        <p className="text-sm text-gray-300">
          Your ingredient <strong>{formData.ingredient_name}</strong> is ready to be added to your
          inventory. All calculations are complete and the ingredient will be available for use in
          recipes and COGS calculations.
        </p>
      </div>
    </div>
  );
}
