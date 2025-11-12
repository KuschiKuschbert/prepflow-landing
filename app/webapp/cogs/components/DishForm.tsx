'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, X } from 'lucide-react';
import React from 'react';
import { COGSCalculation, Ingredient, Recipe, RecipeIngredient } from '../types';
import { IngredientManager } from './IngredientManager';
import { IngredientsList } from './IngredientsList';
import { RecipeCombobox } from './RecipeCombobox';
import { FinishRecipeButton } from './FinishRecipeButton';
import { AutosaveStatus } from '../hooks/useRecipeIngredientsAutosave';

interface DishFormProps {
  recipes: Recipe[];
  selectedRecipe: string;
  calculations: COGSCalculation[];
  dishPortions: number;
  showAddIngredient: boolean;
  ingredients: Ingredient[];
  ingredientSearch: string;
  showSuggestions: boolean;
  filteredIngredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  highlightedIndex: number;
  newIngredient: Partial<RecipeIngredient>;
  autosaveStatus: AutosaveStatus;
  onRecipeSelect: (recipeId: string) => void;
  onCreateNewRecipe: () => void;
  onDishPortionsChange: (portions: number) => void;
  onUpdateCalculation: (ingredientId: string, newQuantity: number) => void;
  onRemoveCalculation: (ingredientId: string) => void;
  onToggleAddIngredient: () => void;
  onSearchChange: (value: string) => void;
  onIngredientSelect: (ingredient: Ingredient) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, filteredIngredients: Ingredient[]) => void;
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onAddIngredient: (e: React.FormEvent) => void;
  onFinishRecipe: () => void;
}

export const DishForm: React.FC<DishFormProps> = ({
  recipes,
  selectedRecipe,
  calculations,
  dishPortions,
  showAddIngredient,
  ingredients,
  ingredientSearch,
  showSuggestions,
  filteredIngredients,
  selectedIngredient,
  highlightedIndex,
  newIngredient,
  autosaveStatus,
  onRecipeSelect,
  onCreateNewRecipe,
  onDishPortionsChange,
  onUpdateCalculation,
  onRemoveCalculation,
  onToggleAddIngredient,
  onSearchChange,
  onIngredientSelect,
  onKeyDown,
  onQuantityChange,
  onUnitChange,
  onAddIngredient,
  onFinishRecipe,
}) => {
  const hasRecipe = Boolean(selectedRecipe);
  const hasIngredients = calculations.length > 0;

  return (
    <div className="rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
      <h2 className="mb-6 text-lg font-semibold sm:text-xl">Recipe & Ingredients</h2>

      {/* Recipe Combobox */}
      <div className="mb-6">
        <RecipeCombobox
          recipes={recipes}
          selectedRecipe={selectedRecipe}
          onRecipeSelect={onRecipeSelect}
          onCreateNew={onCreateNewRecipe}
        />
        {!hasRecipe && (
          <p className="mt-2 text-sm text-gray-500">
            Please select or create a recipe to calculate COGS
          </p>
        )}
      </div>

      {/* Autosave Status Indicator */}
      {hasRecipe && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          {autosaveStatus === 'saving' && (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent" />
              <span className="text-gray-400">Saving...</span>
            </>
          )}
          {autosaveStatus === 'saved' && (
            <>
              <div className="h-3 w-3 rounded-full bg-[#29E7CD]" />
              <span className="text-[#29E7CD]">Saved</span>
            </>
          )}
          {autosaveStatus === 'error' && (
            <>
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-red-400">Save failed</span>
            </>
          )}
        </div>
      )}

      {/* Number of Portions */}
      {hasRecipe && (
        <div className="mb-6 border-t border-[#2a2a2a]/50 pt-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            🍽️ Number of Portions
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              placeholder="1"
              value={dishPortions}
              onChange={e => onDishPortionsChange(Number(e.target.value))}
              className="w-24 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-center font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            />
            <span className="text-sm text-gray-400">portions</span>
            <button
              onClick={onToggleAddIngredient}
              disabled={!hasRecipe}
              className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-[#29E7CD]/90 hover:to-[#D925C7]/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon
                icon={showAddIngredient ? X : Edit}
                size="xs"
                className="text-white"
                aria-hidden={true}
              />
              <span>{showAddIngredient ? 'Cancel' : 'Add Ingredient'}</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This determines the cost per portion for your pricing calculations
          </p>

          {/* Add Ingredients Section */}
          {showAddIngredient && (
            <div className="mt-4">
              <IngredientManager
                showAddIngredient={showAddIngredient}
                ingredients={ingredients}
                ingredientSearch={ingredientSearch}
                showSuggestions={showSuggestions}
                filteredIngredients={filteredIngredients}
                selectedIngredient={selectedIngredient}
                highlightedIndex={highlightedIndex}
                newIngredient={newIngredient}
                onToggleAddIngredient={onToggleAddIngredient}
                onSearchChange={onSearchChange}
                onIngredientSelect={onIngredientSelect}
                onKeyDown={onKeyDown}
                onQuantityChange={onQuantityChange}
                onUnitChange={onUnitChange}
                onAddIngredient={onAddIngredient}
              />
            </div>
          )}

          {/* Ingredients List */}
          <IngredientsList
            calculations={calculations}
            onUpdateCalculation={onUpdateCalculation}
            onRemoveCalculation={onRemoveCalculation}
          />
        </div>
      )}

      {/* Finish Recipe Button */}
      {hasRecipe && (
        <FinishRecipeButton
          onFinish={onFinishRecipe}
          disabled={!hasRecipe}
          hasIngredients={hasIngredients}
        />
      )}
    </div>
  );
};
