'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string; // Database uses 'ingredient_name'
  brand?: string;
  pack_size?: string;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number; // Database uses 'trim_peel_waste_percentage'
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string; // Database uses 'storage_location'
  min_stock_level?: number;
  current_stock?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Supplier {
  id: string;
  name: string;
  created_at: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [parsedIngredients, setParsedIngredients] = useState<Partial<Ingredient>[]>([]);
  const [importing, setImporting] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [newSupplier, setNewSupplier] = useState<string>('');
  const [newUnit, setNewUnit] = useState<string>('');

  // Dynamic units list - built from existing ingredients
  const availableUnits = useMemo(() => {
    const unitsFromIngredients = ingredients
      .map(ingredient => ingredient.unit)
      .filter((unit): unit is string => unit !== undefined && unit !== null && unit !== '')
      .map(unit => unit.toUpperCase())
      .filter((unit, index, array) => array.indexOf(unit) === index) // Remove duplicates
      .sort();
    
    // Add some common units if they don't exist
    const commonUnits = ['GM', 'KG', 'ML', 'L', 'PC', 'BOX', 'PACK', 'BAG', 'BOTTLE', 'CAN'];
    const allUnits = [...new Set([...commonUnits, ...unitsFromIngredients])].sort();
    
    return allUnits;
  }, [ingredients]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [storageFilter, setStorageFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cost_asc' | 'cost_desc' | 'supplier'>('name');
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '1',
    unit: 'GM',
    cost_per_unit: 0,
    cost_per_unit_as_purchased: 0,
    cost_per_unit_incl_trim: 0,
    trim_peel_waste_percentage: 0,
    yield_percentage: 100,
    supplier: '',
    product_code: '',
    storage_location: '',
    is_active: true,
  });

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

  // Fetch suppliers from database
  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching suppliers:', error);
      } else {
        setSuppliers(data || []);
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  // AI-powered wastage calculation based on ingredient name
  const calculateWastagePercentage = (ingredientName: string): number => {
    const name = ingredientName.toLowerCase();
    
    // High wastage ingredients (30-50%)
    if (name.includes('whole') || name.includes('bone') || name.includes('shell') || 
        name.includes('peel') || name.includes('skin') || name.includes('rind') ||
        name.includes('head') || name.includes('stalk') || name.includes('stem')) {
      return Math.floor(Math.random() * 21) + 30; // 30-50%
    }
    
    // Medium wastage ingredients (10-25%)
    if (name.includes('fresh') || name.includes('raw') || name.includes('uncooked') ||
        name.includes('leafy') || name.includes('herb') || name.includes('lettuce') ||
        name.includes('spinach') || name.includes('kale') || name.includes('cabbage')) {
      return Math.floor(Math.random() * 16) + 10; // 10-25%
    }
    
    // Low wastage ingredients (0-10%)
    if (name.includes('frozen') || name.includes('canned') || name.includes('dried') ||
        name.includes('powder') || name.includes('oil') || name.includes('sauce') ||
        name.includes('paste') || name.includes('concentrate')) {
      return Math.floor(Math.random() * 11); // 0-10%
    }
    
    // Default moderate wastage (5-15%)
    return Math.floor(Math.random() * 11) + 5; // 5-15%
  };

  // Calculate cost per unit from packaging cost
  const calculateCostPerUnit = (packagingCost: number, packSize: number): number => {
    return packSize > 0 ? packagingCost / packSize : 0;
  };

  // Add new supplier to database
  const addNewSupplier = async (supplierName: string) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{ name: supplierName }])
        .select()
        .single();

      if (error) {
        setError('Failed to add supplier');
      } else {
        setSuppliers([...suppliers, data]);
        setNewIngredient({ ...newIngredient, supplier: data.name });
        setNewSupplier('');
      }
    } catch (err) {
      setError('Failed to add supplier');
    }
  };

  // Add new unit to available units
  const addNewUnit = (unitName: string) => {
    if (unitName && !availableUnits.includes(unitName.toUpperCase())) {
      // Set the new unit in the form
      setNewIngredient({ ...newIngredient, unit: unitName.toUpperCase() });
      setNewUnit('');
    }
  };

  // Handle unit selection change
  const handleUnitChange = (unit: string) => {
    if (unit === 'custom') {
      setNewIngredient({ ...newIngredient, unit: 'custom' });
    } else {
      setNewIngredient({ ...newIngredient, unit: unit });
    }
  };

  // Handle wastage checkbox change
  const handleWastageChange = (hasWastage: boolean) => {
    const updatedIngredient = { ...newIngredient };
    
    if (hasWastage && newIngredient.ingredient_name) {
      // Auto-calculate wastage percentage using AI
      const wastagePercentage = calculateWastagePercentage(newIngredient.ingredient_name);
      updatedIngredient.trim_peel_waste_percentage = wastagePercentage;
    } else {
      updatedIngredient.trim_peel_waste_percentage = 0;
    }
    
    setNewIngredient(updatedIngredient);
  };

  // Handle pack size change
  const handlePackSizeChange = (size: string) => {
    setNewIngredient({ ...newIngredient, pack_size: size });
  };

  // Calculate cost per unit from total pack cost and pack size
  const calculateCostPerUnitFromPack = (packCost: number, packSize: string): number => {
    const size = parseFloat(packSize) || 1;
    return packCost / size;
  };

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Filter and sort ingredients
  useEffect(() => {
    let filtered = ingredients.filter(ingredient => {
      const matchesSearch = ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (ingredient.brand && ingredient.brand.toLowerCase().includes(searchTerm.toLowerCase()));
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
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('ingredient_name');

      if (error) {
        setError(error.message);
      } else {
        setIngredients(data || []);
      }
    } catch (err) {
      setError('Failed to fetch ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Capitalize text fields before saving
      const capitalizedIngredient = {
        ...newIngredient,
        ingredient_name: capitalizeWords(newIngredient.ingredient_name),
        brand: capitalizeWords(newIngredient.brand),
        supplier: capitalizeWords(newIngredient.supplier),
        storage_location: capitalizeWords(newIngredient.storage_location),
      };

      const { error } = await supabase
        .from('ingredients')
        .insert([capitalizedIngredient]);

      if (error) {
        setError(error.message);
      } else {
        setShowAddForm(false);
        setNewIngredient({
          ingredient_name: '',
          brand: '',
          pack_size: '1',
          unit: 'GM',
          cost_per_unit: 0,
          cost_per_unit_as_purchased: 0,
          cost_per_unit_incl_trim: 0,
          trim_peel_waste_percentage: 0,
          yield_percentage: 100,
          supplier: '',
          product_code: '',
          storage_location: '',
        });
        fetchIngredients();
      }
    } catch (err) {
      setError('Failed to add ingredient');
    }
  };

  const handleUpdateIngredient = async (id: string, updates: Partial<Ingredient>) => {
    try {
      const { error } = await supabase
        .from('ingredients')
        .update(updates)
        .eq('id', id);

      if (error) {
        setError(error.message);
      } else {
        fetchIngredients();
        setEditingIngredient(null);
      }
    } catch (err) {
      setError('Failed to update ingredient');
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) {
        setError(error.message);
      } else {
        fetchIngredients();
      }
    } catch (err) {
      setError('Failed to delete ingredient');
    }
  };

  const handleEditIngredient = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (ingredient) {
      setEditingIngredient(ingredient);
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      setCsvData(csvText);
      parseCSVWithAI(csvText);
    };
    reader.readAsText(file);
  };

  const parseCSVWithAI = (csvText: string) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        setError('CSV must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const parsedData: Partial<Ingredient>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const ingredient: Partial<Ingredient> = {};

        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          // AI-powered column mapping with capitalization
          if (header.includes('name') || header.includes('ingredient')) {
            ingredient.ingredient_name = capitalizeWords(value);
          } else if (header.includes('brand')) {
            ingredient.brand = capitalizeWords(value);
          } else if (header.includes('cost') || header.includes('price')) {
            ingredient.cost_per_unit = parseFloat(value) || 0;
          } else if (header.includes('unit')) {
            ingredient.unit = value.toUpperCase();
          } else if (header.includes('supplier')) {
            ingredient.supplier = capitalizeWords(value);
          } else if (header.includes('code') || header.includes('sku')) {
            ingredient.product_code = value;
          } else if (header.includes('location') || header.includes('storage')) {
            ingredient.storage_location = capitalizeWords(value);
          } else if (header.includes('pack') || header.includes('size')) {
            ingredient.pack_size = value || '1';
          }
        });
        
        // Set defaults for required fields
        if (!ingredient.ingredient_name) continue; // Skip rows without ingredient name
        if (!ingredient.cost_per_unit) ingredient.cost_per_unit = 0;
        if (!ingredient.cost_per_unit_as_purchased) ingredient.cost_per_unit_as_purchased = ingredient.cost_per_unit || 0;
        if (!ingredient.cost_per_unit_incl_trim) ingredient.cost_per_unit_incl_trim = ingredient.cost_per_unit || 0;
        if (!ingredient.trim_peel_waste_percentage) ingredient.trim_peel_waste_percentage = 0;
        if (!ingredient.yield_percentage) ingredient.yield_percentage = 100;
        if (!ingredient.unit) ingredient.unit = 'GM';
        if (!ingredient.pack_size) ingredient.pack_size = '1';
        
        parsedData.push(ingredient);
      }
      
      setParsedIngredients(parsedData);
      setError(null);
    } catch (err) {
      setError('Failed to parse CSV file');
    }
  };

  const importSelectedIngredients = async () => {
    try {
      setImporting(true);
      const ingredientsToImport = parsedIngredients.filter((_, index) => 
        selectedIngredients.has(index.toString())
      ).map(ingredient => ({
        ...ingredient,
        ingredient_name: capitalizeWords(ingredient.ingredient_name),
        brand: capitalizeWords(ingredient.brand),
        supplier: capitalizeWords(ingredient.supplier),
        storage_location: capitalizeWords(ingredient.storage_location),
      }));

      const { error } = await supabase
        .from('ingredients')
        .insert(ingredientsToImport);

      if (error) {
        setError(error.message);
      } else {
        setShowCSVImport(false);
        setParsedIngredients([]);
        setSelectedIngredients(new Set());
        fetchIngredients();
      }
    } catch (err) {
      setError('Failed to import ingredients');
    } finally {
      setImporting(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Ingredient Name', 'Brand', 'Pack Size', 'Unit', 'Cost per Unit',
      'Cost per Unit (As Purchased)', 'Cost per Unit (Incl. Trim)',
      'Trim/Peel Waste %', 'Yield %', 'Supplier', 'Product Code', 'Storage Location'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredIngredients.map(ingredient => [
        ingredient.ingredient_name,
        ingredient.brand || '',
        ingredient.pack_size || '',
        ingredient.unit || '',
        ingredient.cost_per_unit || 0,
        ingredient.cost_per_unit_as_purchased || 0,
        ingredient.cost_per_unit_incl_trim || 0,
        ingredient.trim_peel_waste_percentage || 0,
        ingredient.yield_percentage || 100,
        ingredient.supplier || '',
        ingredient.product_code || '',
        ingredient.storage_location || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ingredients.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🥘 Ingredients Management</h1>
          <p className="text-gray-400">Manage your kitchen ingredients and inventory</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {showAddForm ? 'Cancel' : '+ Add Ingredient'}
          </button>
          <button
            onClick={() => setShowCSVImport(true)}
            className="bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] text-white px-4 py-2 rounded-lg hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            📁 Import CSV
          </button>
          <button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white px-4 py-2 rounded-lg hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            📤 Export CSV
          </button>
      </div>

        {/* Enhanced Add Ingredient Form */}
      {showAddForm && (
          <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">🥘 Add New Ingredient</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">AI-Powered</span>
        </div>
      </div>

          <form onSubmit={handleAddIngredient} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ingredient Name *
            </label>
            <input
              type="text"
                  required
                  value={newIngredient.ingredient_name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, ingredient_name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                  placeholder="e.g., Fresh Tomatoes"
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand (Optional)
            </label>
                <input
                  type="text"
                  value={newIngredient.brand || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, brand: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                  placeholder="e.g., Coles, Woolworths"
                />
              </div>
          </div>

            {/* Packaging Information */}
            <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                📦 Packaging Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pack Size *
            </label>
                  <input
                    type="text"
                    required
                    value={newIngredient.pack_size || ''}
                    onChange={(e) => handlePackSizeChange(e.target.value)}
                    className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                    placeholder="e.g., 96"
                  />
          </div>

          <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pack Unit *
            </label>
                  <div className="space-y-2">
            <select
                      value={newIngredient.unit || ''}
                      onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                    >
                      <option value="">Select from existing units</option>
                      {availableUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                      <option value="custom">+ Add new unit</option>
            </select>
                    
                    {newIngredient.unit === 'custom' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newUnit}
                          onChange={(e) => setNewUnit(e.target.value.toUpperCase())}
                          className="flex-1 px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                          placeholder="Enter new unit (e.g., SLICES)"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => addNewUnit(newUnit)}
                          disabled={!newUnit.trim()}
                          className="px-4 py-3 bg-[#29E7CD]/10 text-[#29E7CD] rounded-2xl hover:bg-[#29E7CD]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
        </div>
      )}

                    {availableUnits.length > 0 && (
                      <p className="text-xs text-gray-400">
                        💡 Available units from your ingredients: {availableUnits.slice(0, 5).join(', ')}
                        {availableUnits.length > 5 && ` +${availableUnits.length - 5} more`}
                      </p>
                    )}
                  </div>
                </div>
                
            <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cost per Unit *
              </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">$</span>
              <input
                      type="number"
                      step="0.01"
                required
                      value={newIngredient.cost_per_unit || ''}
                      onChange={(e) => setNewIngredient({ ...newIngredient, cost_per_unit: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                      placeholder="0.15"
              />
            </div>
                </div>
              </div>
              
              {/* Helper text */}
              <div className="mt-4 p-3 bg-[#29E7CD]/10 border border-[#29E7CD]/20 rounded-xl">
                <p className="text-sm text-[#29E7CD]">
                  💡 Enter the cost per individual unit (e.g., $0.15 per burger patty from a pack of 96)
                </p>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                🏪 Supplier Information
              </h3>
              <div className="flex gap-2">
                <select
                  value={newIngredient.supplier || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, supplier: e.target.value })}
                  className="flex-1 px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addNewSupplier(newSupplier)}
                  className="px-4 py-3 bg-[#3B82F6]/10 text-[#3B82F6] rounded-2xl hover:bg-[#3B82F6]/20 transition-colors"
                >
                  Add New
                </button>
              </div>
              <input
                type="text"
                value={newSupplier}
                onChange={(e) => setNewSupplier(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-sm"
                placeholder="New supplier name"
              />
            </div>

            {/* Wastage Information */}
            <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                🗑️ Wastage & Yield Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trim/Waste Percentage
              </label>
                  <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                      min="0"
                      max="100"
                      value={newIngredient.trim_peel_waste_percentage || 0}
                      onChange={(e) => setNewIngredient({ ...newIngredient, trim_peel_waste_percentage: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                    />
                    <span className="text-gray-400">%</span>
            </div>
                  {newIngredient.ingredient_name && (
                    <p className="text-xs text-gray-400 mt-1">
                      💡 AI suggests: {calculateWastagePercentage(newIngredient.ingredient_name)}% based on "{newIngredient.ingredient_name}"
                    </p>
                  )}
            </div>
                
            <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yield Percentage
              </label>
                  <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                      min="0"
                      max="100"
                      value={newIngredient.yield_percentage || 100}
                      onChange={(e) => setNewIngredient({ ...newIngredient, yield_percentage: parseFloat(e.target.value) || 100 })}
                      className="flex-1 px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                    />
                    <span className="text-gray-400">%</span>
            </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Code (Optional)
              </label>
                <input
                  type="text"
                  value={newIngredient.product_code || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, product_code: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                  placeholder="e.g., SKU123456"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Storage Location (Optional)
                </label>
                <input
                  type="text"
                  value={newIngredient.storage_location || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, storage_location: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] transition-all"
                  placeholder="e.g., Cold Room A, Dry Storage"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                ✅ Add Ingredient
                </button>
                <button
                  type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-[#2a2a2a] text-gray-300 px-6 py-3 rounded-2xl hover:bg-[#2a2a2a]/80 transition-all duration-200 font-medium"
              >
                Cancel
                </button>
              </div>
          </form>
        </div>
      )}

        {/* CSV Import Modal */}
        {showCSVImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">📁 Import Ingredients from CSV</h2>
                <button
                  onClick={() => setShowCSVImport(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
                />
              </div>

              {parsedIngredients.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">
                      Preview ({parsedIngredients.length} ingredients found)
                    </h3>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedIngredients(new Set(parsedIngredients.map((_, i) => i.toString())))}
                        className="text-sm text-[#29E7CD] hover:text-[#29E7CD]/80"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => setSelectedIngredients(new Set())}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto border border-[#2a2a2a] rounded-md">
                    {parsedIngredients.map((ingredient, index) => (
                      <div key={index} className="p-3 border-b border-[#2a2a2a] last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedIngredients.has(index.toString())}
                  onChange={(e) => {
                              const newSelected = new Set(selectedIngredients);
                              if (e.target.checked) {
                                newSelected.add(index.toString());
                              } else {
                                newSelected.delete(index.toString());
                              }
                              setSelectedIngredients(newSelected);
                            }}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <div className="text-white font-medium">{capitalizeWords(ingredient.ingredient_name)}</div>
                            <div className="text-sm text-gray-400">
                              {ingredient.brand && `Brand: ${ingredient.brand} • `}
                              {ingredient.cost_per_unit && `Cost: $${ingredient.cost_per_unit} • `}
                              {ingredient.unit && `Unit: ${ingredient.unit}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                <button
                      onClick={() => setShowCSVImport(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={importSelectedIngredients}
                      disabled={importing || selectedIngredients.size === 0}
                      className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importing ? 'Importing...' : `Import Selected (${selectedIngredients.size})`}
                </button>
              </div>
            </div>
              )}
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🏪 Supplier
              </label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="">All Suppliers</option>
                {Array.from(new Set(ingredients.map(i => i.supplier).filter(Boolean))).map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📍 Storage
              </label>
              <select
                value={storageFilter}
                onChange={(e) => setStorageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="">All Locations</option>
                {Array.from(new Set(ingredients.map(i => i.storage_location).filter(Boolean))).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📊 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="name">Name</option>
                <option value="cost_asc">Cost (Low to High)</option>
                <option value="cost_desc">Cost (High to Low)</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients List - Material Design 3 */}
        <div className="bg-[#1f1f1f] rounded-3xl shadow-lg border border-[#2a2a2a] overflow-hidden">
          {/* Header with Material 3 styling */}
          <div className="px-6 py-5 border-b border-[#2a2a2a] bg-gradient-to-r from-[#1f1f1f] to-[#2a2a2a]/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  🥘 Ingredients
          </h2>
                <p className="text-sm text-gray-400">
                  {filteredIngredients.length} of {ingredients.length} ingredients
                </p>
        </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live Data</span>
              </div>
            </div>
          </div>

          {/* Mobile Card Layout - Material 3 Cards */}
          <div className="md:hidden">
            {filteredIngredients.map((ingredient, index) => (
              <div 
                key={ingredient.id} 
                className="group relative p-5 border-b border-[#2a2a2a]/50 last:border-b-0 hover:bg-[#2a2a2a]/20 transition-all duration-200"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.3s ease-out forwards'
                }}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-[#29E7CD] transition-colors">
                      {capitalizeWords(ingredient.ingredient_name)}
                    </h3>
                    {ingredient.brand && (
                      <p className="text-sm text-gray-400 font-medium">{capitalizeWords(ingredient.brand)}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
              <button
                      onClick={() => handleEditIngredient(ingredient.id)}
                      className="p-2 rounded-full bg-[#29E7CD]/10 hover:bg-[#29E7CD]/20 text-[#29E7CD] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
              </button>
            </div>
        </div>

                {/* Card Content - Material 3 Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#2a2a2a]/30 rounded-2xl p-3 border border-[#2a2a2a]/50">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cost</div>
                    <div className="text-lg font-semibold text-white">
                      ${ingredient.cost_per_unit?.toFixed(2) || '0.00'}
        </div>
                    <div className="text-xs text-gray-400">per {ingredient.unit || 'unit'}</div>
                  </div>
                  
                  <div className="bg-[#2a2a2a]/30 rounded-2xl p-3 border border-[#2a2a2a]/50">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Yield</div>
                    <div className="text-lg font-semibold text-[#29E7CD]">
                      {ingredient.yield_percentage || 100}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {ingredient.trim_peel_waste_percentage || 0}% waste
                    </div>
                  </div>
                  
                  <div className="bg-[#2a2a2a]/30 rounded-2xl p-3 border border-[#2a2a2a]/50">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pack Size</div>
                    <div className="text-lg font-semibold text-white">
                      {ingredient.pack_size || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">{ingredient.unit || 'units'}</div>
                  </div>
                  
                  <div className="bg-[#2a2a2a]/30 rounded-2xl p-3 border border-[#2a2a2a]/50">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Supplier</div>
                    <div className="text-sm font-medium text-white truncate">
                      {capitalizeWords(ingredient.supplier) || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {capitalizeWords(ingredient.storage_location) || 'No location'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout - Material 3 Data Table */}
          <div className="hidden md:block">
        <div className="overflow-x-auto">
              <table className="w-full">
                {/* Material 3 Table Header */}
                <thead className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Ingredient
                        </span>
                        <div className="w-1 h-1 bg-[#29E7CD] rounded-full"></div>
                      </div>
                </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Pack Size
                      </span>
                </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Unit
                      </span>
                </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Cost
                      </span>
                </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Waste %
                      </span>
                </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Yield %
                      </span>
                </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Supplier
                      </span>
                </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Actions
                      </span>
                </th>
              </tr>
            </thead>
                
                {/* Material 3 Table Body */}
                <tbody className="divide-y divide-[#2a2a2a]/30">
                  {filteredIngredients.map((ingredient, index) => (
                    <tr 
                      key={ingredient.id} 
                      className="group hover:bg-[#2a2a2a]/20 transition-all duration-200"
                      style={{
                        animationDelay: `${index * 30}ms`,
                        animation: 'fadeInUp 0.3s ease-out forwards'
                      }}
                    >
                      {/* Ingredient Name Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 flex items-center justify-center">
                            <span className="text-lg">🥘</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white group-hover:text-[#29E7CD] transition-colors">
                    {capitalizeWords(ingredient.ingredient_name)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {capitalizeWords(ingredient.brand) || 'No brand'}
                            </div>
                          </div>
                        </div>
                  </td>
                      
                      {/* Pack Size Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-medium">
                          {ingredient.pack_size || 'N/A'}
                        </div>
                  </td>
                      
                      {/* Unit Column */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#29E7CD]/10 text-[#29E7CD] border border-[#29E7CD]/20">
                          {ingredient.unit || 'N/A'}
                        </span>
                  </td>
                      
                      {/* Cost Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-white">
                          ${ingredient.cost_per_unit?.toFixed(2) || '0.00'}
                        </div>
                  </td>
                      
                      {/* Waste % Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-white font-medium">
                            {ingredient.trim_peel_waste_percentage || 0}%
                          </div>
                          <div className="w-8 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                              style={{ width: `${Math.min((ingredient.trim_peel_waste_percentage || 0) * 2, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                  </td>
                      
                      {/* Yield % Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-[#29E7CD] font-semibold">
                            {ingredient.yield_percentage || 100}%
                          </div>
                          <div className="w-8 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] transition-all duration-300"
                              style={{ width: `${Math.min((ingredient.yield_percentage || 100) * 0.8, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                  </td>
                      
                      {/* Supplier Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {capitalizeWords(ingredient.supplier) || 'N/A'}
                        </div>
                        {ingredient.storage_location && (
                          <div className="text-xs text-gray-400">
                            📍 {capitalizeWords(ingredient.storage_location)}
                          </div>
                        )}
                  </td>
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditIngredient(ingredient.id)}
                            className="p-2 rounded-full bg-[#29E7CD]/10 hover:bg-[#29E7CD]/20 text-[#29E7CD] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md group"
                            title="Edit ingredient"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteIngredient(ingredient.id)}
                            className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md group"
                            title="Delete ingredient"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>

          {/* Empty State - Material 3 */}
          {filteredIngredients.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 flex items-center justify-center">
                <span className="text-3xl">🥘</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No ingredients found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || supplierFilter || storageFilter 
                  ? 'Try adjusting your search filters to find what you\'re looking for' 
                  : 'Add your first ingredient to start building your kitchen inventory'
                }
              </p>
              {!searchTerm && !supplierFilter && !storageFilter && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Add Your First Ingredient
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}