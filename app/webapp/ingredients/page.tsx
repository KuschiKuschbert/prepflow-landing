'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import { convertIngredientCost, convertUnit, getAllUnits, isVolumeUnit, isWeightUnit } from '@/lib/unit-conversion';
import { formatIngredientName, formatBrandName, formatSupplierName, formatStorageLocation, formatTextInput } from '@/lib/text-utils';
import { useTranslation } from '@/lib/useTranslation';
import { useSmartLoading } from '@/hooks/useSmartLoading';
import { PageSkeleton, LoadingSkeleton, TableSkeleton, FormSkeleton } from '@/components/ui/LoadingSkeleton';

// Direct imports to eliminate skeleton flashes
import IngredientTable from './components/IngredientTable';
import IngredientFilters from './components/IngredientFilters';
import IngredientActions from './components/IngredientActions';
import IngredientForm from './components/IngredientForm';
import CSVImportModal from './components/CSVImportModal';
import IngredientWizard from './components/IngredientWizard';

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
    current_stock: 0
  });

  // Filter and sort ingredients
  useMemo(() => {
    let filtered = ingredients.filter(ingredient => {
      const matchesSearch = !searchTerm || 
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.brand && ingredient.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ingredient.supplier && ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

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

  const handleAddIngredient = async (ingredientData: Partial<Ingredient>) => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([{
          ...ingredientData,
          ingredient_name: formatIngredientName(ingredientData.ingredient_name || ''),
          brand: ingredientData.brand ? formatBrandName(ingredientData.brand) : null,
          supplier: ingredientData.supplier ? formatSupplierName(ingredientData.supplier) : null,
          storage_location: ingredientData.storage_location ? formatStorageLocation(ingredientData.storage_location) : null,
          product_code: ingredientData.product_code ? formatTextInput(ingredientData.product_code) : null
        }])
        .select();

      if (error) throw error;
      
      setIngredients(prev => [...prev, ...(data || [])]);
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
        current_stock: 0
      });
    } catch (error) {
      setError('Failed to add ingredient');
    }
  };

  const handleUpdateIngredient = async (id: string, updates: Partial<Ingredient>) => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .update({
          ...updates,
          ingredient_name: updates.ingredient_name ? formatIngredientName(updates.ingredient_name) : undefined,
          brand: updates.brand ? formatBrandName(updates.brand) : undefined,
          supplier: updates.supplier ? formatSupplierName(updates.supplier) : undefined,
          storage_location: updates.storage_location ? formatStorageLocation(updates.storage_location) : undefined,
          product_code: updates.product_code ? formatTextInput(updates.product_code) : undefined
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setIngredients(prev => prev.map(ing => ing.id === id ? { ...ing, ...updates } : ing));
      setEditingIngredient(null);
    } catch (error) {
      setError('Failed to update ingredient');
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setIngredients(prev => prev.filter(ing => ing.id !== id));
    } catch (error) {
      setError('Failed to delete ingredient');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .in('id', Array.from(selectedIngredients));

      if (error) throw error;
      
      setIngredients(prev => prev.filter(ing => !selectedIngredients.has(ing.id)));
      setSelectedIngredients(new Set());
    } catch (error) {
      setError('Failed to delete selected ingredients');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Ingredient Name', 'Brand', 'Pack Size', 'Pack Size Unit', 'Pack Price', 'Unit', 'Cost Per Unit', 'Supplier', 'Product Code', 'Storage Location', 'Min Stock Level', 'Current Stock'].join(','),
      ...filteredIngredients.map(ingredient => [
        ingredient.ingredient_name,
        ingredient.brand || '',
        ingredient.pack_size || '',
        ingredient.pack_size_unit || '',
        ingredient.pack_price || 0,
        ingredient.unit || '',
        ingredient.cost_per_unit || 0,
        ingredient.supplier || '',
        ingredient.product_code || '',
        ingredient.storage_location || '',
        ingredient.min_stock_level || 0,
        ingredient.current_stock || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCSVImport = async () => {
    try {
      setImporting(true);
      
      const { data, error } = await supabase
        .from('ingredients')
        .insert(parsedIngredients.map(ingredient => ({
          ...ingredient,
          ingredient_name: formatIngredientName(ingredient.ingredient_name || ''),
          brand: ingredient.brand ? formatBrandName(ingredient.brand) : null,
          supplier: ingredient.supplier ? formatSupplierName(ingredient.supplier) : null,
          storage_location: ingredient.storage_location ? formatStorageLocation(ingredient.storage_location) : null,
          product_code: ingredient.product_code ? formatTextInput(ingredient.product_code) : null
        })))
        .select();

      if (error) throw error;
      
      setIngredients(prev => [...prev, ...(data || [])]);
      setShowCSVImport(false);
      setCsvData('');
      setParsedIngredients([]);
    } catch (error) {
      setError('Failed to import ingredients');
    } finally {
      setImporting(false);
    }
  };

  const handleSelectIngredient = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedIngredients);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIngredients(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIngredients(new Set(filteredIngredients.map(ing => ing.id)));
    } else {
      setSelectedIngredients(new Set());
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🥘 {t('ingredients.title', 'Ingredients Management')}</h1>
              <p className="text-gray-400">{t('ingredients.subtitle', 'Manage your kitchen ingredients and inventory')}</p>
            </div>
            
            {/* Unit Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-300">Display costs in:</label>
              <select
                value={displayUnit}
                onChange={(e) => setDisplayUnit(e.target.value)}
                className="px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent min-h-[44px] flex items-center justify-center"
              >
                <optgroup label="Weight">
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="lb">Pounds (lb)</option>
                </optgroup>
                <optgroup label="Volume">
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (L)</option>
                  <option value="tsp">Teaspoons (tsp)</option>
                  <option value="tbsp">Tablespoons (tbsp)</option>
                  <option value="cup">Cups</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
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
            availableUnits={['g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pc', 'box', 'pack', 'bag', 'bottle', 'can']}
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
                current_stock: 0
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
            availableUnits={['g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pc', 'box', 'pack', 'bag', 'bottle', 'can']}
            onSave={async (ingredientData: Partial<Ingredient>) => {
              if (!editingIngredient?.id) return;
              
              try {
                const { data, error } = await supabase
                  .from('ingredients')
                  .update({
                    ...ingredientData,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', editingIngredient.id)
                  .select()
                  .single();

                if (error) throw error;

                // Update local state
                setIngredients(prev => 
                  prev.map(ing => ing.id === editingIngredient.id ? data : ing)
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
