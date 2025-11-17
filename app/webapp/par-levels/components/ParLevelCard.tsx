'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';
import type { ParLevel } from '../types';

interface ParLevelCardProps {
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

export function ParLevelCard({
  parLevel,
  selectedParLevels,
  onSelectParLevel,
  onEdit,
  onDelete,
  deletingId,
  isSelectionMode = false,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: ParLevelCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isSelected = selectedParLevels.has(parLevel.id);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDelete(parLevel.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
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
      // Open edit drawer when clicking card in regular mode
      e.preventDefault();
      e.stopPropagation();
      onEdit(parLevel);
    }
  };

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

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isSelectionMode) {
        onEnterSelectionMode?.();
        if (!isSelected) {
          onSelectParLevel(parLevel.id, true);
        }
      }
    },
    onCancel: onCancelLongPress,
    delay: 500,
  });

  // Handle touch events in selection mode - quick tap toggles selection
  const handleTouchEndSelection = (e: React.TouchEvent) => {
    if (!isSelectionMode) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const currentlySelected = selectedParLevels.has(parLevel.id);
    onSelectParLevel(parLevel.id, !currentlySelected);
  };

  return (
    <>
      <div
        className={`rounded-xl border-l-2 border-[#29E7CD]/30 bg-[#29E7CD]/2 p-3 transition-all duration-200 ${
          isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[#29E7CD]/5'
        } ${isSelected && isSelectionMode ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10' : ''}`}
        onClick={handleCardClick}
        title={isSelectionMode ? 'Tap to select' : 'Click to edit par level'}
        onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
        onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
        onTouchEnd={isSelectionMode ? handleTouchEndSelection : longPressHandlers.onTouchEnd}
      >
        {/* Header: Ingredient Name and Par Level */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-white">
              {parLevel.ingredients?.ingredient_name || 'Unknown Ingredient'}
            </h3>
            {parLevel.ingredients?.category && (
              <p className="truncate text-xs text-gray-500">{parLevel.ingredients.category}</p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-base font-bold text-[#29E7CD]">
              {parLevel.par_level} {parLevel.unit}
            </div>
            <div className="text-xs text-gray-400">Par Level</div>
          </div>
        </div>

        {/* Secondary Info: Reorder Point */}
        <div className="mb-2 flex items-center gap-x-3 text-xs text-gray-400">
          <span>
            <span className="text-gray-500">Reorder Point:</span> {parLevel.reorder_point}{' '}
            {parLevel.unit}
          </span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {/* Selection checkbox */}
            {isSelectionMode && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  const currentlySelected = selectedParLevels.has(parLevel.id);
                  onSelectParLevel(parLevel.id, !currentlySelected);
                }}
                className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                aria-label={`${isSelected ? 'Deselect' : 'Select'} par level for ${parLevel.ingredients?.ingredient_name || 'ingredient'}`}
              >
                {isSelected ? (
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
            )}
          </div>
          <div className="flex flex-shrink-0 gap-1.5">
            <button
              onClick={handleEditClick}
              disabled={isSelectionMode}
              className={`flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:drop-shadow-[0_0_8px_rgba(41,231,205,0.6)] disabled:opacity-50 ${
                isSelectionMode ? 'cursor-not-allowed' : ''
              }`}
              aria-label={`Edit par level for ${parLevel.ingredients?.ingredient_name || 'ingredient'}`}
            >
              <Icon icon={Edit2} size="xs" className="text-white" aria-hidden={true} />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deletingId === parLevel.id || isSelectionMode}
              className={`flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)] disabled:opacity-50 ${
                isSelectionMode ? 'cursor-not-allowed' : ''
              }`}
              aria-label={`Delete par level for ${parLevel.ingredients?.ingredient_name || 'ingredient'}`}
            >
              {deletingId === parLevel.id ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Icon icon={Trash2} size="xs" className="text-white" aria-hidden={true} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Par Level"
        message={`Are you sure you want to delete the par level for "${parLevel.ingredients?.ingredient_name || 'this ingredient'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </>
  );
}
