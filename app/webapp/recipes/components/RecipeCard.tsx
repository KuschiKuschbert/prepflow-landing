'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  recipePrices: Record<string, RecipePriceData>;
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
  capitalizeRecipeName,
}: RecipeCardProps) {
  return (
    <div className="p-4 transition-colors hover:bg-[#2a2a2a]/20">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <label className="sr-only">
            <input
              type="checkbox"
              checked={selectedRecipes.has(recipe.id)}
              onChange={() => onSelectRecipe(recipe.id)}
              className="mr-3 h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
              aria-label={`Select recipe ${capitalizeRecipeName(recipe.name)}`}
            />
            Select {capitalizeRecipeName(recipe.name)}
          </label>
          <h3
            className="cursor-pointer text-sm font-medium text-white"
            onClick={() => onPreviewRecipe(recipe)}
          >
            {capitalizeRecipeName(recipe.name)}
          </h3>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(recipe.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-3 ml-7 space-y-1 text-xs text-gray-500">
        <div>
          <span className="font-medium">Recommended Price:</span>
          {recipePrices[recipe.id] ? (
            <span className="ml-1 font-semibold text-white">
              ${recipePrices[recipe.id].recommendedPrice.toFixed(2)}
            </span>
          ) : (
            <span className="ml-1 text-gray-500">Calculating...</span>
          )}
        </div>
        {recipePrices[recipe.id] && (
          <div>
            <span className="font-medium">Food Cost:</span>
            <span className="ml-1 text-gray-400">
              {recipePrices[recipe.id].foodCostPercent.toFixed(1)}%
            </span>
          </div>
        )}
        {recipe.instructions && (
          <div>
            <span className="font-medium">Instructions:</span>
            <p className="mt-1 line-clamp-2 text-gray-400">{recipe.instructions}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="ml-7 flex gap-2">
        <button
          onClick={() => onEditRecipe(recipe)}
          className="flex items-center justify-center gap-1.5 flex-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit in COGS
        </button>
        <button
          onClick={() => onDeleteRecipe(recipe)}
          className="flex items-center justify-center gap-1.5 flex-1 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
});

export default RecipeCard;
