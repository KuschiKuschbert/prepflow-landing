'use client';

import { Icon } from '@/components/ui/Icon';
import { COGSCalculation } from '@/lib/types/cogs';
import { Edit, Trash2 } from 'lucide-react';

interface COGSTableMobileCardProps {
  calc: COGSCalculation;
  index: number;
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void | Promise<void>;
  onEditQuantityChange: (quantity: number) => void;
}

export function COGSTableMobileCard({
  calc,
  index,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
}: COGSTableMobileCardProps) {
  return (
    <div
      key={calc.ingredientId || `calc-${index}`}
      className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3"
    >
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-sm font-medium text-[var(--foreground)]">{calc.ingredientName}</h4>
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
              className="rounded bg-[var(--muted)] px-3 py-1 text-xs text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--muted)]/80"
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
  );
}
