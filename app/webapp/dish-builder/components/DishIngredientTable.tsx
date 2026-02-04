'use client';

import { COGSCalculation } from '@/lib/types/cogs';
import React from 'react';
import { DesktopIngredientRow } from './DesktopIngredientRow';
import { MobileIngredientCard } from './MobileIngredientCard';
import { TotalSummary } from './TotalSummary';

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
        <div className="large-desktop:hidden block space-y-3">
          {calculations.map((calc, index) => (
            <MobileIngredientCard
              key={calc.ingredientId || `calc-${index}`}
              calc={calc}
              isEditing={editingIngredient === calc.ingredientId}
              editQuantity={editQuantity}
              onEdit={() => onEditIngredient(calc.ingredientId, calc.quantity)}
              onSave={onSaveEdit}
              onCancel={onCancelEdit}
              onRemove={() => void onRemoveIngredient(calc.ingredientId)}
              onQuantityChange={onEditQuantityChange}
            />
          ))}
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
                  <DesktopIngredientRow
                    key={calc.ingredientId || `calc-${index}`}
                    calc={calc}
                    isEditing={editingIngredient === calc.ingredientId}
                    editQuantity={editQuantity}
                    onEdit={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                    onRemove={() => void onRemoveIngredient(calc.ingredientId)}
                    onQuantityChange={onEditQuantityChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <TotalSummary totalCOGS={totalCOGS} costPerPortion={costPerPortion} />
      </div>
    );
  },
);

DishIngredientTable.displayName = 'DishIngredientTable';
