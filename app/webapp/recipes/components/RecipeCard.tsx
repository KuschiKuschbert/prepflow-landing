'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';
import { Edit, Trash2, Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatRecipeDate } from '../utils/formatDate';

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
    <div
      className="border-l-2 border-[#3B82F6]/30 bg-[#3B82F6]/2 p-4 transition-colors hover:bg-[#3B82F6]/5 cursor-pointer"
      onClick={(e) => {
        // Don't trigger if clicking on buttons or checkbox
        if ((e.target as HTMLElement).closest('button')) return;
        onPreviewRecipe(recipe);
      }}
      title="Click to preview recipe details"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectRecipe(recipe.id);
            }}
            className="mr-3 flex items-center justify-center transition-colors hover:text-[#29E7CD]"
            aria-label={`${selectedRecipes.has(recipe.id) ? 'Deselect' : 'Select'} recipe ${capitalizeRecipeName(recipe.name)}`}
            title={selectedRecipes.has(recipe.id) ? 'Deselect recipe' : 'Select recipe'}
          >
            {selectedRecipes.has(recipe.id) ? (
              <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            ) : (
              <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
            )}
          </button>
          <h3 className="text-sm font-medium text-white">
            {capitalizeRecipeName(recipe.name)}
          </h3>
        </div>
        <span className="text-xs text-gray-500" title={`Created on ${formatRecipeDate(recipe.created_at)}`}>{formatRecipeDate(recipe.created_at)}</span>
      </div>

      <div className="mb-3 ml-7 space-y-1 text-xs text-gray-500">
        <div title="Recommended selling price based on ingredient costs and target profit margin">
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
            <LoadingSkeleton variant="text" width="w-24" height="h-4" className="ml-1" />
          )}
        </div>
        {recipePrices[recipe.id] && (
          <>
            <div title={`Profit margin: ${recipePrices[recipe.id].gross_profit_margin >= 30 ? 'Excellent' : 'Good'} - Percentage of profit relative to selling price`}>
              <span className="font-medium">Profit Margin:</span>
              <span className="ml-1 text-white">
                {recipePrices[recipe.id].gross_profit_margin.toFixed(1)}%
              </span>
              <span className="ml-1 text-gray-400">
                (${recipePrices[recipe.id].gross_profit.toFixed(2)} profit/portion)
              </span>
            </div>
            <div title="Contributing margin: Profit after variable costs - helps cover fixed costs">
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
        {!recipePrices[recipe.id] && (
          <div className="text-xs text-gray-600 italic" title="Click Preview to see cost breakdown">
            Price calculation pending...
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="ml-7 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreviewRecipe(recipe);
          }}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          title="View full recipe details, ingredients, and instructions"
        >
          Preview
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditRecipe(recipe);
          }}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
          aria-label={`Edit recipe ${capitalizeRecipeName(recipe.name)}`}
          title="Edit recipe in builder"
        >
          <Icon icon={Edit} size="xs" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRecipe(recipe);
          }}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-red-400"
          aria-label={`Delete recipe ${capitalizeRecipeName(recipe.name)}`}
          title="Delete this recipe"
        >
          <Icon icon={Trash2} size="xs" />
        </button>
      </div>
    </div>
  );
});

export default RecipeCard;
