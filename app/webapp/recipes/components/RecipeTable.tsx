'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';

interface RecipeTableProps {
  recipes: Recipe[];
  recipePrices: Record<string, RecipePriceData>;
  selectedRecipes: Set<string>;
  onSelectAll: () => void;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
}

const RecipeTable = React.memo(function RecipeTable({
  recipes,
  recipePrices,
  selectedRecipes,
  onSelectAll,
  onSelectRecipe,
  onPreviewRecipe,
  onEditRecipe,
  onDeleteRecipe,
  capitalizeRecipeName,
}: RecipeTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <div className="flex items-center">
                <label className="sr-only">
                  <input
                    type="checkbox"
                    checked={selectedRecipes.size === recipes.length && recipes.length > 0}
                    onChange={onSelectAll}
                    className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                    aria-label="Select all recipes"
                  />
                  Select All
                </label>
                <span className="ml-2">Select</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Recommended Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Instructions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
          {recipes.map(recipe => (
            <tr key={recipe.id} className="transition-colors hover:bg-[#2a2a2a]/20">
              <td
                className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white"
                onClick={e => e.stopPropagation()}
              >
                <label className="sr-only">
                  <input
                    type="checkbox"
                    checked={selectedRecipes.has(recipe.id)}
                    onChange={() => onSelectRecipe(recipe.id)}
                    className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                    aria-label={`Select recipe ${capitalizeRecipeName(recipe.name)}`}
                  />
                  Select {capitalizeRecipeName(recipe.name)}
                </label>
              </td>
              <td
                className="cursor-pointer px-6 py-4 text-sm font-medium whitespace-nowrap text-white"
                onClick={() => onPreviewRecipe(recipe)}
              >
                {capitalizeRecipeName(recipe.name)}
              </td>
              <td
                className="cursor-pointer px-6 py-4 text-sm whitespace-nowrap text-gray-300"
                onClick={() => onPreviewRecipe(recipe)}
              >
                {recipePrices[recipe.id] ? (
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      ${recipePrices[recipe.id].recommendedPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {recipePrices[recipe.id].foodCostPercent.toFixed(1)}% food cost
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Calculating...</span>
                )}
              </td>
              <td
                className="cursor-pointer px-6 py-4 text-sm text-gray-300"
                onClick={() => onPreviewRecipe(recipe)}
              >
                {recipe.instructions ? (
                  <div className="max-w-xs truncate">{recipe.instructions}</div>
                ) : (
                  '-'
                )}
              </td>
              <td
                className="cursor-pointer px-6 py-4 text-sm whitespace-nowrap text-gray-300"
                onClick={() => onPreviewRecipe(recipe)}
              >
                {new Date(recipe.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onEditRecipe(recipe)}
                    className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDeleteRecipe(recipe)}
                    className="rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default RecipeTable;
