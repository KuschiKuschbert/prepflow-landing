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
      return null; // No empty state - instructions are in the left panel
    }

    return (
      <div className="space-y-4">
        {/* Mobile Card Layout */}
        <div className="large-desktop:hidden block">
          <div className="space-y-3">
            {calculations.map((calc, index) => (
              <div
                key={calc.ingredientId || `calc-${index}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="text-sm font-medium text-[var(--foreground)]">
                    {calc.ingredientName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[var(--primary)]">
                      ${calc.yieldAdjustedCost.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                      className="p-1 text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
                      title="Edit quantity"
                    >
                      <Icon
                        icon={Edit}
                        size="sm"
                        className="text-[var(--foreground-muted)]"
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
                      className="p-1 text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--color-error)]"
                      title="Remove ingredient"
                    >
                      <Icon
                        icon={Trash2}
                        size="sm"
                        className="text-[var(--foreground-muted)]"
                        aria-hidden={true}
                      />
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
                        className="w-20 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                        step="0.1"
                        min="0"
                      />
                      <span className="text-xs text-[var(--foreground-muted)]">{calc.unit}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={onSaveEdit}
                        className="rounded bg-[var(--primary)] px-3 py-1 text-xs text-[var(--button-active-text)] transition-colors duration-200 hover:bg-[var(--primary)]/80"
                      >
                        Save
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="rounded bg-gray-600 px-3 py-1 text-xs text-[var(--foreground)] transition-colors duration-200 hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {calc.quantity} {calc.unit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="large-desktop:block hidden overflow-x-auto">
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="min-w-full divide-y divide-[var(--muted)]">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
                {calculations.map((calc, index) => (
                  <tr
                    key={calc.ingredientId || `calc-${index}`}
                    className="transition-colors hover:bg-[var(--muted)]/20"
                  >
                    <td className="px-6 py-4 text-sm text-[var(--foreground)]">
                      {calc.ingredientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
                      {editingIngredient === calc.ingredientId ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={e => onEditQuantityChange(parseFloat(e.target.value) || 0)}
                            className="w-20 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                            step="0.1"
                            min="0"
                          />
                          <span className="text-xs text-[var(--foreground-muted)]">
                            {calc.unit}
                          </span>
                        </div>
                      ) : (
                        <span>
                          {calc.quantity} {calc.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
                      ${calc.yieldAdjustedCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {editingIngredient === calc.ingredientId ? (
                          <>
                            <button
                              onClick={onSaveEdit}
                              className="rounded bg-[var(--primary)] px-2 py-1 text-xs text-[var(--button-active-text)] transition-colors duration-200 hover:bg-[var(--primary)]/80"
                            >
                              Save
                            </button>
                            <button
                              onClick={onCancelEdit}
                              className="rounded bg-gray-600 px-2 py-1 text-xs text-[var(--foreground)] transition-colors duration-200 hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                              className="p-1 text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
                              title="Edit quantity"
                            >
                              <Icon
                                icon={Edit}
                                size="sm"
                                className="text-[var(--foreground-muted)]"
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
                              className="p-1 text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--color-error)]"
                              title="Remove ingredient"
                            >
                              <Icon
                                icon={Trash2}
                                size="sm"
                                className="text-[var(--foreground-muted)]"
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
        <div className="border-t border-[var(--border)] pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-lg font-medium text-[var(--foreground)]">Total COGS:</span>
            <span className="text-lg font-bold text-[var(--primary)]">${totalCOGS.toFixed(2)}</span>
          </div>
          {costPerPortion > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Cost per portion:</span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                ${costPerPortion.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

DishIngredientTable.displayName = 'DishIngredientTable';
