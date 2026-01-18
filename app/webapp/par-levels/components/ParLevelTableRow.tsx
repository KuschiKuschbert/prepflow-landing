'use client';

import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ParLevel } from '../types';

interface ParLevelTableRowProps {
  parLevel: ParLevel;
  selectedParLevels: Set<string>;
  onSelectParLevel: (id: string, selected: boolean) => void;
  onEdit: (parLevel: ParLevel) => void;
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
  isSelectionMode?: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function ParLevelTableRow({
  parLevel,
  selectedParLevels,
  onSelectParLevel,
  onEdit,
  onDelete,
  deletingId,
  isSelectionMode = false,
  onStartLongPress: _onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: ParLevelTableRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isSelected = selectedParLevels.has(parLevel.id);

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await onDelete(parLevel.id);
    } catch (error) {
      logger.error('[ParLevelTableRow] Error deleting par level:', {
        error: error instanceof Error ? error.message : String(error),
        parLevelId: parLevel.id,
      });
      // Optionally show a toast or alert to the user
    }
  };

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isSelectionMode) {
        onEnterSelectionMode?.();
        if (!isSelected) onSelectParLevel(parLevel.id, true);
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
      const currentlySelected = selectedParLevels.has(parLevel.id);
      onSelectParLevel(parLevel.id, !currentlySelected);
    } else {
      // Open edit drawer when clicking row in regular mode
      e.preventDefault();
      e.stopPropagation();
      onEdit(parLevel);
    }
  };

  // Prevent edit/delete clicks when in selection mode
  const handleEditClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      return;
    }
    onEdit(parLevel);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      return;
    }
    handleDelete();
  };

  return (
    <>
      <tr
        className={`border-l-2 border-[var(--primary)]/30 bg-[var(--primary)]/2 transition-colors duration-200 ${
          isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[var(--primary)]/5'
        } ${isSelected && isSelectionMode ? 'bg-[var(--primary)]/10' : ''}`}
        onClick={handleRowClick}
        title={isSelectionMode ? 'Tap to select' : 'Click to edit par level'}
        onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
        onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
        onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={e => {
              e.stopPropagation();
              const isCurrentlySelected = selectedParLevels.has(parLevel.id);
              const willBeSelected = !isCurrentlySelected;

              // Enter selection mode when selecting an item (not deselecting)
              if (willBeSelected && !isSelectionMode && onEnterSelectionMode) {
                onEnterSelectionMode();
              }

              onSelectParLevel(parLevel.id, willBeSelected);
            }}
            className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
            aria-label={`${isSelected ? 'Deselect' : 'Select'} par level for ${parLevel.ingredients?.ingredient_name || 'ingredient'}`}
          >
            {isSelected ? (
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
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {parLevel.ingredients?.ingredient_name || 'Unknown Ingredient'}
            </div>
            {parLevel.ingredients?.category && (
              <div className="text-xs text-[var(--foreground-muted)]">
                {parLevel.ingredients.category}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground)]">
          {parLevel.par_level} {parLevel.unit}
        </td>
        <td className="px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground)]">
          {parLevel.reorder_point} {parLevel.unit}
        </td>
        <td className="px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)]">
          {parLevel.unit}
        </td>
        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleEditClick}
              disabled={isSelectionMode}
              className="rounded-lg p-2 text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10 disabled:opacity-50"
              aria-label={`Edit par level for ${parLevel.ingredients?.ingredient_name || 'ingredient'}`}
            >
              <Icon icon={Edit2} size="sm" aria-hidden={true} />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deletingId === parLevel.id || isSelectionMode}
              className="rounded-lg p-2 text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10 disabled:opacity-50"
              aria-label={`Delete par level for ${parLevel.ingredients?.ingredient_name || 'ingredient'}`}
            >
              {deletingId === parLevel.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-error)] border-t-transparent"></div>
              ) : (
                <Icon icon={Trash2} size="sm" aria-hidden={true} />
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Confirm Delete Dialog - Rendered via Portal to avoid hydration errors */}
      {typeof window !== 'undefined' &&
        showDeleteConfirm &&
        createPortal(
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            title="Delete Par Level"
            message={`Are you sure you want to delete the par level for "${parLevel.ingredients?.ingredient_name || 'this ingredient'}"? This action can't be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            variant="danger"
          />,
          document.body,
        )}
    </>
  );
}
