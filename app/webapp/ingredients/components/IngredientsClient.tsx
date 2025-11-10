'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// Direct imports to eliminate skeleton flashes
import { useIngredientActions } from '../hooks/useIngredientActions';
import { useIngredientData } from '../hooks/useIngredientData';
import { useIngredientFiltering } from '../hooks/useIngredientFiltering';
import { useIngredientFormState } from '../hooks/useIngredientFormState';
import { useIngredientsQuery } from '../hooks/useIngredientsQuery';
import CSVImportModal from './CSVImportModal';
import IngredientActions from './IngredientActions';
import IngredientFilters from './IngredientFilters';
import IngredientForm from './IngredientForm';
import IngredientPagination from './IngredientPagination';
import IngredientTable from './IngredientTable';
import IngredientWizard from './IngredientWizard';
import { useTranslation } from '@/lib/useTranslation';
import { PageHeader } from '../../components/static/PageHeader';
import { AVAILABLE_UNITS } from './ingredient-units';
import { DisplayUnitSelect } from './DisplayUnitSelect';

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
  supplier_name?: string; // Actual column name in database
  name?: string; // Fallback for compatibility
  created_at?: string;
}

export default function IngredientsClient() {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [displayUnit, setDisplayUnit] = useState('g');
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [storageFilter, setStorageFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cost_asc' | 'cost_desc' | 'supplier'>('name');

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
  const pageSize = 20;
  const {
    data: ingredientsData,
    isLoading,
    error: queryError,
  } = useIngredientsQuery(page, pageSize);

  // Gate the arcade overlay while initial data loads
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
    if (ingredientsData?.items) {
      setIngredients(ingredientsData.items as Ingredient[]);
    }
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

  const handleCSVImport = async () => {
    setImporting(true);
    await handleCSVImportAction(parsedIngredients);
    setImporting(false);
  };
  if (loading || isLoading) {
    return <PageSkeleton />;
  }
  const total = ingredientsData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <PageHeader
        title={t('ingredients.title', 'Ingredients Management')}
        subtitle={t('ingredients.subtitle', 'Manage your kitchen ingredients and inventory')}
        icon="🥘"
        actions={<DisplayUnitSelect value={displayUnit} onChange={setDisplayUnit} />}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-900/20 px-4 py-3 text-red-400">
          {error}
        </div>
      )}
      <IngredientActions
        selectedIngredients={selectedIngredients}
        filteredIngredients={filteredIngredients}
        onAddIngredient={() => setShowAddForm(true)}
        onImportCSV={() => setShowCSVImport(true)}
        onExportCSV={exportToCSV}
        onBulkDelete={handleBulkDelete}
        onBulkUpdate={async () => {}}
        loading={loading}
      />

      {/* Add Ingredient Wizard */}
      {showAddForm && (
        <IngredientWizard
          suppliers={suppliers}
          availableUnits={AVAILABLE_UNITS}
          onSave={handleAddIngredient}
          onCancel={() => {
            setShowAddForm(false);
            resetWizard();
          }}
          onAddSupplier={async () => {}}
          loading={loading}
        />
      )}

      {/* Filters */}
      <IngredientFilters
        ingredients={ingredients}
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        sortBy={sortBy}
        displayUnit={displayUnit}
        onSearchChange={setSearchTerm}
        onSupplierFilterChange={setSupplierFilter}
        onStorageFilterChange={setStorageFilter}
        onSortChange={setSortBy}
        onDisplayUnitChange={setDisplayUnit}
      />

      {/* Ingredients Table */}
      <IngredientTable
        ingredients={filteredIngredients}
        displayUnit={displayUnit}
        onEdit={setEditingIngredient}
        onDelete={handleDeleteIngredient}
        selectedIngredients={selectedIngredients}
        onSelectIngredient={handleSelectIngredient}
        onSelectAll={handleSelectAll}
        loading={loading}
      />

      {/* Pagination */}
      <IngredientPagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      {/* Edit Ingredient Form */}
      {editingIngredient && (
        <IngredientForm
          ingredient={editingIngredient}
          suppliers={suppliers}
          availableUnits={AVAILABLE_UNITS}
          onSave={async (ingredientData: Partial<Ingredient>) => {
            if (!editingIngredient?.id) return;

            try {
              const { data, error } = await supabase
                .from('ingredients')
                .update({
                  ...ingredientData,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', editingIngredient.id)
                .select()
                .single();

              if (error) throw error;

              // Update local state
              setIngredients(prev =>
                prev.map(ing => (ing.id === editingIngredient.id ? data : ing)),
              );
              setEditingIngredient(null);
            } catch (error) {
              console.error('Error updating ingredient:', error);
              setError('Failed to update ingredient');
            }
          }}
          onCancel={() => setEditingIngredient(null)}
          loading={loading}
        />
      )}

      {/* CSV Import Modal */}
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
