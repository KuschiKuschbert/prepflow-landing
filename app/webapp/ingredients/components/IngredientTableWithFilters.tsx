'use client';

import { useState, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { IngredientCard } from './IngredientCard';
import { IngredientTableFilterBar } from './IngredientTableFilterBar';
import { type SortOption } from '../hooks/useIngredientFiltering';
import { IngredientBulkActionsMenu } from './IngredientBulkActionsMenu';
import { IngredientTableDialogs } from './IngredientTableDialogs';
import { IngredientSelectionModeBanner } from './IngredientSelectionModeBanner';
import { IngredientTableHeader } from './IngredientTableHeader';
import { IngredientTableEmptyState } from './IngredientTableEmptyState';
import { IngredientTableDesktop } from './IngredientTableDesktop';
import { useIngredientBulkActionsDialog } from '../hooks/useIngredientBulkActionsDialog';
import { useIngredientTableSort } from '../hooks/useIngredientTableSort';

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
  const selectedCount = selectedIngredients.size;
  const {
    bulkActionLoading,
    showBulkMenu,
    setShowBulkMenu,
    showConfirmDialog,
    setShowConfirmDialog,
    showInputDialog,
    setShowInputDialog,
    inputDialogConfig,
    deleteConfirmId,
    setDeleteConfirmId,
    handleBulkDelete,
    confirmBulkDelete,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
    handleDelete: handleDeleteFromHook,
    confirmDelete: confirmDeleteFromHook,
  } = useIngredientBulkActionsDialog({
    selectedIngredients,
    onBulkDelete,
    onBulkUpdate,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const { handleColumnSort, getSortIcon } = useIngredientTableSort(sortBy, onSortChange);

  const handleDelete = async (id: string): Promise<void> => {
    handleDeleteFromHook(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeletingId(deleteConfirmId);
    try {
      await confirmDeleteFromHook(onDelete);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (ingredients.length === 0 && !loading) {
    return (
      <IngredientTableEmptyState
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
        onAddIngredient={onAddIngredient}
        onImportCSV={onImportCSV}
        onExportCSV={onExportCSV}
      />
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
        itemsPerPage={itemsPerPage}
        onSearchChange={onSearchChange}
        onSupplierFilterChange={onSupplierFilterChange}
        onStorageFilterChange={onStorageFilterChange}
        onSortChange={onSortChange}
        onDisplayUnitChange={onDisplayUnitChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />

      <IngredientTableHeader
        totalFiltered={totalFiltered}
        ingredientsCount={ingredients.length}
        selectedCount={selectedCount}
        selectedIngredients={selectedIngredients}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        onAddIngredient={onAddIngredient}
        onImportCSV={onImportCSV}
        onExportCSV={onExportCSV}
        onBulkDelete={onBulkDelete}
        isSelectionMode={isSelectionMode}
        bulkActionLoading={bulkActionLoading}
        showBulkMenu={showBulkMenu}
        onToggleBulkMenu={() => setShowBulkMenu(!showBulkMenu)}
        onBulkDeleteClick={handleBulkDelete}
        onBulkUpdateSupplier={handleBulkUpdateSupplier}
        onBulkUpdateStorage={handleBulkUpdateStorage}
        onBulkUpdateWastage={handleBulkUpdateWastage}
        onSelectAll={onSelectAll}
        onEnterSelectionMode={onEnterSelectionMode}
      />

      <IngredientSelectionModeBanner
        isSelectionMode={isSelectionMode}
        onExitSelectionMode={() => {
          onSelectAll(false);
          if (onExitSelectionMode) {
            onExitSelectionMode();
          }
        }}
      />

      <div className="block space-y-2 large-desktop:hidden">
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

      <IngredientTableDesktop
        ingredients={ingredients}
        displayUnit={displayUnit}
        selectedIngredients={selectedIngredients}
        totalFiltered={totalFiltered}
        sortBy={sortBy}
        onSelectIngredient={onSelectIngredient}
        onSelectAll={onSelectAll}
        onEdit={onEdit}
        onDelete={onDelete}
        handleDelete={handleDelete}
        deletingId={deletingId}
        isSelectionMode={isSelectionMode}
        onStartLongPress={onStartLongPress}
        onCancelLongPress={onCancelLongPress}
        onEnterSelectionMode={onEnterSelectionMode}
        handleColumnSort={handleColumnSort}
        getSortIcon={getSortIcon}
      />

      <IngredientTableDialogs
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        showInputDialog={showInputDialog}
        setShowInputDialog={setShowInputDialog}
        inputDialogConfig={inputDialogConfig}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={setDeleteConfirmId}
        selectedCount={selectedCount}
        confirmDelete={confirmDelete}
        confirmBulkDelete={confirmBulkDelete}
      />
    </div>
  );
}
