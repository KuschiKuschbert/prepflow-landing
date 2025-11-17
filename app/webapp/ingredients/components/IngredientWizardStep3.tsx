'use client';

import { calculateCostPerUnit } from '../utils/wizard-helpers';
import { WizardStepProps } from './types';

export default function IngredientWizardStep3({ formData, formatCost }: WizardStepProps) {
  const workingUnit = formData.unit || formData.pack_size_unit || '';

  // Always recalculate from pack data (source of truth) to ensure accuracy
  let costPerWorkingUnit = 0;
  if (
    formData.pack_price &&
    formData.pack_price > 0 &&
    formData.pack_size &&
    formData.pack_size_unit &&
    formData.unit
  ) {
    const packSize = parseFloat(String(formData.pack_size));
    if (packSize > 0) {
      costPerWorkingUnit = calculateCostPerUnit(
        formData.pack_price,
        packSize,
        formData.pack_size_unit,
        formData.unit,
      );
    }
  }

  const yieldPercent = formData.yield_percentage || 100;
  // Calculate adjusted cost from recalculated cost_per_unit and yield
  const adjustedCost = costPerWorkingUnit > 0 ? costPerWorkingUnit / (yieldPercent / 100) : 0;

  return (
    <div className="tablet:grid-cols-2 large-desktop:grid-cols-4 grid grid-cols-1 gap-3">
      {/* Ingredient Name */}
      <div>
        <div className="mb-1 text-xs text-gray-400">Name</div>
        <div className="text-sm font-medium text-white">
          {formData.ingredient_name || 'Not set'}
        </div>
      </div>

      {/* Cost per Unit */}
      <div>
        <div className="mb-1 text-xs text-gray-400">Cost per Unit</div>
        <div className="text-lg font-bold text-[#29E7CD]">
          ${costPerWorkingUnit > 0 ? formatCost(costPerWorkingUnit) : '0.000'}/{workingUnit}
        </div>
      </div>

      {/* Yield */}
      <div>
        <div className="mb-1 text-xs text-gray-400">Yield</div>
        <div className="text-lg font-bold text-[#29E7CD]">
          {String(formData.yield_percentage ?? 100)}%
        </div>
        <div className="mt-0.5 text-xs text-gray-500">
          Waste: {100 - (formData.yield_percentage || 100)}%
        </div>
      </div>

      {/* Adjusted Cost */}
      <div>
        <div className="mb-1 text-xs text-gray-400">Adjusted Cost</div>
        <div className="text-lg font-bold text-[#3B82F6]">
          ${adjustedCost > 0 ? formatCost(adjustedCost) : '0.000'}/{workingUnit}
        </div>
        <div className="mt-0.5 text-xs text-gray-500">For COGS</div>
      </div>
    </div>
  );
}
