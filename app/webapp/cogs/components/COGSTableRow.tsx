'use client';

import { Icon } from '@/components/ui/Icon';
import { COGSCalculation } from '@/lib/types/cogs';
import { Edit, Trash2 } from 'lucide-react';

interface COGSTableRowProps {
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

export function COGSTableRow({
  calc,
  index: _index,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
}: COGSTableRowProps) {
  return (
    <tr className="transition-colors hover:bg-[var(--muted)]/20">
      <td className="px-6 py-4 text-sm text-[var(--foreground)]">{calc.ingredientName}</td>
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
            <span className="text-xs text-[var(--foreground-muted)]">{calc.unit}</span>
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
                className="rounded bg-[var(--muted)] px-2 py-1 text-xs text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--muted)]/80"
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
  );
}
