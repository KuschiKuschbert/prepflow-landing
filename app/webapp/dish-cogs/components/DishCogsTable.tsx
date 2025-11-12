'use client';

import React from 'react';
import { DishCOGSCalculation } from '../types';
import { Edit, Trash2, Utensils } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface DishCogsTableProps {
  calculations: DishCOGSCalculation[];
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void;
  onEditQuantityChange: (quantity: number) => void;
  totalCOGS: number;
}

export const DishCogsTable: React.FC<DishCogsTableProps> = React.memo(function DishCogsTable({
  calculations,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
  totalCOGS,
}) {
  if (calculations.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
            <Icon icon={Utensils} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">No Ingredients Found</h3>
        <p className="mb-4 text-gray-400">
          Select a dish to see its cost breakdown. The calculator will show all recipes and
          standalone ingredients with their costs.
        </p>
      </div>
    );
  }

  // Group calculations by source (recipe vs ingredient)
  const recipeCalculations = calculations.filter(c => c.source === 'recipe');
  const ingredientCalculations = calculations.filter(c => c.source === 'ingredient');

  return (
    <div className="space-y-6">
      {/* Recipes Section */}
      {recipeCalculations.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
            Recipes ({new Set(recipeCalculations.map(c => c.recipeId)).size})
          </h3>
          <div className="space-y-4">
            {Array.from(new Set(recipeCalculations.map(c => c.recipeId))).map(recipeId => {
              const recipeCalcs = recipeCalculations.filter(c => c.recipeId === recipeId);
              const recipeName = recipeCalcs[0]?.recipeName || 'Unknown Recipe';
              const recipeQuantity = recipeCalcs[0]?.recipeQuantity || 1;
              const recipeTotal = recipeCalcs.reduce((sum, c) => sum + c.yieldAdjustedCost, 0);

              return (
                <div key={recipeId} className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                    <div>
                      <h4 className="font-semibold text-white">{recipeName}</h4>
                      <p className="text-xs text-gray-400">Quantity: {recipeQuantity}x</p>
                    </div>
                    <span className="text-lg font-bold text-[#29E7CD]">
                      ${recipeTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {recipeCalcs.map((calc, idx) => (
                      <div
                        key={`${calc.ingredientId}-${idx}`}
                        className="flex items-center justify-between rounded bg-[#2a2a2a]/30 px-3 py-2"
                      >
                        <div className="flex-1">
                          <span className="text-sm text-white">{calc.ingredientName}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            {calc.quantity} {calc.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-300">
                            ${calc.yieldAdjustedCost.toFixed(2)}
                          </span>
                          <button
                            onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                            className="p-1 text-gray-400 transition-colors hover:text-[#29E7CD]"
                            title="Edit quantity"
                          >
                            <Icon icon={Edit} size="sm" aria-hidden={true} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Standalone Ingredients Section */}
      {ingredientCalculations.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
            Standalone Ingredients ({ingredientCalculations.length})
          </h3>
          <div className="space-y-2">
            {ingredientCalculations.map((calc, idx) => (
              <div
                key={`${calc.ingredientId}-${idx}`}
                className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">{calc.ingredientName}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {calc.quantity} {calc.unit}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {editingIngredient === calc.ingredientId ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={e => onEditQuantityChange(parseFloat(e.target.value) || 0)}
                        className="w-20 rounded border border-[#2a2a2a] bg-[#0a0a0a] px-2 py-1 text-sm text-white"
                        step="0.01"
                        min="0"
                      />
                      <button
                        onClick={onSaveEdit}
                        className="rounded bg-[#29E7CD] px-2 py-1 text-xs text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="rounded bg-gray-600 px-2 py-1 text-xs text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-bold text-[#29E7CD]">
                        ${calc.yieldAdjustedCost.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                        className="p-1 text-gray-400 transition-colors hover:text-[#29E7CD]"
                      >
                        <Icon icon={Edit} size="sm" aria-hidden={true} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total COGS */}
      <div className="rounded-xl border-2 border-[#29E7CD]/50 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">Total COGS</span>
          <span className="text-2xl font-bold text-[#29E7CD]">${totalCOGS.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">Total cost per dish</p>
      </div>
    </div>
  );
});
