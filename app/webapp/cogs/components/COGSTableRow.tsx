'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Trash2 } from 'lucide-react';
import { COGSCalculation } from '../types';

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
  index,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
}: COGSTableRowProps) {
  return (
    <tr className="transition-colors hover:bg-[#2a2a2a]/20">
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
      <td className="px-6 py-4 text-sm text-gray-300">${calc.yieldAdjustedCost.toFixed(2)}</td>
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
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
