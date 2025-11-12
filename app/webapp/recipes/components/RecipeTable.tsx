'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';
import { Edit, Trash2, Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
              <button
                onClick={onSelectAll}
                className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                aria-label={selectedRecipes.size === recipes.length ? 'Deselect all' : 'Select all'}
              >
                {selectedRecipes.size === recipes.length && recipes.length > 0 ? (
                  <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                ) : (
                  <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Recommended Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Profit Margin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Contributing Margin
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
                <button
                  onClick={() => onSelectRecipe(recipe.id)}
                  className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                  aria-label={`${selectedRecipes.has(recipe.id) ? 'Deselect' : 'Select'} recipe ${capitalizeRecipeName(recipe.name)}`}
                >
                  {selectedRecipes.has(recipe.id) ? (
                    <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                  ) : (
                    <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                  )}
                </button>
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
                      {recipe.yield > 1 && (
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          /portion ($
                          {(recipePrices[recipe.id].recommendedPrice * recipe.yield).toFixed(
                            2,
                          )}{' '}
                          total)
                        </span>
                      )}
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
                className="cursor-pointer px-6 py-4 text-sm whitespace-nowrap text-gray-300"
                onClick={() => onPreviewRecipe(recipe)}
              >
                {recipePrices[recipe.id] ? (
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {recipePrices[recipe.id].gross_profit_margin.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-400">
                      ${recipePrices[recipe.id].gross_profit.toFixed(2)}/portion
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td
                className="cursor-pointer px-6 py-4 text-sm whitespace-nowrap text-gray-300"
                onClick={() => onPreviewRecipe(recipe)}
              >
                {recipePrices[recipe.id] ? (
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#D925C7]">
                      ${recipePrices[recipe.id].contributingMargin.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {recipePrices[recipe.id].contributingMarginPercent.toFixed(1)}%/portion
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
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
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
                  >
                    <Icon icon={Edit} size="xs" className="text-white" aria-hidden={true} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteRecipe(recipe)}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80"
                  >
                    <Icon icon={Trash2} size="xs" className="text-white" aria-hidden={true} />
                    Delete
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
