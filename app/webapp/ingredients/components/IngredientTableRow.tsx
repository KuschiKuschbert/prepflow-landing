// PrepFlow - Ingredient Table Row Component
// Extracted from IngredientTable to meet file size limits

'use client';

import { formatRecipeDate } from '@/app/webapp/recipes/utils/formatDate';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Edit, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { useLongPress } from '../hooks/useLongPress';
import {
  IngredientBrandCell,
  IngredientCostCell,
  IngredientNameCell,
  IngredientPackSizeCell,
  IngredientStockCell,
  IngredientSupplierCell,
} from './IngredientTableCell';

import { ExistingIngredient as Ingredient } from './types';

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

function IngredientTableRowComponent({
  ingredient,
  displayUnit,
  selectedIngredients,
  onSelectIngredient,
  onEdit,
  onDelete,
  deletingId,
  isSelectionMode = false,
  onStartLongPress: _onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: IngredientTableRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isSelected = selectedIngredients.has(ingredient.id);

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await onDelete(ingredient.id);
    } catch (err) {
      logger.error('[IngredientTableRow] Error deleting ingredient:', {
        error: err instanceof Error ? err.message : String(err),
        ingredientId: ingredient.id,
      });
    }
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

  // Click handler - in selection mode, toggle selection; otherwise open edit drawer
  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't trigger if clicking on buttons or interactive elements
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    if (isSelectionMode) {
      e.preventDefault();
      e.stopPropagation();
      // Get current selection state directly from the Set to avoid stale closure
      const currentlySelected = selectedIngredients.has(ingredient.id);
      onSelectIngredient(ingredient.id, !currentlySelected);
    } else {
      // Open edit drawer when clicking row in regular mode
      e.preventDefault();
      e.stopPropagation();
      onEdit(ingredient);
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
      className={`border-l-2 border-[var(--accent)]/30 bg-[var(--accent)]/2 transition-colors duration-200 ${
        isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[var(--accent)]/5'
      } ${isSelected && isSelectionMode ? 'bg-[var(--accent)]/10' : ''}`}
      onClick={handleRowClick}
      title={isSelectionMode ? 'Tap to select' : 'Click to edit ingredient'}
      onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
      onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
      onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
    >
      <td className="desktop:table-cell hidden px-6 py-4 whitespace-nowrap">
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
          className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
          aria-label={`${selectedIngredients.has(ingredient.id) ? 'Deselect' : 'Select'} ingredient ${ingredient.ingredient_name}`}
        >
          {selectedIngredients.has(ingredient.id) ? (
            <svg
              className="h-4 w-4 text-[var(--primary)]"
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
            <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
          )}
        </button>
      </td>
      <IngredientNameCell ingredient={ingredient} />
      <IngredientBrandCell ingredient={ingredient} className="desktop:table-cell hidden" />
      <IngredientPackSizeCell ingredient={ingredient} className="desktop:table-cell hidden" />
      <IngredientCostCell ingredient={ingredient} displayUnit={displayUnit} />
      <IngredientSupplierCell ingredient={ingredient} className="desktop:table-cell hidden" />
      <IngredientStockCell ingredient={ingredient} className="desktop:table-cell hidden" />
      <td className="desktop:table-cell hidden px-6 py-4 text-sm text-[var(--foreground-secondary)]">
        {ingredient.created_at ? formatRecipeDate(ingredient.created_at) : '—'}
      </td>
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            disabled={isSelectionMode}
            className={`text-[var(--primary)] transition-all duration-200 hover:text-[var(--primary)] hover:drop-shadow-[0_0_8px_rgba(41,231,205,0.6)] ${isSelectionMode ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label={`Edit ${ingredient.ingredient_name}`}
          >
            <Icon
              icon={Edit}
              size="sm"
              className="text-[var(--primary)] transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(41,231,205,0.6)]"
              aria-hidden={true}
            />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={deletingId === ingredient.id || isSelectionMode}
            className={`text-[var(--color-error)] transition-all duration-200 hover:text-red-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)] disabled:opacity-50 ${isSelectionMode ? 'cursor-not-allowed' : ''}`}
            aria-label={`Delete ${ingredient.ingredient_name}`}
          >
            {deletingId === ingredient.id ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-error)] border-t-transparent"></div>
            ) : (
              <Icon
                icon={Trash2}
                size="sm"
                className="text-[var(--color-error)] transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]"
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
        message={`Are you sure you want to delete "${ingredient.ingredient_name}"? This action can't be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </tr>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export const IngredientTableRow = memo(IngredientTableRowComponent, (prevProps, nextProps) => {
  // Only re-render if relevant props actually changed
  return (
    prevProps.ingredient.id === nextProps.ingredient.id &&
    prevProps.selectedIngredients === nextProps.selectedIngredients &&
    prevProps.isSelectionMode === nextProps.isSelectionMode &&
    prevProps.displayUnit === nextProps.displayUnit &&
    prevProps.deletingId === nextProps.deletingId
  );
});
