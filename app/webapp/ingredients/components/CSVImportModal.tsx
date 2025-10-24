'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { formatIngredientName, formatBrandName, formatSupplierName, formatStorageLocation } from '@/lib/text-utils';

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

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (ingredients: Partial<Ingredient>[]) => Promise<void>;
  loading?: boolean;
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onImport,
  loading = false
}: CSVImportModalProps) {
  const { t } = useTranslation();
  
  const [csvData, setCsvData] = useState<string>('');
  const [parsedIngredients, setParsedIngredients] = useState<Partial<Ingredient>[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            ingredient.ingredient_name = formatIngredientName(value);
          } else if (header.includes('brand')) {
            ingredient.brand = formatBrandName(value);
          } else if (header.includes('cost') || header.includes('price')) {
            ingredient.cost_per_unit = parseFloat(value) || 0;
          } else if (header.includes('unit')) {
            ingredient.unit = value.toUpperCase();
          } else if (header.includes('supplier')) {
            ingredient.supplier = formatSupplierName(value);
          } else if (header.includes('code') || header.includes('sku')) {
            ingredient.product_code = value;
          } else if (header.includes('location') || header.includes('storage')) {
            ingredient.storage_location = formatStorageLocation(value);
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

  const handleSelectIngredient = (index: string, selected: boolean) => {
    const newSelected = new Set(selectedIngredients);
    if (selected) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedIngredients(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIngredients(new Set(parsedIngredients.map((_, i) => i.toString())));
    } else {
      setSelectedIngredients(new Set());
    }
  };

  const handleImport = async () => {
    try {
      const ingredientsToImport = parsedIngredients.filter((_, index) => 
        selectedIngredients.has(index.toString())
      ).map(ingredient => ({
        ...ingredient,
        ingredient_name: formatIngredientName(ingredient.ingredient_name || ''),
        brand: formatBrandName(ingredient.brand || ''),
        supplier: formatSupplierName(ingredient.supplier || ''),
        storage_location: formatStorageLocation(ingredient.storage_location || ''),
      }));

      await onImport(ingredientsToImport);
      
      // Reset state
      setCsvData('');
      setParsedIngredients([]);
      setSelectedIngredients(new Set());
      setError(null);
    } catch (err) {
      console.error('Failed to import ingredients:', err);
    }
  };

  const handleClose = () => {
    setCsvData('');
    setParsedIngredients([]);
    setSelectedIngredients(new Set());
    setError(null);
    onClose();
  };

  const formatCost = (cost: number): string => {
    if (cost < 1) {
      return cost.toFixed(3);
    } else if (cost < 10) {
      return cost.toFixed(2);
    } else {
      return cost.toFixed(2);
    }
  };

  const getDisplayCost = (ingredient: Partial<Ingredient>) => {
    const cost = ingredient.cost_per_unit || 0;
    const unit = ingredient.unit || '';
    const formattedCost = formatCost(cost);
    
    let packInfo = '';
    if (ingredient.pack_price && ingredient.pack_size && ingredient.pack_size_unit) {
      packInfo = `Pack: $${ingredient.pack_price} for ${ingredient.pack_size}${ingredient.pack_size_unit}`;
    }

    return { cost, unit, formattedCost, packInfo };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">📁 Import Ingredients from CSV</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Supported columns: name, brand, cost, unit, supplier, code, location, pack_size
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Preview */}
          {parsedIngredients.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">
                  Preview ({parsedIngredients.length} ingredients found)
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSelectAll(true)}
                    className="text-sm text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleSelectAll(false)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-[#2a2a2a] rounded-lg">
                {parsedIngredients.map((ingredient, index) => {
                  const displayCost = getDisplayCost(ingredient);
                  const isSelected = selectedIngredients.has(index.toString());
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-3 border-b border-[#2a2a2a] last:border-b-0 transition-colors ${
                        isSelected ? 'bg-[#29E7CD]/10' : 'hover:bg-[#2a2a2a]/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <label className="sr-only">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectIngredient(index.toString(), e.target.checked)}
                            className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                            aria-label={`Select ingredient ${ingredient.ingredient_name || 'Unknown'}`}
                          />
                          Select ingredient {ingredient.ingredient_name || 'Unknown'}
                        </label>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {ingredient.ingredient_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {ingredient.brand && `Brand: ${ingredient.brand} • `}
                            Cost: ${displayCost.formattedCost}/{displayCost.unit}
                            {displayCost.packInfo && ` • ${displayCost.packInfo}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading || selectedIngredients.size === 0}
                  className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Importing...' : `Import Selected (${selectedIngredients.size})`}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-[#2a2a2a]/30 p-4 rounded-lg border border-[#2a2a2a]/50">
            <h4 className="text-sm font-semibold text-white mb-2">📋 CSV Format Instructions</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• First row should contain column headers</p>
              <p>• Required columns: name (or ingredient), cost (or price), unit</p>
              <p>• Optional columns: brand, supplier, code (or sku), location (or storage), pack_size</p>
              <p>• Values will be automatically formatted and capitalized</p>
              <p>• Empty rows will be skipped</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
