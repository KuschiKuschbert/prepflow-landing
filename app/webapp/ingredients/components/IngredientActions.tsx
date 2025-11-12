'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { Trash2, Store, MapPin, Target, Zap } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface IngredientActionsProps {
  selectedIngredients: Set<string>;
  filteredIngredients: Ingredient[];
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkUpdate: (ids: string[], updates: Partial<Ingredient>) => Promise<void>;
  loading?: boolean;
}

export default function IngredientActions({
  selectedIngredients,
  filteredIngredients,
  onBulkDelete,
  onBulkUpdate,
  loading = false,
}: IngredientActionsProps) {
  const { t } = useTranslation();
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const selectedCount = selectedIngredients.size;
  const selectedIngredientsData = filteredIngredients.filter(ingredient =>
    selectedIngredients.has(ingredient.id),
  );

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    setBulkActionLoading(true);
    try {
      await onBulkDelete(Array.from(selectedIngredients));
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkUpdateSupplier = async () => {
    if (selectedCount === 0) return;

    const newSupplier = window.prompt(
      `Enter new supplier for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
    );
    if (!newSupplier?.trim()) return;

    setBulkActionLoading(true);
    try {
      await onBulkUpdate(Array.from(selectedIngredients), { supplier: newSupplier.trim() });
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkUpdateStorage = async () => {
    if (selectedCount === 0) return;

    const newStorage = window.prompt(
      `Enter new storage location for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
    );
    if (!newStorage?.trim()) return;

    setBulkActionLoading(true);
    try {
      await onBulkUpdate(Array.from(selectedIngredients), { storage_location: newStorage.trim() });
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkUpdateWastage = async () => {
    if (selectedCount === 0) return;

    const wastageInput = window.prompt(
      `Enter wastage percentage (0-100) for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
    );
    if (!wastageInput) return;

    const wastage = parseFloat(wastageInput);
    if (isNaN(wastage) || wastage < 0 || wastage > 100) {
      alert('Please enter a valid percentage between 0 and 100');
      return;
    }

    setBulkActionLoading(true);
    try {
      await onBulkUpdate(Array.from(selectedIngredients), {
        trim_peel_waste_percentage: wastage,
        yield_percentage: 100 - wastage,
      });
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBulkMenu) {
        setShowBulkMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showBulkMenu]);

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="relative z-[60]">
          <button
            onClick={() => setShowBulkMenu(!showBulkMenu)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-500/80 hover:to-red-500/80 hover:shadow-xl"
          >
            <Icon icon={Zap} size="sm" className="text-current" aria-hidden={true} />
            <span>Bulk Actions ({selectedCount})</span>
          </button>

          {showBulkMenu && (
            <>
              <div
                className="fixed inset-0 z-[55]"
                onClick={() => setShowBulkMenu(false)}
                aria-hidden={true}
              />
              <div className="absolute top-full left-0 z-[60] mt-1.5 w-64 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
                <div className="p-1.5">
                  <div className="border-b border-[#2a2a2a] px-2.5 py-1.5 text-xs text-gray-400">
                    {selectedCount} ingredient{selectedCount > 1 ? 's' : ''} selected
                  </div>

                  <div className="mt-1.5 space-y-0.5">
                    <button
                      onClick={handleBulkDelete}
                      disabled={bulkActionLoading}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Icon icon={Trash2} size="xs" className="text-red-400" aria-hidden={true} />
                      <span>Delete Selected</span>
                    </button>

                    <button
                      onClick={handleBulkUpdateSupplier}
                      disabled={bulkActionLoading}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
                    >
                      <Icon icon={Store} size="xs" className="text-current" aria-hidden={true} />
                      <span>Update Supplier</span>
                    </button>

                    <button
                      onClick={handleBulkUpdateStorage}
                      disabled={bulkActionLoading}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
                    >
                      <Icon icon={MapPin} size="xs" className="text-current" aria-hidden={true} />
                      <span>Update Storage Location</span>
                    </button>

                    <button
                      onClick={handleBulkUpdateWastage}
                      disabled={bulkActionLoading}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
                    >
                      <Icon icon={Target} size="xs" className="text-current" aria-hidden={true} />
                      <span>Update Wastage %</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {(loading || bulkActionLoading) && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent"></div>
          <span className="text-sm">{bulkActionLoading ? 'Processing...' : 'Loading...'}</span>
        </div>
      )}

      {/* Selected Items Summary */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Selected:</span>
          <span className="font-medium text-[#29E7CD]">{selectedCount}</span>
          <span>of</span>
          <span className="font-medium text-white">{filteredIngredients.length}</span>
        </div>
      )}
    </div>
  );
}
