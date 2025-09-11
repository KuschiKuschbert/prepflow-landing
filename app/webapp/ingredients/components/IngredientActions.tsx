'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';

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

interface IngredientActionsProps {
  selectedIngredients: Set<string>;
  filteredIngredients: Ingredient[];
  onAddIngredient: () => void;
  onImportCSV: () => void;
  onExportCSV: () => void;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkUpdate: (ids: string[], updates: Partial<Ingredient>) => Promise<void>;
  loading?: boolean;
}

export default function IngredientActions({
  selectedIngredients,
  filteredIngredients,
  onAddIngredient,
  onImportCSV,
  onExportCSV,
  onBulkDelete,
  onBulkUpdate,
  loading = false
}: IngredientActionsProps) {
  const { t } = useTranslation();
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const selectedCount = selectedIngredients.size;
  const selectedIngredientsData = filteredIngredients.filter(ingredient => 
    selectedIngredients.has(ingredient.id)
  );

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    setBulkActionLoading(true);
    try {
      await onBulkDelete(Array.from(selectedIngredients));
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkUpdateSupplier = async () => {
    if (selectedCount === 0) return;
    
    const newSupplier = window.prompt(`Enter new supplier for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`);
    if (!newSupplier?.trim()) return;

    setBulkActionLoading(true);
    try {
      await onBulkUpdate(Array.from(selectedIngredients), { supplier: newSupplier.trim() });
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkUpdateStorage = async () => {
    if (selectedCount === 0) return;
    
    const newStorage = window.prompt(`Enter new storage location for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`);
    if (!newStorage?.trim()) return;

    setBulkActionLoading(true);
    try {
      await onBulkUpdate(Array.from(selectedIngredients), { storage_location: newStorage.trim() });
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkUpdateWastage = async () => {
    if (selectedCount === 0) return;
    
    const wastageInput = window.prompt(`Enter wastage percentage (0-100) for ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`);
    if (!wastageInput) return;
    
    const wastage = parseFloat(wastageInput);
    if (isNaN(wastage) || wastage < 0 || wastage > 100) {
      alert('Please enter a valid percentage between 0 and 100');
      return;
    }

    setBulkActionLoading(true);
    try {
      await onBulkUpdate(Array.from(selectedIngredients), { 
        trim_peel_waste_percentage: wastage,
        yield_percentage: 100 - wastage
      });
    } finally {
      setBulkActionLoading(false);
      setShowBulkMenu(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Primary Actions */}
      <button
        onClick={onAddIngredient}
        className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        + Add Ingredient
      </button>
      
      <button
        onClick={onImportCSV}
        className="bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] text-white px-4 py-2 rounded-lg hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        📁 Import CSV
      </button>
      
      <button
        onClick={onExportCSV}
        className="bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white px-4 py-2 rounded-lg hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        📤 Export CSV
      </button>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowBulkMenu(!showBulkMenu)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-500/80 hover:to-red-500/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            ⚡ Bulk Actions ({selectedCount})
          </button>

          {showBulkMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg shadow-xl z-10">
              <div className="p-2">
                <div className="text-xs text-gray-400 px-3 py-2 border-b border-[#2a2a2a]">
                  {selectedCount} ingredient{selectedCount > 1 ? 's' : ''} selected
                </div>
                
                <div className="space-y-1 mt-2">
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                  >
                    🗑️ Delete Selected
                  </button>
                  
                  <button
                    onClick={handleBulkUpdateSupplier}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50"
                  >
                    🏪 Update Supplier
                  </button>
                  
                  <button
                    onClick={handleBulkUpdateStorage}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50"
                  >
                    📍 Update Storage Location
                  </button>
                  
                  <button
                    onClick={handleBulkUpdateWastage}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50"
                  >
                    🎯 Update Wastage %
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {(loading || bulkActionLoading) && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-[#29E7CD] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">
            {bulkActionLoading ? 'Processing...' : 'Loading...'}
          </span>
        </div>
      )}

      {/* Selected Items Summary */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Selected:</span>
          <span className="text-[#29E7CD] font-medium">{selectedCount}</span>
          <span>of</span>
          <span className="text-white font-medium">{filteredIngredients.length}</span>
        </div>
      )}
    </div>
  );
}
