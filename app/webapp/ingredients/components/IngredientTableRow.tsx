// PrepFlow - Ingredient Table Row Component
// Extracted from IngredientTable to meet file size limits

'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  IngredientBrandCell,
  IngredientCostCell,
  IngredientNameCell,
  IngredientPackSizeCell,
  IngredientStockCell,
  IngredientSupplierCell,
} from './IngredientTableCell';
import { useLongPress } from '../hooks/useLongPress';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  standard_unit?: string;
  original_unit?: string;
}

interface IngredientTableRowProps {
  ingredient: Ingredient;
  displayUnit: string;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
  isSelectionMode?: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function IngredientTableRow({
  ingredient,
  displayUnit,
  selectedIngredients,
  onSelectIngredient,
  onEdit,
  onDelete,
  deletingId,
  isSelectionMode = false,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: IngredientTableRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isSelected = selectedIngredients.has(ingredient.id);

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDelete(ingredient.id);
  };

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isSelectionMode) {
        onEnterSelectionMode?.();
        if (!isSelected) onSelectIngredient(ingredient.id, true);
      }
    },
    onCancel: onCancelLongPress,
    delay: 500,
  });

  // Click handler - in selection mode, toggle selection
  const handleRowClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      const target = e.target as HTMLElement;
      // Don't toggle if clicking on buttons or interactive elements
      if (target.closest('button') || target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      // Get current selection state directly from the Set to avoid stale closure
      const currentlySelected = selectedIngredients.has(ingredient.id);
      onSelectIngredient(ingredient.id, !currentlySelected);
    }
  };

  // Prevent edit/delete clicks when in selection mode
  const handleEditClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      return;
    }
    onEdit(ingredient);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      return;
    }
    handleDelete();
  };

  return (
    <tr
      className={`transition-colors duration-200 ${
        isSelectionMode ? 'cursor-pointer' : 'hover:bg-[#2a2a2a]/20'
      } ${isSelected && isSelectionMode ? 'bg-[#29E7CD]/10' : ''}`}
      onClick={handleRowClick}
      onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
      onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
      onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
    >
      <td className="hidden px-6 py-4 whitespace-nowrap lg:table-cell">
        <button
          onClick={e => {
            e.stopPropagation();
            const isCurrentlySelected = selectedIngredients.has(ingredient.id);
            const willBeSelected = !isCurrentlySelected;

            // Enter selection mode when selecting an item (not deselecting)
            if (willBeSelected && !isSelectionMode && onEnterSelectionMode) {
              onEnterSelectionMode();
            }

            onSelectIngredient(ingredient.id, willBeSelected);
          }}
          onTouchStart={e => {
            if (isSelectionMode) {
              e.stopPropagation();
            }
          }}
          className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
          aria-label={`${selectedIngredients.has(ingredient.id) ? 'Deselect' : 'Select'} ingredient ${ingredient.ingredient_name}`}
        >
          {selectedIngredients.has(ingredient.id) ? (
            <svg
              className="h-4 w-4 text-[#29E7CD]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
          )}
        </button>
      </td>
      <IngredientNameCell ingredient={ingredient} />
      <IngredientBrandCell ingredient={ingredient} />
      <IngredientPackSizeCell ingredient={ingredient} />
      <IngredientCostCell ingredient={ingredient} displayUnit={displayUnit} />
      <IngredientSupplierCell ingredient={ingredient} />
      <IngredientStockCell ingredient={ingredient} />
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            disabled={isSelectionMode}
            className={`text-[#29E7CD] transition-all duration-200 hover:text-[#29E7CD] hover:drop-shadow-[0_0_8px_rgba(41,231,205,0.6)] ${isSelectionMode ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label={`Edit ${ingredient.ingredient_name}`}
          >
            <Icon
              icon={Edit}
              size="sm"
              className="text-[#29E7CD] transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(41,231,205,0.6)]"
              aria-hidden={true}
            />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={deletingId === ingredient.id || isSelectionMode}
            className={`text-red-400 transition-all duration-200 hover:text-red-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)] disabled:opacity-50 ${isSelectionMode ? 'cursor-not-allowed' : ''}`}
            aria-label={`Delete ${ingredient.ingredient_name}`}
          >
            {deletingId === ingredient.id ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
            ) : (
              <Icon
                icon={Trash2}
                size="sm"
                className="text-red-400 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]"
                aria-hidden={true}
              />
            )}
          </button>
        </div>
      </td>
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Ingredient"
        message={`Are you sure you want to delete "${ingredient.ingredient_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </tr>
  );
}
