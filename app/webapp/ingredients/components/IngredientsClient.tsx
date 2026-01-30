'use client';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { logger } from '@/lib/logger';
import CSVImportModal from './CSVImportModal';
import IngredientEditDrawer from './IngredientEditDrawer';
import IngredientPagination from './IngredientPagination';
import IngredientTableWithFilters from './IngredientTableWithFilters';
import IngredientWizard from './IngredientWizard';
import { IngredientsBulkActions } from './IngredientsClient/components/IngredientsBulkActions';
import { IngredientsErrorBanner } from './IngredientsClient/components/IngredientsErrorBanner';
import { IngredientsHeader } from './IngredientsClient/components/IngredientsHeader';
import { Ingredient, useIngredientsClientController } from './hooks/useIngredientsClientController';

interface IngredientsClientProps {
  hideHeader?: boolean;
}

export default function IngredientsClient({ hideHeader = false }: IngredientsClientProps = {}) {
  const {
    loading,
    isLoading,
    error,
    isHydrated,
    ingredients,
    isSelectionMode,
    selectedIngredients,
    handleSelectIngredient,
    handleSelectAll,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
    displayUnit,
    setDisplayUnit,
    searchTerm,
    setSearchTerm,
    supplierFilter,
    setSupplierFilter,
    storageFilter,
    setStorageFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    filteredTotal,
    paginatedIngredients,
    showAddForm,
    setShowAddForm,
    editingIngredient,
    setEditingIngredient,
    showCSVImport,
    setShowCSVImport,
    importing,
    resetWizard,
    resetCSVImport,
    handleAddIngredient,
    handleDeleteIngredient,
    handleBulkDelete,
    handleBulkUpdate,
    handleBulkAutoCategorize,
    handleEditSave,
    handleCSVImport,
    exportToCSV,
    refetchIngredients,
    suppliers,
    availableUnits,
  } = useIngredientsClientController();

  if (loading || isLoading) {
    return (
      <ResponsivePageContainer>
        <div className="space-y-4">
          {!hideHeader && (
            <div className="mb-6 flex items-center justify-between">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
              <div className="h-10 w-32 animate-pulse rounded-lg bg-[var(--muted)]" />
            </div>
          )}
          <TableSkeleton rows={10} columns={6} />
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <>
      <IngredientsHeader hideHeader={hideHeader} />
      <IngredientsErrorBanner error={error} />
      <IngredientsBulkActions
        hideHeader={hideHeader}
        onComplete={() => {
          refetchIngredients();
        }}
      />
      {showAddForm && (
        <IngredientWizard
          suppliers={suppliers}
          availableUnits={availableUnits}
          onSave={handleAddIngredient}
          onCancel={() => {
            setShowAddForm(false);
            resetWizard();
          }}
          onAddSupplier={async () => {}}
          loading={loading}
        />
      )}
      {isHydrated && (
        <IngredientPagination
          page={page}
          totalPages={totalPages}
          total={filteredTotal}
          onPageChange={setPage}
          className="mb-4"
        />
      )}
      {(isHydrated || ingredients.length > 0) && (
        <IngredientTableWithFilters
          ingredients={paginatedIngredients}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onBulkAutoCategorize={handleBulkAutoCategorize}
          displayUnit={displayUnit}
          searchTerm={searchTerm}
          supplierFilter={supplierFilter}
          storageFilter={storageFilter}
          categoryFilter={categoryFilter}
          sortBy={sortBy}
          selectedIngredients={selectedIngredients}
          onEdit={setEditingIngredient}
          onDelete={handleDeleteIngredient}
          onSelectIngredient={handleSelectIngredient}
          onSelectAll={handleSelectAll}
          onSearchChange={setSearchTerm}
          onSupplierFilterChange={setSupplierFilter}
          onStorageFilterChange={setStorageFilter}
          onCategoryFilterChange={setCategoryFilter}
          onSortChange={setSortBy}
          onDisplayUnitChange={setDisplayUnit}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalFiltered={filteredTotal}
          onAddIngredient={() => setShowAddForm(true)}
          onImportCSV={() => setShowCSVImport(true)}
          onExportCSV={exportToCSV}
          loading={false}
          isSelectionMode={isSelectionMode}
          onStartLongPress={startLongPress}
          onCancelLongPress={cancelLongPress}
          onEnterSelectionMode={enterSelectionMode}
          onExitSelectionMode={exitSelectionMode}
        />
      )}
      {isHydrated && (
        <IngredientPagination
          page={page}
          totalPages={totalPages}
          total={filteredTotal}
          onPageChange={setPage}
          className="mt-4"
        />
      )}
      <IngredientEditDrawer
        isOpen={!!editingIngredient}
        ingredient={editingIngredient}
        suppliers={suppliers}
        availableUnits={availableUnits}
        onSave={async (ingredientData: Partial<Ingredient>) => {
          if (!editingIngredient?.id) return;
          try {
            await handleEditSave(editingIngredient.id, ingredientData);
          } catch (err) {
            logger.error('[IngredientsClient] Error saving ingredient:', {
              error: err instanceof Error ? err.message : String(err),
              ingredientId: editingIngredient.id,
            });
          }
        }}
        onClose={() => setEditingIngredient(null)}
        loading={loading}
      />
      {showCSVImport && (
        <CSVImportModal
          isOpen={showCSVImport}
          onClose={() => {
            setShowCSVImport(false);
            resetCSVImport();
          }}
          onImport={handleCSVImport}
          loading={importing}
        />
      )}
    </>
  );
}
