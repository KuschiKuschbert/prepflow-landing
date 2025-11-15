'use client';

import React from 'react';
import { COGSCalculation } from '../../cogs/types';
import { Edit, Trash2, Utensils } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface DishIngredientTableProps {
  calculations: COGSCalculation[];
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void | Promise<void>;
  onEditQuantityChange: (quantity: number) => void;
  totalCOGS: number;
  costPerPortion: number;
}

export const DishIngredientTable: React.FC<DishIngredientTableProps> = React.memo(
  function DishIngredientTable({
    calculations,
    editingIngredient,
    editQuantity,
    onEditIngredient,
    onSaveEdit,
    onCancelEdit,
    onRemoveIngredient,
    onEditQuantityChange,
    totalCOGS,
    costPerPortion,
  }) {
    if (calculations.length === 0) {
      return (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={Utensils} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">No Ingredients Added Yet</h3>
          <p className="mb-4 text-gray-400">
            Start by adding ingredients to your dish. Each ingredient you add will show its cost, and
            we&apos;ll calculate the total COGS (Cost of Goods Sold) for your dish.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Mobile Card Layout */}
        <div className="block large-desktop:hidden">
          <div className="space-y-3">
            {calculations.map((calc, index) => (
              <div
                key={calc.ingredientId || `calc-${index}`}
                className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-3"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="text-sm font-medium text-white">{calc.ingredientName}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#29E7CD]">
                      ${calc.yieldAdjustedCost.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                      className="p-1 text-gray-400 transition-colors duration-200 hover:text-[#29E7CD]"
                      title="Edit quantity"
                    >
                      <Icon icon={Edit} size="sm" className="text-gray-400" aria-hidden={true} />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        void onRemoveIngredient(calc.ingredientId);
                      }}
                      className="p-1 text-gray-400 transition-colors duration-200 hover:text-red-400"
                      title="Remove ingredient"
                    >
                      <Icon icon={Trash2} size="sm" className="text-gray-400" aria-hidden={true} />
                    </button>
                  </div>
                </div>

                {editingIngredient === calc.ingredientId ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={e => onEditQuantityChange(parseFloat(e.target.value) || 0)}
                        className="w-20 rounded border border-[#3a3a3a] bg-[#0a0a0a] px-2 py-1 text-sm text-white focus:ring-1 focus:ring-[#29E7CD] focus:outline-none"
                        step="0.1"
                        min="0"
                      />
                      <span className="text-xs text-gray-400">{calc.unit}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={onSaveEdit}
                        className="rounded bg-[#29E7CD] px-3 py-1 text-xs text-white transition-colors duration-200 hover:bg-[#29E7CD]/80"
                      >
                        Save
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="rounded bg-gray-600 px-3 py-1 text-xs text-white transition-colors duration-200 hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    {calc.quantity} {calc.unit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden overflow-x-auto large-desktop:block">
          <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
            <table className="min-w-full divide-y divide-[#2a2a2a]">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
                {calculations.map((calc, index) => (
                  <tr
                    key={calc.ingredientId || `calc-${index}`}
                    className="transition-colors hover:bg-[#2a2a2a]/20"
                  >
                    <td className="px-6 py-4 text-sm text-white">{calc.ingredientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {editingIngredient === calc.ingredientId ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={e => onEditQuantityChange(parseFloat(e.target.value) || 0)}
                            className="w-20 rounded border border-[#3a3a3a] bg-[#0a0a0a] px-2 py-1 text-sm text-white focus:ring-1 focus:ring-[#29E7CD] focus:outline-none"
                            step="0.1"
                            min="0"
                          />
                          <span className="text-xs text-gray-400">{calc.unit}</span>
                        </div>
                      ) : (
                        <span>
                          {calc.quantity} {calc.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      ${calc.yieldAdjustedCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {editingIngredient === calc.ingredientId ? (
                          <>
                            <button
                              onClick={onSaveEdit}
                              className="rounded bg-[#29E7CD] px-2 py-1 text-xs text-white transition-colors duration-200 hover:bg-[#29E7CD]/80"
                            >
                              Save
                            </button>
                            <button
                              onClick={onCancelEdit}
                              className="rounded bg-gray-600 px-2 py-1 text-xs text-white transition-colors duration-200 hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                              className="p-1 text-gray-400 transition-colors duration-200 hover:text-[#29E7CD]"
                              title="Edit quantity"
                            >
                              <Icon
                                icon={Edit}
                                size="sm"
                                className="text-gray-400"
                                aria-hidden={true}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                void onRemoveIngredient(calc.ingredientId);
                              }}
                              className="p-1 text-gray-400 transition-colors duration-200 hover:text-red-400"
                              title="Remove ingredient"
                            >
                              <Icon
                                icon={Trash2}
                                size="sm"
                                className="text-gray-400"
                                aria-hidden={true}
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total COGS Summary */}
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-lg font-medium text-white">Total COGS:</span>
            <span className="text-lg font-bold text-[#29E7CD]">${totalCOGS.toFixed(2)}</span>
          </div>
          {costPerPortion > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">Cost per portion:</span>
              <span className="text-sm font-medium text-white">${costPerPortion.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

DishIngredientTable.displayName = 'DishIngredientTable';
