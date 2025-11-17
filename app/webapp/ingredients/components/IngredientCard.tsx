'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { Edit, MapPin, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCardTouchHandlers } from '../hooks/useCardTouchHandlers';
import { getStandardUnit } from '../utils/getStandardUnit';

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

interface IngredientCardProps {
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

export function IngredientCard({
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
}: IngredientCardProps) {
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
  const isSelected = selectedIngredients.has(ingredient.id);

  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCardClick } =
    useCardTouchHandlers({
      ingredientId: ingredient.id,
      isSelectionMode,
      selectedIngredients,
      onSelectIngredient,
      onEdit: () => onEdit(ingredient),
      onStartLongPress,
      onCancelLongPress,
      onEnterSelectionMode,
    });

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDelete(ingredient.id);
  };

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
    <>
      <div
        className={`rounded-xl border-l-2 border-[#D925C7]/30 bg-[#D925C7]/2 p-3 transition-all duration-200 ${
          isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[#D925C7]/5'
        } ${isSelected && isSelectionMode ? 'border-[#D925C7]/50 bg-[#D925C7]/10' : ''}`}
        onClick={handleCardClick}
        title={isSelectionMode ? 'Tap to select' : 'Click to edit ingredient'}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header: Name and Cost */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-white">
              {ingredient.ingredient_name}
            </h3>
            {ingredient.product_code && (
              <p className="truncate text-xs text-gray-500">{ingredient.product_code}</p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-base font-bold text-[#29E7CD]">
              {formatCurrency(convertedCost)}
            </div>
            <div className="text-xs text-gray-400">/{displayUnit}</div>
          </div>
        </div>

        {/* Secondary Info: Compact inline layout */}
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          {ingredient.brand && (
            <span>
              <span className="text-gray-500">Brand:</span> {ingredient.brand}
            </span>
          )}
          {ingredient.supplier && (
            <span className="flex items-center gap-1">
              <Icon icon={Store} size="xs" className="text-gray-500" aria-hidden={true} />
              {ingredient.supplier}
            </span>
          )}
          {ingredient.pack_size != null && (
            <span className="flex items-center gap-1">
              <Icon icon={MapPin} size="xs" className="text-gray-500" aria-hidden={true} />
              {String(ingredient.pack_size)} {packSizeUnit}
              {showUnitTooltip && <span className="text-gray-500">({standardUnit})</span>}
            </span>
          )}
        </div>

        {/* Stock Status and Actions Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={`truncate text-xs font-medium ${isLowStock ? 'text-red-400' : 'text-gray-300'}`}
            >
              Stock: {ingredient.current_stock != null ? String(ingredient.current_stock) : '0'}{' '}
              {ingredient.unit || ''}
            </span>
            {isLowStock && (
              <span className="inline-flex flex-shrink-0 items-center rounded-full bg-red-900/20 px-1.5 py-0.5 text-xs font-medium text-red-400">
                Low
              </span>
            )}
          </div>
          <div className="flex flex-shrink-0 gap-1.5">
            <button
              onClick={handleEditClick}
              disabled={isSelectionMode}
              className={`flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:drop-shadow-[0_0_8px_rgba(41,231,205,0.6)] disabled:opacity-50 ${
                isSelectionMode ? 'cursor-not-allowed' : ''
              }`}
              aria-label={`Edit ${ingredient.ingredient_name}`}
            >
              <Icon icon={Edit} size="xs" className="text-white" aria-hidden={true} />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deletingId === ingredient.id || isSelectionMode}
              className={`flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)] disabled:opacity-50 ${
                isSelectionMode ? 'cursor-not-allowed' : ''
              }`}
              aria-label={`Delete ${ingredient.ingredient_name}`}
            >
              {deletingId === ingredient.id ? (
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
        title="Delete Ingredient"
        message={`Are you sure you want to delete "${ingredient.ingredient_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </>
  );
}
