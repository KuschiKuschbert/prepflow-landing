'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { MapPin, Store, Target, Trash2, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBulkActions } from './hooks/useBulkActions';
interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  category?: string;
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
  const { t: _t } = useTranslation();

  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const selectedCount = selectedIngredients.size;

  const {
    bulkActionLoading,
    handleBulkDelete,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
    ConfirmDialog,
    InputDialog,
    AlertDialog,
  } = useBulkActions({
    selectedIngredients,
    onBulkDelete,
    onBulkUpdate,
    onComplete: () => setShowBulkMenu(false),
  });

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
    <>
      <ConfirmDialog />
      <InputDialog />
      <AlertDialog />
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="relative z-[60]">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-orange-500/80 hover:to-red-500/80 hover:shadow-xl"
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
                <div className="absolute top-full left-0 z-[60] mt-1.5 w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                  <div className="p-1.5">
                    <div className="border-b border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--foreground-muted)]">
                      {selectedCount} ingredient{selectedCount > 1 ? 's' : ''} selected
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      <button
                        onClick={handleBulkDelete}
                        disabled={bulkActionLoading}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10 disabled:opacity-50"
                      >
                        <Icon
                          icon={Trash2}
                          size="xs"
                          className="text-[var(--color-error)]"
                          aria-hidden={true}
                        />
                        <span>Delete Selected</span>
                      </button>

                      <button
                        onClick={handleBulkUpdateSupplier}
                        disabled={bulkActionLoading}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                      >
                        <Icon icon={Store} size="xs" className="text-current" aria-hidden={true} />
                        <span>Update Supplier</span>
                      </button>

                      <button
                        onClick={handleBulkUpdateStorage}
                        disabled={bulkActionLoading}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                      >
                        <Icon icon={MapPin} size="xs" className="text-current" aria-hidden={true} />
                        <span>Update Storage Location</span>
                      </button>

                      <button
                        onClick={handleBulkUpdateWastage}
                        disabled={bulkActionLoading}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
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
          <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent"></div>
            <span className="text-sm">{bulkActionLoading ? 'Processing...' : 'Loading...'}</span>
          </div>
        )}

        {/* Selected Items Summary */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span>Selected:</span>
            <span className="font-medium text-[var(--primary)]">{selectedCount}</span>
            <span>of</span>
            <span className="font-medium text-[var(--foreground)]">
              {filteredIngredients.length}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
