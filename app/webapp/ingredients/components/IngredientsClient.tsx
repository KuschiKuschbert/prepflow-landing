'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { useEffect, useState } from 'react';

// Direct imports to eliminate skeleton flashes
import { useTranslation } from '@/lib/useTranslation';
import { Package } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PageHeader } from '../../components/static/PageHeader';
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
import IngredientTableWithFilters from './IngredientTableWithFilters';
import IngredientWizard from './IngredientWizard';

// Import IngredientPagination as client-only to prevent hydration mismatches
const IngredientPagination = dynamic(() => import('./IngredientPagination'), {
  ssr: false,
  loading: () => (
    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm text-gray-400">Loading...</span>
      <div className="space-x-2">
        <button disabled className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white opacity-50">
          Prev
        </button>
        <button disabled className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white opacity-50">
          Next
        </button>
      </div>
    </div>
  ),
});

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

interface Supplier {
  id: string;
  supplier_name?: string;
  name?: string;
  created_at?: string;
}

interface IngredientsClientProps {
  hideHeader?: boolean;
}

export default function IngredientsClient({ hideHeader = false }: IngredientsClientProps = {}) {
  const { t } = useTranslation();
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
    csvData,
    setCsvData,
    parsedIngredients,
    setParsedIngredients,
    importing,
    setImporting,
    wizardStep,
    setWizardStep,
    newIngredient,
    setNewIngredient,
    resetWizard,
    resetCSVImport,
  } = useIngredientFormState();
  const { filteredIngredients } = useIngredientFiltering({
    ingredients,
    searchTerm,
    supplierFilter,
    storageFilter,
    sortBy,
  });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const {
    data: ingredientsData,
    isLoading,
    error: queryError,
    refetch: refetchIngredients,
  } = useIngredientsQuery(1, 10000);
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage, searchTerm, supplierFilter, storageFilter]);
  useIngredientMigration(loading, isLoading, ingredientsData);
  useEffect(() => {
    const active = loading || isLoading;
    if (active) {
      startLoadingGate('ingredients');
    } else {
      stopLoadingGate('ingredients');
    }
    return () => {
      stopLoadingGate('ingredients');
    };
  }, [loading, isLoading]);
  useEffect(() => {
    if (ingredientsData?.items) setIngredients(ingredientsData.items as Ingredient[]);
  }, [ingredientsData]);
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
  const { handleBulkUpdate } = useIngredientBulkUpdate({
    refetchIngredients,
    setSelectedIngredients,
    exitSelectionMode,
  });
  const { handleSave: handleEditSave } = useIngredientEditSave({
    setIngredients,
    setEditingIngredient,
    setError,
  });
  const handleCSVImport = async () => {
    setImporting(true);
    await handleCSVImportAction(parsedIngredients);
    setImporting(false);
  };
  const filteredTotal = filteredIngredients?.length || 0;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIngredients = filteredIngredients?.slice(startIndex, endIndex) || [];
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [page, totalPages]);
  useEffect(() => {
    if (isSelectionMode && selectedIngredients.size === 0) exitSelectionMode();
  }, [selectedIngredients.size, isSelectionMode, exitSelectionMode]);
  if (loading || isLoading) return <PageSkeleton />;
  const translateText = (key: string, fallback: string): string => {
    const result = t(key, fallback);
    return Array.isArray(result) ? result.join('') : result;
  };
  return (
    <>
      {!hideHeader && (
        <PageHeader
          title={translateText('ingredients.title', 'Ingredients Management')}
          subtitle={translateText(
            'ingredients.subtitle',
            'Manage your kitchen ingredients and inventory',
          )}
          icon={Package}
        />
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-900/20 px-4 py-3 text-red-400">
          {error}
        </div>
      )}
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
      <IngredientPagination
        page={page}
        totalPages={totalPages}
        total={filteredTotal}
        onPageChange={setPage}
        className="mb-4"
      />
      <IngredientTableWithFilters
        ingredients={paginatedIngredients}
        onBulkDelete={handleBulkDelete}
        onBulkUpdate={handleBulkUpdate}
        displayUnit={displayUnit}
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        sortBy={sortBy}
        selectedIngredients={selectedIngredients}
        onEdit={setEditingIngredient}
        onDelete={handleDeleteIngredient}
        onSelectIngredient={handleSelectIngredient}
        onSelectAll={handleSelectAll}
        onSearchChange={setSearchTerm}
        onSupplierFilterChange={setSupplierFilter}
        onStorageFilterChange={setStorageFilter}
        onSortChange={setSortBy}
        onDisplayUnitChange={setDisplayUnit}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalFiltered={filteredTotal}
        onAddIngredient={() => setShowAddForm(true)}
        onImportCSV={() => setShowCSVImport(true)}
        onExportCSV={exportToCSV}
        loading={loading}
        isSelectionMode={isSelectionMode}
        onStartLongPress={startLongPress}
        onCancelLongPress={cancelLongPress}
        onEnterSelectionMode={enterSelectionMode}
        onExitSelectionMode={exitSelectionMode}
      />
      <IngredientPagination
        page={page}
        totalPages={totalPages}
        total={filteredTotal}
        onPageChange={setPage}
        className="mt-4"
      />
      <IngredientEditDrawer
        isOpen={!!editingIngredient}
        ingredient={editingIngredient}
        suppliers={suppliers}
        availableUnits={availableUnits}
        onSave={async (ingredientData: Partial<Ingredient>) => {
          if (!editingIngredient?.id) return;
          await handleEditSave(editingIngredient.id, ingredientData);
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
