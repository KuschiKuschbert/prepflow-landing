'use client';

import { Icon } from '@/components/ui/Icon';
import { COGSCalculation } from '@/lib/types/cogs';
import { Edit, Trash2 } from 'lucide-react';

interface IngredientRowProps {
  calc: COGSCalculation;
  isEditing: boolean;
  editQuantity: number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

/** Desktop table row for a single ingredient */
export function DesktopIngredientRow({
  calc,
  isEditing,
  editQuantity,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onQuantityChange,
}: IngredientRowProps) {
  return (
    <tr className="transition-colors hover:bg-[var(--muted)]/20">
      <td className="px-6 py-4 text-sm text-[var(--foreground)]">{calc.ingredientName}</td>
      <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={editQuantity}
              onChange={e => onQuantityChange(parseFloat(e.target.value) || 0)}
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
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="rounded bg-[var(--primary)] px-2 py-1 text-xs text-[var(--button-active-text)] transition-colors duration-200 hover:bg-[var(--primary)]/80"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="rounded bg-[var(--muted)] px-2 py-1 text-xs text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--muted)]/80"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="p-1 text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
                title="Edit quantity"
              >
                <Icon
                  icon={Edit}
                  size="sm"
                  className="text-[var(--foreground-muted)]"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1 text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--color-error)]"
                title="Remove ingredient"
              >
                <Icon
                  icon={Trash2}
                  size="sm"
                  className="text-[var(--foreground-muted)]"
                  aria-hidden
                />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
