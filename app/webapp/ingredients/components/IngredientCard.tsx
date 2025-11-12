'use client';

import { convertIngredientCost } from '@/lib/unit-conversion';
import { getStandardUnit } from '../utils/getStandardUnit';
import { Edit, Trash2, Store, MapPin } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useState } from 'react';
import { useCardTouchHandlers } from '../hooks/useCardTouchHandlers';

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

  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCardClick } = useCardTouchHandlers({
    ingredientId: ingredient.id,
    isSelectionMode,
    selectedIngredients,
    onSelectIngredient,
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
        className={`rounded-2xl border p-4 transition-all duration-200 ${
          isSelectionMode
            ? 'cursor-pointer border-[#2a2a2a]'
            : 'border-[#2a2a2a] bg-[#1f1f1f]/50 hover:border-[#2a2a2a]/60 hover:bg-[#1f1f1f]/70'
        } ${isSelected && isSelectionMode ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10' : ''}`}
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header: Name and Cost */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-white">{ingredient.ingredient_name}</h3>
            {ingredient.product_code && (
              <p className="text-xs text-gray-500">{ingredient.product_code}</p>
            )}
          </div>
          <div className="ml-3 text-right">
            <div className="text-lg font-bold text-[#29E7CD]">
              {formatCurrency(convertedCost)}
            </div>
            <div className="text-xs text-gray-400">/{displayUnit}</div>
          </div>
        </div>

        {/* Secondary Info: Brand, Supplier, Pack Size */}
        <div className="mb-3 space-y-1.5 text-sm">
          {ingredient.brand && (
            <div className="text-gray-400">
              <span className="text-gray-500">Brand:</span> <span>{ingredient.brand}</span>
            </div>
          )}
          {ingredient.supplier && (
            <div className="flex items-center gap-2 text-gray-400">
              <Icon icon={Store} size="xs" className="text-gray-500" aria-hidden={true} />
              <span>{ingredient.supplier}</span>
            </div>
          )}
          {ingredient.pack_size && (
            <div className="flex items-center gap-2 text-gray-400">
              <Icon icon={MapPin} size="xs" className="text-gray-500" aria-hidden={true} />
              <span>
                {ingredient.pack_size} {packSizeUnit}
                {showUnitTooltip && (
                  <span className="ml-1 text-xs text-gray-500">
                    (std: {standardUnit})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isLowStock ? 'text-red-400' : 'text-gray-300'}`}>
              Stock: {ingredient.current_stock || 0} {ingredient.unit || ''}
            </span>
            {isLowStock && (
              <span className="inline-flex items-center rounded-full bg-red-900/20 px-2 py-1 text-xs font-medium text-red-400">
                Low Stock
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            disabled={isSelectionMode}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 disabled:opacity-50 ${
              isSelectionMode ? 'cursor-not-allowed' : ''
            }`}
            aria-label={`Edit ${ingredient.ingredient_name}`}
          >
            <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={deletingId === ingredient.id || isSelectionMode}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 disabled:opacity-50 ${
              isSelectionMode ? 'cursor-not-allowed' : ''
            }`}
            aria-label={`Delete ${ingredient.ingredient_name}`}
          >
            {deletingId === ingredient.id ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Icon icon={Trash2} size="sm" className="text-white" aria-hidden={true} />
                <span>Delete</span>
              </>
            )}
          </button>
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
