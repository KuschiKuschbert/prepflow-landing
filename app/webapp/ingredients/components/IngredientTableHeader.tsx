'use client';

import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
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
  onBulkUpdate?: (ids: string[], updates: Partial<unknown>) => Promise<void>;
  isSelectionMode: boolean;
  bulkActionLoading: boolean;
  showBulkMenu: boolean;
  onToggleBulkMenu: () => void;
  onBulkDeleteClick: () => void;
  onBulkUpdateSupplier: () => void;
  onBulkUpdateStorage: () => void;
  onBulkUpdateWastage: () => void;
  onBulkAutoCategorize?: () => void;
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
  onBulkAutoCategorize,
  onSelectAll,
  onEnterSelectionMode,
}: IngredientTableHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20 px-6 py-4">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[var(--button-active-text)]">
            Ingredients{' '}
            {totalFiltered !== undefined
              ? `(${totalFiltered} total, showing ${ingredientsCount})`
              : `(${ingredientsCount})`}
          </h2>
          {/* Action Buttons */}
          {onAddIngredient && (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onAddIngredient}
                className="flex items-center gap-1.5"
              >
                <Icon icon={Plus} size="xs" className="text-current" aria-hidden={true} />
                <span>Add</span>
              </Button>
              {onImportCSV && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onImportCSV}
                  className="flex items-center gap-1.5"
                >
                  <Icon icon={Upload} size="xs" className="text-current" aria-hidden={true} />
                  <span>Import</span>
                </Button>
              )}
              {onExportCSV && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportCSV}
                  className="flex items-center gap-1.5"
                >
                  <Icon icon={Download} size="xs" className="text-current" aria-hidden={true} />
                  <span>Export</span>
                </Button>
              )}
              {/* Selection Mode Indicator + Bulk Actions Button - Desktop: in action buttons section */}
              {isSelectionMode && (
                <div className="large-desktop:flex hidden items-center gap-2 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
                  <span className="text-sm font-medium text-[var(--primary)]">Selection Mode</span>
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
                  onBulkAutoCategorize={onBulkAutoCategorize}
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
              className="text-xs whitespace-nowrap text-[var(--foreground-muted)]"
            >
              Show:
            </label>
            <select
              id="items-per-page-header"
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-2.5 py-1.5 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
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
                className="flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1.5 text-sm font-medium text-[var(--primary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/20"
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
                  onBulkAutoCategorize={onBulkAutoCategorize}
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
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1.5 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--primary)]"
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
