'use client';

import React from 'react';
import { COGSCalculation } from '../types';

interface COGSTableProps {
  calculations: COGSCalculation[];
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void;
  onEditQuantityChange: (quantity: number) => void;
  totalCOGS: number;
  costPerPortion: number;
  dishPortions: number;
}

export const COGSTable: React.FC<COGSTableProps> = ({
  calculations,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
  totalCOGS,
  costPerPortion,
  dishPortions,
}) => {
  if (calculations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No ingredients added yet. Add some ingredients to see COGS calculations.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {calculations.map((calc, index) => (
            <div key={index} className="p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-white">
                  {calc.ingredientName}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#29E7CD]">
                    ${calc.yieldAdjustedCost.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                    className="p-1 text-gray-400 hover:text-[#29E7CD] transition-colors duration-200"
                    title="Edit quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRemoveIngredient(calc.ingredientId)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    title="Remove ingredient"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {editingIngredient === calc.ingredientId ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => onEditQuantityChange(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-sm border border-[#3a3a3a] bg-[#0a0a0a] text-white rounded focus:outline-none focus:ring-1 focus:ring-[#29E7CD]"
                      step="0.1"
                      min="0"
                    />
                    <span className="text-xs text-gray-400">{calc.unit}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={onSaveEdit}
                      className="px-3 py-1 text-xs bg-[#29E7CD] text-white rounded hover:bg-[#29E7CD]/80 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  {calc.quantity} {calc.unit}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Ingredient
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Qty
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Cost
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1f1f1f] divide-y divide-gray-200">
            {calculations.map((calc, index) => (
              <tr key={index} className="hover:bg-[#2a2a2a]/50 transition-colors duration-200">
                <td className="px-3 py-2 text-sm text-white">
                  {calc.ingredientName}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {editingIngredient === calc.ingredientId ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => onEditQuantityChange(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-[#3a3a3a] bg-[#0a0a0a] text-white rounded focus:outline-none focus:ring-1 focus:ring-[#29E7CD]"
                        step="0.1"
                        min="0"
                      />
                      <span className="text-xs text-gray-400">{calc.unit}</span>
                    </div>
                  ) : (
                    <span>{calc.quantity} {calc.unit}</span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  ${calc.yieldAdjustedCost.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {editingIngredient === calc.ingredientId ? (
                      <>
                        <button
                          onClick={onSaveEdit}
                          className="px-2 py-1 text-xs bg-[#29E7CD] text-white rounded hover:bg-[#29E7CD]/80 transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={onCancelEdit}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEditIngredient(calc.ingredientId, calc.quantity)}
                          className="p-1 text-gray-400 hover:text-[#29E7CD] transition-colors duration-200"
                          title="Edit quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onRemoveIngredient(calc.ingredientId)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          title="Remove ingredient"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total COGS Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-white">Total COGS:</span>
          <span className="text-lg font-bold text-[#29E7CD]">
            ${totalCOGS.toFixed(2)}
          </span>
        </div>
        {dishPortions > 0 && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Cost per portion:</span>
            <span className="text-sm font-medium text-white">
              ${costPerPortion.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
