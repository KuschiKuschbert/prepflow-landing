'use client';

import { useState, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { IngredientTableRow } from './IngredientTableRow';
import { IngredientCard } from './IngredientCard';
import { IngredientTableFilterBar } from './IngredientTableFilterBar';
import { type SortOption } from '../hooks/useIngredientFiltering';
import { ChevronUp, ChevronDown, Plus, Upload, Download, Zap, Trash2, Store, MapPin, Target } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InputDialog } from '@/components/ui/InputDialog';

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

interface IngredientTableWithFiltersProps {
  ingredients: Ingredient[];
  displayUnit: string;
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  sortBy: SortOption;
  selectedIngredients: Set<string>;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => Promise<void>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSearchChange: (term: string) => void;
  onSupplierFilterChange: (supplier: string) => void;
  onStorageFilterChange: (storage: string) => void;
  onSortChange: (sort: SortOption) => void;
  onDisplayUnitChange: (unit: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalFiltered?: number;
  onAddIngredient?: () => void;
  onImportCSV?: () => void;
  onExportCSV?: () => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkUpdate?: (ids: string[], updates: Partial<Ingredient>) => Promise<void>;
  loading?: boolean;
  isSelectionMode?: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
  onExitSelectionMode?: () => void;
}

export default function IngredientTableWithFilters({
  ingredients,
  displayUnit,
  searchTerm,
  supplierFilter,
  storageFilter,
  sortBy,
  selectedIngredients,
  onEdit,
  onDelete,
  onSelectIngredient,
  onSelectAll,
  onSearchChange,
  onSupplierFilterChange,
  onStorageFilterChange,
  onSortChange,
  onDisplayUnitChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalFiltered,
  onAddIngredient,
  onImportCSV,
  onExportCSV,
  onBulkDelete,
  onBulkUpdate,
  loading = false,
  isSelectionMode = false,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
  onExitSelectionMode,
}: IngredientTableWithFiltersProps) {
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputDialogConfig, setInputDialogConfig] = useState<{
    title: string;
    message: string;
    placeholder?: string;
    type?: 'text' | 'number';
    min?: number;
    max?: number;
    onConfirm: (value: string) => void;
  } | null>(null);

  const selectedCount = selectedIngredients.size;
  const filteredIngredientsData = ingredients; // Use ingredients prop for bulk operations

  const handleBulkDelete = async () => {
    if (selectedCount === 0 || !onBulkDelete) return;
    setShowBulkMenu(false);
    setShowConfirmDialog(true);
  };

