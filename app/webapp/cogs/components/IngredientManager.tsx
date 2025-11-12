'use client';

import React from 'react';
import { Ingredient, RecipeIngredient } from '../types';
import { RecipeUnitSelect } from './RecipeUnitSelect';
import { Plus, Search, X, Utensils, Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
    <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-4">
      <div className="mb-3">
        <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
          <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          Add Ingredients
        </h4>
        <p className="text-xs text-gray-400">
          ✨ Automatic unit conversion: Use any unit (tsp, tbsp, cups, ml, g, kg)
        </p>
      </div>

      {showAddIngredient && (
        <form
          onSubmit={onAddIngredient}
          className="relative space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] p-4"
        >
          <div className="ingredient-search-container relative">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Icon icon={Search} size="sm" className="text-gray-400" aria-hidden={true} />
              Search & Select Ingredient
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search ingredients&hellip;"
                value={ingredientSearch}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={() => {
                  // Show suggestions when input is focused, even if search is empty
                  if (ingredients.length > 0) {
                    onSearchChange(ingredientSearch || '');
                  }
                }}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] py-3 pr-10 pl-10 text-white shadow-sm transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-md focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon={Search} size="sm" className="text-gray-400" aria-hidden={true} />
              </div>
              {ingredientSearch && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-white"
                  aria-label="Clear search"
                >
                  <Icon icon={X} size="sm" aria-hidden={true} />
                </button>
              )}
            </div>
            {ingredientSearch && (
              <div className="mt-2 text-xs text-gray-400">
                {filteredIngredients.length} ingredient
                {filteredIngredients.length !== 1 ? 's' : ''} found
                {ingredients.length === 0 && (
                  <span className="ml-2 text-yellow-400">
                    (No ingredients available - check database connection)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && filteredIngredients.length > 0 && (
            <div className="suggestions-dropdown relative z-[60] mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
              {filteredIngredients.slice(0, 10).map(ingredient => {
                const displayCost =
                  ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      onIngredientSelect(ingredient);
                    }}
                    className="w-full border-b border-[#2a2a2a] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#2a2a2a]/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{ingredient.ingredient_name}</div>
                        <div className="text-xs text-gray-400">
                          {ingredient.unit && `${ingredient.unit} • `}${displayCost.toFixed(2)}/
                          {ingredient.unit || 'unit'}
                        </div>
                      </div>
                      <div className="text-xs text-[#29E7CD]">
                        {ingredient.trim_peel_waste_percentage
                          ? `${ingredient.trim_peel_waste_percentage}% waste`
                          : 'No waste'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results message */}
          {showSuggestions && filteredIngredients.length === 0 && ingredientSearch && (
            <div className="relative z-50 mt-1 w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
              <p className="text-center text-sm text-gray-400">
                🔍 No ingredients found matching &quot;{ingredientSearch}&quot;
              </p>
              <p className="mt-1 text-center text-xs text-gray-500">
                Try a different search term or add the ingredient to your list first
              </p>
            </div>
          )}

          {/* Selected ingredient info */}
          {selectedIngredient && (
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-medium text-[#29E7CD]">
                    <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                    {selectedIngredient.ingredient_name}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    $
                    {(
                      selectedIngredient.cost_per_unit_incl_trim ||
                      selectedIngredient.cost_per_unit ||
                      0
                    ).toFixed(2)}
                    /{selectedIngredient.unit || 'unit'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                  aria-label="Clear selection"
                >
                  <Icon icon={X} size="sm" aria-hidden={true} />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">⚖️ Quantity</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={newIngredient.quantity || 0}
                onChange={e => onQuantityChange(parseFloat(e.target.value) || 0)}
                onFocus={e => {
                  if ((newIngredient.quantity || 0) === 0) {
                    e.target.select();
                  }
                }}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white shadow-sm transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-md focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">📏 Unit</label>
              <RecipeUnitSelect value={newIngredient.unit || 'kg'} onChange={onUnitChange} />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/90 hover:to-[#D925C7]/90 hover:shadow-xl"
          >
            <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
            <span>Add Ingredient to Dish</span>
          </button>
        </form>
      )}
    </div>
  );
};
