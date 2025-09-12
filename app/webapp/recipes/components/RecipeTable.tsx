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

export default function RecipeTable({ 
  recipes, 
  recipePrices, 
  selectedRecipes, 
  onSelectAll, 
  onSelectRecipe, 
  onPreviewRecipe, 
  onEditRecipe, 
  onDeleteRecipe,
  capitalizeRecipeName 
}: RecipeTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRecipes.size === recipes.length && recipes.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                />
                <span className="ml-2">Select</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Recommended Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Instructions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#1f1f1f] divide-y divide-[#2a2a2a]">
          {recipes.map((recipe) => (
            <tr key={recipe.id} className="hover:bg-[#2a2a2a]/20 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedRecipes.has(recipe.id)}
                  onChange={() => onSelectRecipe(recipe.id)}
                  className="w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white cursor-pointer" onClick={() => onPreviewRecipe(recipe)}>
                {capitalizeRecipeName(recipe.name)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer" onClick={() => onPreviewRecipe(recipe)}>
                {recipePrices[recipe.id] ? (
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">${recipePrices[recipe.id].recommendedPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">
                      {recipePrices[recipe.id].foodCostPercent.toFixed(1)}% food cost
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Calculating...</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 cursor-pointer" onClick={() => onPreviewRecipe(recipe)}>
                {recipe.instructions ? (
                  <div className="max-w-xs truncate">
                    {recipe.instructions}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer" onClick={() => onPreviewRecipe(recipe)}>
                {new Date(recipe.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEditRecipe(recipe)}
                    className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDeleteRecipe(recipe)}
                    className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200"
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
}
