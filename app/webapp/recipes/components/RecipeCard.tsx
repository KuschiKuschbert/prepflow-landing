'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';
import { Edit, Trash2, Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
          <button
            onClick={() => onSelectRecipe(recipe.id)}
            className="mr-3 flex items-center justify-center transition-colors hover:text-[#29E7CD]"
            aria-label={`${selectedRecipes.has(recipe.id) ? 'Deselect' : 'Select'} recipe ${capitalizeRecipeName(recipe.name)}`}
          >
            {selectedRecipes.has(recipe.id) ? (
              <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            ) : (
              <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
            )}
          </button>
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
              {recipe.yield > 1 && (
                <>
                  <span className="ml-1">/portion</span>
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (${(recipePrices[recipe.id].recommendedPrice * recipe.yield).toFixed(2)} total)
                  </span>
                </>
              )}
            </span>
          ) : (
            <span className="ml-1 text-gray-500">Calculating...</span>
          )}
        </div>
        {recipePrices[recipe.id] && (
          <>
            <div>
              <span className="font-medium">Profit Margin:</span>
              <span className="ml-1 text-white">
                {recipePrices[recipe.id].gross_profit_margin.toFixed(1)}%
              </span>
              <span className="ml-1 text-gray-400">
                (${recipePrices[recipe.id].gross_profit.toFixed(2)} profit/portion)
              </span>
            </div>
            <div>
              <span className="font-medium">Contributing Margin:</span>
              <span className="ml-1 font-semibold text-[#D925C7]">
                ${recipePrices[recipe.id].contributingMargin.toFixed(2)}
              </span>
              <span className="ml-1 text-gray-400">
                ({recipePrices[recipe.id].contributingMarginPercent.toFixed(1)}% of revenue/portion)
              </span>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="ml-7 flex gap-2">
        <button
          onClick={() => onEditRecipe(recipe)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
        >
          <Icon icon={Edit} size="xs" className="text-white" aria-hidden={true} />
          Edit in COGS
        </button>
        <button
          onClick={() => onDeleteRecipe(recipe)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80"
        >
          <Icon icon={Trash2} size="xs" className="text-white" aria-hidden={true} />
          Delete
        </button>
      </div>
    </div>
  );
});

export default RecipeCard;