  const confirmBulkDelete = async () => {
    if (!onBulkDelete) return;
    setShowConfirmDialog(false);
    setBulkActionLoading(true);
    try {
      await onBulkDelete(Array.from(selectedIngredients));
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkUpdateSupplier = () => {
    if (selectedCount === 0 || !onBulkUpdate) return;
    setShowBulkMenu(false);
    setInputDialogConfig({
      title: 'Update Supplier',
      message: `Enter new supplier for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
      placeholder: 'Supplier name',
      type: 'text',
      onConfirm: async (newSupplier: string) => {
        if (!newSupplier.trim() || !onBulkUpdate) return;
        setShowInputDialog(false);
        setInputDialogConfig(null);
        setBulkActionLoading(true);
        try {
          await onBulkUpdate(Array.from(selectedIngredients), { supplier: newSupplier.trim() });
        } finally {
          setBulkActionLoading(false);
        }
      },
    });
    setShowInputDialog(true);
  };

  const handleBulkUpdateStorage = () => {
    if (selectedCount === 0 || !onBulkUpdate) return;
    setShowBulkMenu(false);
    setInputDialogConfig({
      title: 'Update Storage Location',
      message: `Enter new storage location for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
      placeholder: 'Storage location',
      type: 'text',
      onConfirm: async (newStorage: string) => {
        if (!newStorage.trim() || !onBulkUpdate) return;
        setShowInputDialog(false);
        setInputDialogConfig(null);
        setBulkActionLoading(true);
        try {
          await onBulkUpdate(Array.from(selectedIngredients), { storage_location: newStorage.trim() });
        } finally {
          setBulkActionLoading(false);
        }
      },
    });
    setShowInputDialog(true);
  };

  const handleBulkUpdateWastage = () => {
    if (selectedCount === 0 || !onBulkUpdate) return;
    setShowBulkMenu(false);
    setInputDialogConfig({
      title: 'Update Wastage Percentage',
      message: `Enter wastage percentage (0-100) for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
      placeholder: '0-100',
      type: 'number',
      min: 0,
      max: 100,
      onConfirm: async (wastageInput: string) => {
        if (!onBulkUpdate) return;
        const wastage = parseFloat(wastageInput);
        if (isNaN(wastage) || wastage < 0 || wastage > 100) {
          return; // Validation handled by InputDialog
        }
        setShowInputDialog(false);
        setInputDialogConfig(null);
        setBulkActionLoading(true);
        try {
          await onBulkUpdate(Array.from(selectedIngredients), {
            trim_peel_waste_percentage: wastage,
            yield_percentage: 100 - wastage,
          });
        } finally {
          setBulkActionLoading(false);
        }
      },
    });
    setShowInputDialog(true);
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleColumnSort = (column: 'name' | 'brand' | 'pack_size' | 'cost' | 'supplier' | 'stock') => {
    const currentAsc = `${column}_asc` as SortOption;
    const currentDesc = `${column}_desc` as SortOption;

    if (sortBy === currentAsc) {
      onSortChange(currentDesc);
    } else {
      onSortChange(currentAsc);
    }
  };

  const getSortIcon = (column: 'name' | 'brand' | 'pack_size' | 'cost' | 'supplier' | 'stock') => {
    const currentAsc = `${column}_asc` as SortOption;
    const currentDesc = `${column}_desc` as SortOption;

    if (sortBy === currentAsc) {
      return <Icon icon={ChevronUp} size="xs" className="ml-1 text-[#29E7CD]" />;
    }
    if (sortBy === currentDesc) {
      return <Icon icon={ChevronDown} size="xs" className="ml-1 text-[#29E7CD]" />;
    }
    return null;
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string): Promise<void> => {
    setDeleteConfirmId(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setShowConfirmDialog(false);
    setDeletingId(deleteConfirmId);
    try {
      await onDelete(deleteConfirmId);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const filteredIngredients = ingredients;

  if (filteredIngredients.length === 0 && !loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
        <IngredientTableFilterBar
          ingredients={ingredients}
          searchTerm={searchTerm}
          supplierFilter={supplierFilter}
          storageFilter={storageFilter}
          sortBy={sortBy}
          displayUnit={displayUnit}
          itemsPerPage={itemsPerPage}
          onSearchChange={onSearchChange}
          onSupplierFilterChange={onSupplierFilterChange}
          onStorageFilterChange={onStorageFilterChange}
          onSortChange={onSortChange}
          onDisplayUnitChange={onDisplayUnitChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />

        {/* Empty State */}
        <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Ingredients (0)</h2>
            {/* Action Buttons */}
            {onAddIngredient && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onAddIngredient}
                  className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
                >
                  + Add
                </button>
                {onImportCSV && (
                  <button
                    onClick={onImportCSV}
                    className="rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
                  >
                    📁 Import
                  </button>
                )}
                {onExportCSV && (
                  <button
                    onClick={onExportCSV}
                    className="rounded-lg bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
                  >
                    📤 Export
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="mb-4 text-gray-400">
            <svg className="mx-auto mb-4 h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-white">No Ingredients Found</h3>
            <p className="text-gray-400">
              {searchTerm || supplierFilter || storageFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Start by adding your first ingredient to get started.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <IngredientTableFilterBar
        ingredients={ingredients}
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        sortBy={sortBy}
        displayUnit={displayUnit}
        onSearchChange={onSearchChange}
        onSupplierFilterChange={onSupplierFilterChange}
        onStorageFilterChange={onStorageFilterChange}
        onSortChange={onSortChange}
        onDisplayUnitChange={onDisplayUnitChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
      />

      {/* Table Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              Ingredients {totalFiltered !== undefined ? `(${totalFiltered} total, showing ${ingredients.length})` : `(${ingredients.length})`}
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
                {/* Bulk Actions Button - Desktop: in action buttons section */}
                {selectedCount > 0 && onBulkDelete && (
                  <div className="relative z-[60] hidden md:block">
                    <button
                      onClick={() => setShowBulkMenu(!showBulkMenu)}
                      disabled={bulkActionLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-500/80 hover:to-red-500/80 hover:shadow-xl disabled:opacity-50"
                    >
                      <Icon icon={Zap} size="xs" className="text-current" aria-hidden={true} />
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

                              {onBulkUpdate && (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedIngredients.size > 0 ? (
              <>
                <button
                  onClick={() => onSelectAll(false)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1.5 text-sm font-medium text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20 hover:border-[#29E7CD]/50"
                  aria-label="Deselect all ingredients"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{selectedIngredients.size} selected</span>
                </button>
                {/* Bulk Actions Button - Mobile: next to selected count */}
                {selectedCount > 0 && onBulkDelete && (
                  <div className="relative z-[60] md:hidden">
                    <button
                      onClick={() => setShowBulkMenu(!showBulkMenu)}
                      disabled={bulkActionLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-500/80 hover:to-red-500/80 hover:shadow-xl disabled:opacity-50"
                    >
                      <Icon icon={Zap} size="xs" className="text-current" aria-hidden={true} />
                      <span>Actions</span>
                    </button>

                    {showBulkMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-[55]"
                          onClick={() => setShowBulkMenu(false)}
                          aria-hidden={true}
                        />
                        <div className="absolute top-full right-0 z-[60] mt-1.5 w-64 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
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

                              {onBulkUpdate && (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  onSelectAll(true);
                  // Enter selection mode when selecting all
                  if (onEnterSelectionMode) {
                    onEnterSelectionMode();
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
                aria-label="Select all ingredients"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Select All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selection Mode Indicator */}
      {isSelectionMode && (
        <div className="bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 border-b border-[#29E7CD]/30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#29E7CD] animate-pulse" />
              <span className="text-sm font-medium text-[#29E7CD]">
                Selection Mode - Tap items to select
              </span>
            </div>
            <button
              onClick={() => {
                // Exit selection mode by clearing all selections
                onSelectAll(false);
                // Call exit handler if available
                if (onExitSelectionMode) {
                  onExitSelectionMode();
                }
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-2">
        {ingredients.map(ingredient => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            displayUnit={displayUnit}
            selectedIngredients={selectedIngredients}
            onSelectIngredient={onSelectIngredient}
            onEdit={onEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            isSelectionMode={isSelectionMode}
            onStartLongPress={onStartLongPress}
            onCancelLongPress={onCancelLongPress}
            onEnterSelectionMode={onEnterSelectionMode}
          />
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => {
                    const allSelected = totalFiltered !== undefined
                      ? selectedIngredients.size === totalFiltered && totalFiltered > 0
                      : selectedIngredients.size === ingredients.length && ingredients.length > 0;
                    onSelectAll(!allSelected);
                    // Enter selection mode when selecting all
                    if (!allSelected && onEnterSelectionMode) {
                      onEnterSelectionMode();
                    }
                  }}
                  className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                  aria-label={
                    totalFiltered !== undefined && selectedIngredients.size === totalFiltered && totalFiltered > 0
                      ? "Deselect all"
                      : "Select all"
                  }
                >
                  {(totalFiltered !== undefined
                    ? selectedIngredients.size === totalFiltered && totalFiltered > 0
                    : selectedIngredients.size === ingredients.length && ingredients.length > 0) ? (
                    <svg className="h-4 w-4 text-[#29E7CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('name')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                >
                  Name
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('brand')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                >
                  Brand
                  {getSortIcon('brand')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('pack_size')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                >
                  Pack Size
                  {getSortIcon('pack_size')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('cost')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                >
                  Cost/Unit
                  {getSortIcon('cost')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('supplier')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                >
                  Supplier
                  {getSortIcon('supplier')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('stock')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                >
                  Stock
                  {getSortIcon('stock')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {ingredients.map(ingredient => (
              <IngredientTableRow
                key={ingredient.id}
                ingredient={ingredient}
                displayUnit={displayUnit}
                selectedIngredients={selectedIngredients}
                onSelectIngredient={onSelectIngredient}
                onEdit={onEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
                isSelectionMode={isSelectionMode}
                onStartLongPress={onStartLongPress}
                onCancelLongPress={onCancelLongPress}
                onEnterSelectionMode={onEnterSelectionMode}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={deleteConfirmId ? 'Delete Ingredient' : `Delete ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}`}
        message={
          deleteConfirmId
            ? 'Are you sure you want to delete this ingredient? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={deleteConfirmId ? confirmDelete : confirmBulkDelete}
        onCancel={() => {
          setShowConfirmDialog(false);
          setDeleteConfirmId(null);
        }}
        variant="danger"
      />

      {/* Input Dialog for Bulk Updates */}
      {inputDialogConfig && (
        <InputDialog
          isOpen={showInputDialog}
          title={inputDialogConfig.title}
          message={inputDialogConfig.message}
          placeholder={inputDialogConfig.placeholder}
          type={inputDialogConfig.type}
          min={inputDialogConfig.min}
          max={inputDialogConfig.max}
          confirmLabel="Update"
          cancelLabel="Cancel"
          onConfirm={inputDialogConfig.onConfirm}
          onCancel={() => {
            setShowInputDialog(false);
            setInputDialogConfig(null);
          }}
          variant="info"
        />
      )}
    </div>
  );
}
