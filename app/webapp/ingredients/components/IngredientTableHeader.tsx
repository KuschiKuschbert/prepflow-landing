'use client';

import { Icon } from '@/components/ui/Icon';
import { Plus, Upload, Download } from 'lucide-react';
import { IngredientBulkActionsMenu } from './IngredientBulkActionsMenu';

interface IngredientTableHeaderProps {
  totalFiltered?: number;
  ingredientsCount: number;
  selectedCount: number;
  selectedIngredients: Set<string>;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onAddIngredient?: () => void;
  onImportCSV?: () => void;
  onExportCSV?: () => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkUpdate?: (ids: string[], updates: Partial<any>) => Promise<void>;
  isSelectionMode: boolean;
  bulkActionLoading: boolean;
  showBulkMenu: boolean;
  onToggleBulkMenu: () => void;
  onBulkDeleteClick: () => void;
  onBulkUpdateSupplier: () => void;
  onBulkUpdateStorage: () => void;
  onBulkUpdateWastage: () => void;
  onSelectAll: (selected: boolean) => void;
  onEnterSelectionMode?: () => void;
}

export function IngredientTableHeader({
  totalFiltered,
  ingredientsCount,
  selectedCount,
  selectedIngredients,
  itemsPerPage,
  onItemsPerPageChange,
  onAddIngredient,
  onImportCSV,
  onExportCSV,
  onBulkDelete,
  isSelectionMode,
  bulkActionLoading,
  showBulkMenu,
  onToggleBulkMenu,
  onBulkDeleteClick,
  onBulkUpdateSupplier,
  onBulkUpdateStorage,
  onBulkUpdateWastage,
  onSelectAll,
  onEnterSelectionMode,
}: IngredientTableHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">
            Ingredients{' '}
            {totalFiltered !== undefined
              ? `(${totalFiltered} total, showing ${ingredientsCount})`
              : `(${ingredientsCount})`}
          </h2>
          {/* Action Buttons */}
          {onAddIngredient && (
            <div className="flex items-center gap-2">
              <button
                onClick={onAddIngredient}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
              >
                <Icon icon={Plus} size="xs" className="text-current" aria-hidden={true} />
                <span>Add</span>
              </button>
              {onImportCSV && (
                <button
                  onClick={onImportCSV}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
                >
                  <Icon icon={Upload} size="xs" className="text-current" aria-hidden={true} />
                  <span>Import</span>
                </button>
              )}
              {onExportCSV && (
                <button
                  onClick={onExportCSV}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
                >
                  <Icon icon={Download} size="xs" className="text-current" aria-hidden={true} />
                  <span>Export</span>
                </button>
              )}
              {/* Selection Mode Indicator + Bulk Actions Button - Desktop: in action buttons section */}
              {isSelectionMode && (
                <div className="large-desktop:flex hidden items-center gap-2 rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#29E7CD]" />
                  <span className="text-sm font-medium text-[#29E7CD]">Selection Mode</span>
                </div>
              )}
              {selectedCount > 0 && onBulkDelete && (
                <IngredientBulkActionsMenu
                  selectedCount={selectedCount}
                  bulkActionLoading={bulkActionLoading}
                  onBulkDelete={onBulkDeleteClick}
                  onBulkUpdateSupplier={onBulkUpdateSupplier}
                  onBulkUpdateStorage={onBulkUpdateStorage}
                  onBulkUpdateWastage={onBulkUpdateWastage}
                  showBulkMenu={showBulkMenu}
                  onToggleBulkMenu={onToggleBulkMenu}
                  variant="desktop"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="items-per-page-header"
              className="text-xs whitespace-nowrap text-gray-400"
            >
              Show:
            </label>
            <select
              id="items-per-page-header"
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
              className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-2.5 py-1.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              title="Items per page"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
          {selectedIngredients.size > 0 ? (
            <>
              <button
                onClick={() => onSelectAll(false)}
                className="flex items-center gap-1.5 rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1.5 text-sm font-medium text-[#29E7CD] transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20"
                aria-label="Deselect all ingredients"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{selectedIngredients.size} selected</span>
              </button>
              {/* Bulk Actions Button - Mobile: next to selected count */}
              {selectedCount > 0 && onBulkDelete && (
                <IngredientBulkActionsMenu
                  selectedCount={selectedCount}
                  bulkActionLoading={bulkActionLoading}
                  onBulkDelete={onBulkDeleteClick}
                  onBulkUpdateSupplier={onBulkUpdateSupplier}
                  onBulkUpdateStorage={onBulkUpdateStorage}
                  onBulkUpdateWastage={onBulkUpdateWastage}
                  showBulkMenu={showBulkMenu}
                  onToggleBulkMenu={onToggleBulkMenu}
                  variant="mobile"
                />
              )}
            </>
          ) : (
            <button
              onClick={() => {
                onSelectAll(true);
                if (onEnterSelectionMode) {
                  onEnterSelectionMode();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
              aria-label="Select all ingredients"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Select All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
