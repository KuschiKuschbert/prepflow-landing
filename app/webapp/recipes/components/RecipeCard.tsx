'use client';

import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  recipePrices: Record<string, {costPerServing: number, recommendedPrice: number, foodCostPercent: number}>;
  selectedRecipes: Set<string>;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
}

const RecipeCard = React.memo(function RecipeCard({ 
  recipe, 
  recipePrices, 
  selectedRecipes, 
  onSelectRecipe, 
  onPreviewRecipe, 
  onEditRecipe, 
  onDeleteRecipe,
  capitalizeRecipeName 
}: RecipeCardProps) {
  return (
    <div className="p-4 hover:bg-[#2a2a2a]/20 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <label className="sr-only">
            <input
              type="checkbox"
              checked={selectedRecipes.has(recipe.id)}
              onChange={() => onSelectRecipe(recipe.id)}
              className="w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2 mr-3"
              aria-label={`Select recipe ${capitalizeRecipeName(recipe.name)}`}
            />
            Select {capitalizeRecipeName(recipe.name)}
          </label>
          <h3 
            className="text-sm font-medium text-white cursor-pointer" 
            onClick={() => onPreviewRecipe(recipe)}
          >
            {capitalizeRecipeName(recipe.name)}
          </h3>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(recipe.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="space-y-1 text-xs text-gray-500 mb-3 ml-7">
        <div>
          <span className="font-medium">Recommended Price:</span> 
          {recipePrices[recipe.id] ? (
            <span className="text-white font-semibold ml-1">
              ${recipePrices[recipe.id].recommendedPrice.toFixed(2)}
            </span>
          ) : (
            <span className="text-gray-500 ml-1">Calculating...</span>
          )}
        </div>
        {recipePrices[recipe.id] && (
          <div>
            <span className="font-medium">Food Cost:</span> 
            <span className="text-gray-400 ml-1">
              {recipePrices[recipe.id].foodCostPercent.toFixed(1)}%
            </span>
          </div>
        )}
        {recipe.instructions && (
          <div>
            <span className="font-medium">Instructions:</span>
            <p className="mt-1 text-gray-400 line-clamp-2">
              {recipe.instructions}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-7">
        <button
          onClick={() => onEditRecipe(recipe)}
          className="flex-1 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
        >
          ✏️ Edit in COGS
        </button>
        <button
          onClick={() => onDeleteRecipe(recipe)}
          className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
});

export default RecipeCard;
