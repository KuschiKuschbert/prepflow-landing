'use client';

import React from 'react';
import { formatDishName } from '@/lib/text-utils';
import { DishFormData, Recipe } from '../types';

interface DishFormProps {
  formData: DishFormData;
  recipes: Recipe[];
  selectedRecipe: string;
  onDishNameChange: (name: string) => void;
  onDishPortionsChange: (portions: number) => void;
  onRecipeSelect: (recipeId: string) => void;
}

export const DishForm: React.FC<DishFormProps> = ({
  formData,
  recipes,
  selectedRecipe,
  onDishNameChange,
  onDishPortionsChange,
  onRecipeSelect,
}) => {
  const { dishName, dishPortions, dishNameLocked, recipeExists, checkingRecipe } = formData;

  // Debug: Log recipes prop to verify data is being passed
  React.useEffect(() => {
    console.log('🔍 DEBUG DishForm: recipes prop received', {
      recipesCount: recipes?.length || 0,
      recipes: recipes,
      selectedRecipe,
    });
  }, [recipes, selectedRecipe]);

  return (
    <div className="rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
      <h2 className="mb-6 text-lg font-semibold sm:text-xl">Create Dish</h2>

      {/* Dish Name Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">🍽️ Dish Name</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter dish name (e.g., Chicken Curry)"
            value={dishName}
            onChange={e => onDishNameChange(formatDishName(e.target.value))}
            disabled={dishNameLocked}
            className={`w-full rounded-xl border px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:outline-none ${
              dishNameLocked
                ? 'cursor-not-allowed border-blue-400 bg-[#1a1a1a] text-gray-300'
                : recipeExists === true
                  ? 'border-orange-400 bg-[#0a0a0a] text-white focus:border-orange-400 focus:ring-orange-400'
                  : recipeExists === false
                    ? 'border-green-400 bg-[#0a0a0a] text-white focus:border-green-400 focus:ring-green-400'
                    : 'border-[#2a2a2a] bg-[#0a0a0a] text-white focus:border-[#29E7CD] focus:ring-[#29E7CD]'
            }`}
          />
          {dishNameLocked && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Recipe Status Indicator */}
        {dishName.trim() && (
          <div className="mt-2 flex items-center space-x-2">
            {checkingRecipe ? (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                <span className="text-sm">Checking...</span>
              </div>
            ) : recipeExists === true ? (
              <div className="flex items-center space-x-2 text-orange-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  ⚠️ Recipe exists - ingredients loaded, will update existing recipe
                </span>
              </div>
            ) : recipeExists === false ? (
              <div className="flex items-center space-x-2 text-green-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">✅ New recipe - will create new recipe</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Lock Status Indicator */}
        {dishNameLocked && (
          <div className="mt-2 flex items-center space-x-2 text-blue-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium">🔒 Dish name locked - editing ingredients</span>
          </div>
        )}
      </div>

      {/* Recipe Selection - Secondary Option */}
      <div className="mb-6 border-t border-[#2a2a2a]/50 pt-4">
        <div className="rounded-2xl border border-[#D925C7]/30 bg-gradient-to-r from-[#D925C7]/10 to-[#29E7CD]/10 p-4">
          <div className="mb-4">
            <h3 className="mb-1 text-xl font-semibold text-white">📚 Or Select Existing Recipe</h3>
            <p className="text-sm text-gray-400">
              Choose a recipe to load ingredients automatically
            </p>
          </div>
          <select
            value={selectedRecipe}
            onChange={e => onRecipeSelect(e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white shadow-sm transition-all duration-200 hover:shadow-md focus:border-[#D925C7] focus:ring-2 focus:ring-[#D925C7] focus:outline-none"
          >
            <option value="">Create new dish from scratch...</option>
            {recipes && recipes.length > 0 ? (
              recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No recipes available
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Number of Portions */}
      <div className="border-t border-[#2a2a2a]/50 pt-4">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          🍽️ Number of Portions
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            min="1"
            placeholder="1"
            value={dishPortions}
            onChange={e => onDishPortionsChange(Number(e.target.value))}
            className="w-24 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-center font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
          <span className="text-sm text-gray-400">portions</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          This determines the cost per portion for your pricing calculations
        </p>
      </div>
    </div>
  );
};
