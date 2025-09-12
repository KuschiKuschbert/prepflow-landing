'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

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

interface IngredientTableProps {
  ingredients: Ingredient[];
  displayUnit: string;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => Promise<void>;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  loading?: boolean;
}

export default function IngredientTable({
  ingredients,
  displayUnit,
  onEdit,
  onDelete,
  selectedIngredients,
  onSelectIngredient,
  onSelectAll,
  loading = false
}: IngredientTableProps) {
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-[#1f1f1f] rounded-3xl p-6 border border-[#2a2a2a]">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="bg-[#1f1f1f] rounded-3xl p-6 border border-[#2a2a2a] text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No Ingredients Found</h3>
          <p className="text-gray-400">Start by adding your first ingredient to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1f1f1f] rounded-3xl border border-[#2a2a2a] overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Ingredients ({ingredients.length})
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={selectedIngredients.size === ingredients.length && ingredients.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
              />
              Select All
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedIngredients.size === ingredients.length && ingredients.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Pack Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cost/Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {ingredients.map((ingredient) => {
              const convertedCost = convertIngredientCost(
                ingredient.cost_per_unit,
                ingredient.unit || 'GM',
                displayUnit,
                ingredient.ingredient_name || 'Unknown'
              );
              
              const isLowStock = ingredient.min_stock_level && ingredient.current_stock && 
                ingredient.current_stock <= ingredient.min_stock_level;

              return (
                <tr 
                  key={ingredient.id} 
                  className="hover:bg-[#2a2a2a]/20 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIngredients.has(ingredient.id)}
                      onChange={(e) => onSelectIngredient(ingredient.id, e.target.checked)}
                      className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {ingredient.ingredient_name}
                    </div>
                    {ingredient.product_code && (
                      <div className="text-sm text-gray-400">
                        {ingredient.product_code}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ingredient.brand || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ingredient.pack_size} {ingredient.pack_size_unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatCurrency(convertedCost)}/{displayUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ingredient.supplier || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isLowStock ? 'text-red-400' : 'text-gray-300'}`}>
                        {ingredient.current_stock || 0} {ingredient.unit}
                      </span>
                      {isLowStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900/20 text-red-400">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(ingredient)}
                        className="text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors"
                        aria-label={`Edit ${ingredient.ingredient_name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        disabled={deletingId === ingredient.id}
                        className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        aria-label={`Delete ${ingredient.ingredient_name}`}
                      >
                        {deletingId === ingredient.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
