'use client';

import React from 'react';
import { Ingredient, RecipeIngredient } from '../types';

interface IngredientManagerProps {
  showAddIngredient: boolean;
  ingredients: Ingredient[];
  ingredientSearch: string;
  showSuggestions: boolean;
  filteredIngredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  newIngredient: Partial<RecipeIngredient>;
  onToggleAddIngredient: () => void;
  onSearchChange: (value: string) => void;
  onIngredientSelect: (ingredient: Ingredient) => void;
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onAddIngredient: (e: React.FormEvent) => void;
}

export const IngredientManager: React.FC<IngredientManagerProps> = ({
  showAddIngredient,
  ingredients,
  ingredientSearch,
  showSuggestions,
  filteredIngredients,
  selectedIngredient,
  newIngredient,
  onToggleAddIngredient,
  onSearchChange,
  onIngredientSelect,
  onQuantityChange,
  onUnitChange,
  onAddIngredient,
}) => {
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">🥘 Add Ingredients</h3>
            <p className="text-sm text-gray-400">Add ingredients manually to build your dish</p>
            <p className="text-xs text-[#29E7CD] mt-1">✨ Automatic unit conversion: Use any unit (tsp, tbsp, cups, ml, g, kg) - we'll convert to the ingredient's base unit!</p>
          </div>
          <button
            onClick={onToggleAddIngredient}
            className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{showAddIngredient ? 'Cancel' : 'Add Ingredient'}</span>
          </button>
        </div>

        {showAddIngredient && (
          <form onSubmit={onAddIngredient} className="space-y-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
            <div className="relative ingredient-search-container">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔍 Search & Select Ingredient
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search ingredients..."
                  value={ingredientSearch}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => onSearchChange(ingredientSearch)} // Keep suggestions visible
                  className="w-full max-w-md pl-10 pr-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {ingredientSearch && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {ingredientSearch && (
                <div className="mt-2 text-xs text-gray-400">
                  {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && filteredIngredients.length > 0 && (
              <div className="absolute z-10 w-full max-w-md mt-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto suggestions-dropdown">
                {filteredIngredients.slice(0, 10).map((ingredient) => {
                  const displayCost = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
                  return (
                    <button
                      key={ingredient.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onIngredientSelect(ingredient);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#2a2a2a] transition-colors border-b border-[#2a2a2a] last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{ingredient.ingredient_name}</div>
                          <div className="text-xs text-gray-400">
                            {ingredient.unit && `${ingredient.unit} • `}
                            ${displayCost.toFixed(2)}/{ingredient.unit || 'unit'}
                          </div>
                        </div>
                        <div className="text-[#29E7CD] text-sm">
                          {ingredient.trim_peel_waste_percentage ? `${ingredient.trim_peel_waste_percentage}% waste` : 'No waste'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* No results message */}
            {showSuggestions && filteredIngredients.length === 0 && ingredientSearch && (
              <div className="absolute z-10 w-full mt-1 p-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg">
                <p className="text-sm text-gray-400 text-center">
                  🔍 No ingredients found matching "{ingredientSearch}"
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Try a different search term or add the ingredient to your list first
                </p>
              </div>
            )}
            
            {/* Selected ingredient info */}
            {selectedIngredient && (
              <div className="mt-2 p-3 bg-[#29E7CD]/10 border border-[#29E7CD]/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[#29E7CD] font-medium">✓ {selectedIngredient.ingredient_name}</div>
                    <div className="text-xs text-gray-400">
                      ${(selectedIngredient.cost_per_unit_incl_trim || selectedIngredient.cost_per_unit || 0).toFixed(2)}/{selectedIngredient.unit || 'unit'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ⚖️ Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={newIngredient.quantity || 0}
                  onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => {
                    // Clear the field if it's 0 when focused
                    if ((newIngredient.quantity || 0) === 0) {
                      e.target.select(); // Select all text so user can type over it
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📏 Unit
                </label>
                <div className="relative">
                  <select
                    value={newIngredient.unit || 'kg'}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="pcs">pcs</option>
                    <option value="box">box</option>
                    <option value="GM">GM</option>
                    <option value="PC">PC</option>
                    <option value="PACK">PACK</option>
                    <option value="BAG">BAG</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-6 py-3 rounded-xl hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Ingredient to Dish</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
