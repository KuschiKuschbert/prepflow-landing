'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { useSmartLoading } from '@/hooks/useSmartLoading';
import {
  PageSkeleton,
  LoadingSkeleton,
  TableSkeleton,
  FormSkeleton,
} from '@/components/ui/LoadingSkeleton';

// Direct imports to eliminate skeleton flashes
import IngredientTable from './components/IngredientTable';
import IngredientFilters from './components/IngredientFilters';
import IngredientActions from './components/IngredientActions';
import IngredientForm from './components/IngredientForm';
import CSVImportModal from './components/CSVImportModal';
import IngredientWizard from './components/IngredientWizard';
import { IngredientsHeader } from './components/IngredientsHeader';
import { useIngredientActions } from './hooks/useIngredientActions';

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
  name: string;
  created_at: string;
}

export default function IngredientsPage() {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setSmartLoading] = useSmartLoading(false, 200); // Smart loading with 200ms delay
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [parsedIngredients, setParsedIngredients] = useState<Partial<Ingredient>[]>([]);
  const [importing, setImporting] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [displayUnit, setDisplayUnit] = useState('g');
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [storageFilter, setStorageFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cost_asc' | 'cost_desc' | 'supplier'>('name');
  const [wizardStep, setWizardStep] = useState(1);
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '',
    pack_size_unit: 'g',
    pack_price: 0,
    unit: 'g',
    cost_per_unit: 0,
    supplier: '',
    product_code: '',
    storage_location: '',
    min_stock_level: 0,
    current_stock: 0,
  });

  // Filter and sort ingredients
  useMemo(() => {
    let filtered = ingredients.filter(ingredient => {
      const matchesSearch =
        !searchTerm ||
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.brand && ingredient.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ingredient.supplier &&
          ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSupplier = !supplierFilter || ingredient.supplier === supplierFilter;
      const matchesStorage = !storageFilter || ingredient.storage_location === storageFilter;

      return matchesSearch && matchesSupplier && matchesStorage;
    });

    // Sort ingredients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.ingredient_name.localeCompare(b.ingredient_name);
        case 'cost_asc':
          return (a.cost_per_unit || 0) - (b.cost_per_unit || 0);
        case 'cost_desc':
          return (b.cost_per_unit || 0) - (a.cost_per_unit || 0);
        case 'supplier':
          return (a.supplier || '').localeCompare(b.supplier || '');
        default:
          return 0;
      }
    });

    setFilteredIngredients(filtered);
  }, [ingredients, searchTerm, supplierFilter, storageFilter, sortBy]);

  const fetchIngredients = async () => {
    setSmartLoading(true);
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('ingredient_name');

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      setError('Failed to fetch ingredients');
    } finally {
      setSmartLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase.from('suppliers').select('*').order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      // Handle error gracefully
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

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

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <IngredientsHeader displayUnit={displayUnit} setDisplayUnit={setDisplayUnit} />

        {error && (
          <div className="mb-6 rounded-lg border border-red-500 bg-red-900/20 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <IngredientActions
          selectedIngredients={selectedIngredients}
          filteredIngredients={filteredIngredients}
          onAddIngredient={() => setShowAddForm(true)}
          onImportCSV={() => setShowCSVImport(true)}
          onExportCSV={exportToCSV}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={async () => {}} // Placeholder function
          loading={loading}
        />

        {/* Add Ingredient Wizard */}
        {showAddForm && (
          <IngredientWizard
            suppliers={suppliers}
            availableUnits={[
              'g',
              'kg',
              'oz',
              'lb',
              'ml',
              'l',
              'tsp',
              'tbsp',
              'cup',
              'pc',
              'box',
              'pack',
              'bag',
              'bottle',
              'can',
            ]}
            onSave={handleAddIngredient}
            onCancel={() => {
              setShowAddForm(false);
              setWizardStep(1);
              setNewIngredient({
                ingredient_name: '',
                brand: '',
                pack_size: '',
                pack_size_unit: 'g',
                pack_price: 0,
                unit: 'g',
                cost_per_unit: 0,
                supplier: '',
                product_code: '',
                storage_location: '',
                min_stock_level: 0,
                current_stock: 0,
              });
            }}
            onAddSupplier={async (name: string) => {
              // Placeholder function - add supplier logic here
              console.log('Adding supplier:', name);
            }}
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

        {/* Edit Ingredient Form */}
        {editingIngredient && (
          <IngredientForm
            ingredient={editingIngredient}
            suppliers={suppliers}
            availableUnits={[
              'g',
              'kg',
              'oz',
              'lb',
              'ml',
              'l',
              'tsp',
              'tbsp',
              'cup',
              'pc',
              'box',
              'pack',
              'bag',
              'bottle',
              'can',
            ]}
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
              setCsvData('');
              setParsedIngredients([]);
            }}
            onImport={handleCSVImport}
            loading={importing}
          />
        )}
      </div>
    </div>
  );
}
