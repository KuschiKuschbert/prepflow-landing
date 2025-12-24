'use client';

import React from 'react';
import { Ingredient, RecipeIngredient } from '../types';
import { RecipeUnitSelect } from './RecipeUnitSelect';
import { Plus, Search, X, Utensils, Check, Sparkles } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface IngredientManagerProps {
  showAddIngredient: boolean;
  ingredients: Ingredient[];
  ingredientSearch: string;
  showSuggestions: boolean;
  filteredIngredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  highlightedIndex: number;
  newIngredient: Partial<RecipeIngredient>;
  onToggleAddIngredient: () => void;
  onSearchChange: (value: string) => void;
  onIngredientSelect: (ingredient: Ingredient) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, filteredIngredients: Ingredient[]) => void;
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
  highlightedIndex,
  newIngredient,
  onToggleAddIngredient,
  onSearchChange,
  onIngredientSelect,
  onKeyDown,
  onQuantityChange,
  onUnitChange,
  onAddIngredient,
}) => {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/50 p-4">
      <div className="mb-3">
        <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <Icon icon={Utensils} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          Add Ingredients
        </h4>
        <p className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
          <Icon icon={Sparkles} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
          Automatic unit conversion: Use any unit (tsp, tbsp, cups, ml, g, kg)
        </p>
      </div>

      {showAddIngredient && (
        <form
          onSubmit={onAddIngredient}
          className="relative space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
        >
          <div className="ingredient-search-container relative">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)]">
              <Icon
                icon={Search}
                size="sm"
                className="text-[var(--foreground-muted)]"
                aria-hidden={true}
              />
              Search & Select Ingredient
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search ingredients&hellip;"
                value={ingredientSearch}
                onChange={e => onSearchChange(e.target.value.toLowerCase())}
                onKeyDown={e => onKeyDown(e, filteredIngredients)}
                onFocus={() => {
                  // Show suggestions when input is focused, even if search is empty
                  if (ingredients.length > 0) {
                    onSearchChange(ingredientSearch || '');
                  }
                }}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pr-10 pl-10 text-[var(--foreground)] shadow-sm transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-md focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon
                  icon={Search}
                  size="sm"
                  className="text-[var(--foreground-muted)]"
                  aria-hidden={true}
                />
              </div>
              {ingredientSearch && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                  aria-label="Clear search"
                >
                  <Icon icon={X} size="sm" aria-hidden={true} />
                </button>
              )}
            </div>
            {ingredientSearch && (
              <div className="mt-2 text-xs text-[var(--foreground-muted)]">
                {filteredIngredients.length} ingredient
                {filteredIngredients.length !== 1 ? 's' : ''} found
                {ingredients.length === 0 && (
                  <span className="ml-2 text-[var(--color-warning)]">
                    (No ingredients available - check database connection)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && filteredIngredients.length > 0 && (
            <div className="suggestions-dropdown relative z-[60] mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
              {filteredIngredients.slice(0, 10).map((ingredient, index) => {
                const displayCost =
                  ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
                const isHighlighted = highlightedIndex === index;
                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      onIngredientSelect(ingredient);
                    }}
                    className={`w-full border-b border-[var(--border)] px-4 py-3 text-left transition-colors last:border-b-0 ${
                      isHighlighted
                        ? 'bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30'
                        : 'hover:bg-[var(--muted)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className={`font-medium ${isHighlighted ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}
                        >
                          {ingredient.ingredient_name}
                        </div>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {ingredient.unit && `${ingredient.unit} • `}${displayCost.toFixed(2)}/
                          {ingredient.unit || 'unit'}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--primary)]">
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
            <div className="relative z-50 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
              <p className="flex items-center justify-center gap-2 text-center text-sm text-[var(--foreground-muted)]">
                <Icon
                  icon={Search}
                  size="sm"
                  className="text-[var(--foreground-muted)]"
                  aria-hidden={true}
                />
                No ingredients found matching &quot;{ingredientSearch}&quot;
              </p>
              <p className="mt-1 text-center text-xs text-[var(--foreground-subtle)]">
                Try a different search term or add the ingredient to your list first
              </p>
            </div>
          )}

          {/* Selected ingredient info */}
          {selectedIngredient && (
            <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-medium text-[var(--primary)]">
                    <Icon
                      icon={Check}
                      size="sm"
                      className="text-[var(--primary)]"
                      aria-hidden={true}
                    />
                    {selectedIngredient.ingredient_name}
                  </div>
                  <div className="mt-1 text-xs text-[var(--foreground-muted)]">
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
                  className="rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  aria-label="Clear selection"
                >
                  <Icon icon={X} size="sm" aria-hidden={true} />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                ⚖️ Quantity
              </label>
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
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] shadow-sm transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-md focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Unit
              </label>
              <RecipeUnitSelect value={newIngredient.unit || 'kg'} onChange={onUnitChange} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedIngredient || !newIngredient.quantity || newIngredient.quantity <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/90 hover:to-[var(--accent)]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon
              icon={Plus}
              size="sm"
              className="text-[var(--button-active-text)]"
              aria-hidden={true}
            />
            <span>Add Ingredient</span>
          </button>
        </form>
      )}
    </div>
  );
};
