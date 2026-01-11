'use client';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { logger } from '@/lib/logger';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIngredientActions } from '../hooks/useIngredientActions';
import { useIngredientBulkUpdate } from '../hooks/useIngredientBulkUpdate';
import { useIngredientData } from '../hooks/useIngredientData';
import { useIngredientEditSave } from '../hooks/useIngredientEditSave';
import { useIngredientFiltering, type SortOption } from '../hooks/useIngredientFiltering';
import { useIngredientFormState } from '../hooks/useIngredientFormState';
import { useIngredientMigration } from '../hooks/useIngredientMigration';
import { useIngredientsQuery } from '../hooks/useIngredientsQuery';
import { useRegionalUnits } from '../hooks/useRegionalUnits';
import { useSelectionMode } from '../hooks/useSelectionMode';
import CSVImportModal from './CSVImportModal';
import IngredientEditDrawer from './IngredientEditDrawer';
import IngredientPagination from './IngredientPagination';
import IngredientTableWithFilters from './IngredientTableWithFilters';
import IngredientWizard from './IngredientWizard';
import { IngredientsBulkActions } from './IngredientsClient/components/IngredientsBulkActions';
import { IngredientsErrorBanner } from './IngredientsClient/components/IngredientsErrorBanner';
import { IngredientsHeader } from './IngredientsClient/components/IngredientsHeader';
import { useAutoCategorization } from './IngredientsClient/helpers/useAutoCategorization';
import { usePagination } from './IngredientsClient/helpers/usePagination';
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
  category?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}
interface IngredientsClientProps {
  hideHeader?: boolean;
}
export default function IngredientsClient({ hideHeader = false }: IngredientsClientProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    isSelectionMode,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
  } = useSelectionMode();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [displayUnit, setDisplayUnit] = useState('g');
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [storageFilter, setStorageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const { availableUnits } = useRegionalUnits();
  const { suppliers, loading, error, setError } = useIngredientData();
  const {
    showAddForm,
    setShowAddForm,
    editingIngredient,
    setEditingIngredient,
    showCSVImport,
    setShowCSVImport,
    setCsvData,
    parsedIngredients,
    setParsedIngredients,
    importing,
    setImporting,
    setWizardStep,
    resetWizard,
    resetCSVImport,
    setNewIngredient,
  } = useIngredientFormState();
  const { filteredIngredients } = useIngredientFiltering({
    ingredients,
    searchTerm,
    supplierFilter,
    storageFilter,
    categoryFilter,
    sortBy,
  });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const {
    data: ingredientsData,
    isLoading,
    refetch: refetchIngredients,
  } = useIngredientsQuery(1, 10000);
  useEffect(
    () => setPage(1),
    [itemsPerPage, searchTerm, supplierFilter, storageFilter, categoryFilter],
  );
  useIngredientMigration(loading, isLoading, ingredientsData);
  useEffect(() => {
    const active = loading || isLoading;
    if (active) startLoadingGate('ingredients');
    else stopLoadingGate('ingredients');
    return () => stopLoadingGate('ingredients');
  }, [loading, isLoading]);
  useEffect(() => {
    if (ingredientsData?.items) setIngredients(ingredientsData.items as Ingredient[]);
  }, [ingredientsData]);
  // Check for action=new query parameter and open wizard
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' && !showAddForm) {
      setShowAddForm(true);
      resetWizard();
      // Clean up URL by removing query parameter
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, showAddForm, setShowAddForm, resetWizard, router]);
  const {
    handleAddIngredient,
    handleUpdateIngredient,
    handleDeleteIngredient,
    handleBulkDelete,
    exportToCSV,
    handleCSVImport: handleCSVImportAction,
    handleSelectIngredient,
    handleSelectAll,
  } = useIngredientActions({
    ingredients,
    setIngredients,
    setError,
    setShowAddForm,
    setWizardStep,
    setNewIngredient,
    setEditingIngredient,
    setShowCSVImport,
    setCsvData,
    setParsedIngredients,
    setSelectedIngredients,
    selectedIngredients,
    filteredIngredients,
  });
  const { handleBulkUpdate, handleBulkAutoCategorize, handleCategorizeAllUncategorized } =
    useIngredientBulkUpdate({
      ingredients,
      setIngredients,
      setSelectedIngredients,
      exitSelectionMode,
    });
  useAutoCategorization({
    ingredients,
    isLoading,
    handleCategorizeAllUncategorized,
    refetchIngredients,
  });
  const { handleSave: handleEditSave } = useIngredientEditSave({
    setIngredients,
    setEditingIngredient,
    setError,
  });
  const handleCSVImport = async () => {
    setImporting(true);
    try {
      await handleCSVImportAction(parsedIngredients);
    } catch (err) {
      logger.error('[IngredientsClient] Error importing CSV:', {
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setImporting(false);
    }
  };
  const filteredTotal = filteredIngredients?.length || 0;
  const { totalPages, startIndex } = usePagination({ filteredTotal, itemsPerPage, page });
  const paginatedIngredients =
    filteredIngredients?.slice(startIndex, startIndex + itemsPerPage) || [];
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
    if (page > totalPages && totalPages > 0) setPage(1);
    if (isSelectionMode && selectedIngredients.size === 0) exitSelectionMode();
  }, [page, totalPages, isSelectionMode, selectedIngredients.size, exitSelectionMode]);
  if (loading || isLoading) return <PageSkeleton />;
  return <>
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
            logger.error('[IngredientsClient] Error saving ingredient:', { error: err instanceof Error ? err.message : String(err), ingredientId: editingIngredient.id });
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
    </>;
}