// PrepFlow - Ingredient Table Row Component
// Extracted from IngredientTable to meet file size limits

'use client';

import { convertIngredientCost } from '@/lib/unit-conversion';
import { getStandardUnit } from '../utils/getStandardUnit';
import { Edit, Trash2, Info } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useState, useRef } from 'react';

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
  const standardUnit = getStandardUnit(ingredient.unit, ingredient.standard_unit);
  const convertedCost = convertIngredientCost(
    ingredient.cost_per_unit,
    standardUnit,
    displayUnit,
    1,
  );
  const packSizeUnit = ingredient.pack_size_unit || ingredient.unit || 'GM';
  const originalUnit = ingredient.original_unit || packSizeUnit;
  const showUnitTooltip = originalUnit && originalUnit !== standardUnit;
  const isLowStock =
    ingredient.min_stock_level &&
    ingredient.current_stock &&
    ingredient.current_stock <= ingredient.min_stock_level;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDelete(ingredient.id);
  };

  const isSelected = selectedIngredients.has(ingredient.id);

  // Long press handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSelectionMode) {
      // In selection mode, tap to toggle
      e.preventDefault();
      onSelectIngredient(ingredient.id, !isSelected);
      return;
    }

    touchStartTimeRef.current = Date.now();
    hasMovedRef.current = false;
    const touch = e.touches[0];
    if (touch) {
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
    onStartLongPress?.();

    longPressTimerRef.current = setTimeout(() => {
      if (!hasMovedRef.current && touchStartTimeRef.current) {
        // Enter selection mode
        onEnterSelectionMode?.();
        // Select this item when entering selection mode
        if (!isSelected) {
          onSelectIngredient(ingredient.id, true);
        }
      }
      longPressTimerRef.current = null;
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only cancel if moved significantly (more than 10px)
    const touch = e.touches[0];
    if (touchStartPosRef.current && touch) {
      const moveDistance = Math.abs(touch.clientX - touchStartPosRef.current.x) + Math.abs(touch.clientY - touchStartPosRef.current.y);
      if (moveDistance > 10) {
        hasMovedRef.current = true;
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
          onCancelLongPress?.();
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      onCancelLongPress?.();
    }
    touchStartTimeRef.current = null;
    touchStartPosRef.current = null;
    hasMovedRef.current = false;
  };

  // Click handler - in selection mode, toggle selection
  const handleRowClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.preventDefault();
      onSelectIngredient(ingredient.id, !isSelected);
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onSelectIngredient(ingredient.id, !selectedIngredients.has(ingredient.id))}
          className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
          aria-label={`${selectedIngredients.has(ingredient.id) ? 'Deselect' : 'Select'} ingredient ${ingredient.ingredient_name}`}
        >
          {selectedIngredients.has(ingredient.id) ? (
            <svg className="h-4 w-4 text-[#29E7CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
          )}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{ingredient.ingredient_name}</div>
        {ingredient.product_code && (
          <div className="text-sm text-gray-400">{ingredient.product_code}</div>
        )}
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
        {ingredient.brand || '-'}
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
        <div className="flex items-center gap-1">
          <span>
            {ingredient.pack_size} {packSizeUnit}
          </span>
          {showUnitTooltip && (
            <span
              className="cursor-help text-xs text-gray-500"
              title={`Original unit: ${originalUnit}, Standard: ${standardUnit}`}
            >
              <Icon icon={Info} size="xs" className="text-gray-500" aria-hidden={true} />
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
        <div className="flex flex-col">
          <span>
            {formatCurrency(convertedCost)}/{displayUnit}
          </span>
          {showUnitTooltip && <span className="text-xs text-gray-500">(std: {standardUnit})</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
        {ingredient.supplier || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isLowStock ? 'text-red-400' : 'text-gray-300'}`}>
            {ingredient.current_stock || 0} {ingredient.unit}
          </span>
          {isLowStock && (
            <span className="inline-flex items-center rounded-full bg-red-900/20 px-2 py-1 text-xs font-medium text-red-400">
              Low Stock
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            disabled={isSelectionMode}
            className={`text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80 ${isSelectionMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={`Edit ${ingredient.ingredient_name}`}
          >
            <Icon icon={Edit} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={deletingId === ingredient.id || isSelectionMode}
            className={`text-red-400 transition-colors hover:text-red-300 disabled:opacity-50 ${isSelectionMode ? 'cursor-not-allowed' : ''}`}
            aria-label={`Delete ${ingredient.ingredient_name}`}
          >
            {deletingId === ingredient.id ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
            ) : (
              <Icon icon={Trash2} size="sm" className="text-red-400" aria-hidden={true} />
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
