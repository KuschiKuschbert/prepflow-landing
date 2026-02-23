'use client';

import React from 'react';
import { useCOGSTableSort } from '../hooks/useCOGSTableSort';
import { COGSCalculation } from '@/lib/types/cogs';
import { COGSTableEmptyState } from './COGSTableEmptyState';
import { COGSTableHeader } from './COGSTableHeader';
import { COGSTableMobileCard } from './COGSTableMobileCard';
import { COGSTableRow } from './COGSTableRow';
import { COGSTableSummary } from './COGSTableSummary';

interface COGSTableProps {
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
  dishPortions: number;
  sortField?: 'ingredient_name' | 'quantity' | 'cost';
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (
    field: 'ingredient_name' | 'quantity' | 'cost',
    direction: 'asc' | 'desc',
  ) => void;
}

export const COGSTable: React.FC<COGSTableProps> = React.memo(function COGSTable({
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
  dishPortions,
  sortField = 'ingredient_name',
  sortDirection = 'asc',
  onSortChange,
}) {
  const { handleColumnSort, getSortIcon } = useCOGSTableSort({
    sortField,
    sortDirection,
    onSortChange: onSortChange || (() => {}),
  });

  if (calculations.length === 0) {
    return <COGSTableEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout */}
      <div className="large-desktop:hidden block">
        <div className="space-y-3">
          {calculations.map((calc, index) => (
            <COGSTableMobileCard
              key={calc.id || `${calc.recipeId || 'dish'}-${calc.ingredientId}-${index}`}
              calc={calc}
              index={index}
              editingIngredient={editingIngredient}
              editQuantity={editQuantity}
              onEditIngredient={onEditIngredient}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onRemoveIngredient={onRemoveIngredient}
              onEditQuantityChange={onEditQuantityChange}
            />
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="large-desktop:block hidden overflow-x-auto">
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-full divide-y divide-[var(--muted)]">
            <COGSTableHeader
              onSortChange={onSortChange}
              handleColumnSort={handleColumnSort}
              getSortIcon={getSortIcon}
            />
            <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
              {calculations.map((calc, index) => (
                <COGSTableRow
                  key={calc.id || `${calc.recipeId || 'dish'}-${calc.ingredientId}-${index}`}
                  calc={calc}
                  index={index}
                  editingIngredient={editingIngredient}
                  editQuantity={editQuantity}
                  onEditIngredient={onEditIngredient}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onRemoveIngredient={onRemoveIngredient}
                  onEditQuantityChange={onEditQuantityChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <COGSTableSummary
        totalCOGS={totalCOGS}
        costPerPortion={costPerPortion}
        dishPortions={dishPortions}
      />
    </div>
  );
});

COGSTable.displayName = 'COGSTable';
