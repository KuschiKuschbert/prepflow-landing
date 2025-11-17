'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';
import { Edit, Trash2, Check, Eye } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatRecipeDate } from '../utils/formatDate';
import { useRecipeTableSort } from '../hooks/useRecipeTableSort';
import { RecipeTableRow } from './RecipeTableRow';

interface RecipeTableProps {
  recipes: Recipe[];
  recipePrices: Record<string, RecipePriceData>;
  selectedRecipes: Set<string>;
  highlightingRowId?: string | null;
  onSelectAll: () => void;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
  sortField?: 'name' | 'recommended_price' | 'profit_margin' | 'contributing_margin' | 'created';
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (
    field: 'name' | 'recommended_price' | 'profit_margin' | 'contributing_margin' | 'created',
    direction: 'asc' | 'desc',
  ) => void;
  isSelectionMode?: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

const RecipeTable = React.memo(function RecipeTable({
  recipes,
  recipePrices,
  selectedRecipes,
  highlightingRowId = null,
  onSelectAll,
  onSelectRecipe,
  onPreviewRecipe,
  onEditRecipe,
  onDeleteRecipe,
  capitalizeRecipeName,
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange,
  isSelectionMode = false,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: RecipeTableProps) {
  const { handleColumnSort, getSortIcon } = useRecipeTableSort({
    sortField,
    sortDirection,
    onSortChange: onSortChange || (() => {}),
  });

  return (
    <div className="desktop:block hidden overflow-x-auto">
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
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('name')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by name"
                >
                  Name
                  {getSortIcon('name')}
                </button>
              ) : (
                'Name'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('recommended_price')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by recommended price"
                >
                  Recommended Price
                  {getSortIcon('recommended_price')}
                </button>
              ) : (
                'Recommended Price'
              )}
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('profit_margin')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by profit margin"
                >
                  Profit Margin
                  {getSortIcon('profit_margin')}
                </button>
              ) : (
                'Profit Margin'
              )}
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('contributing_margin')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by contributing margin"
                >
                  Contributing Margin
                  {getSortIcon('contributing_margin')}
                </button>
              ) : (
                'Contributing Margin'
              )}
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('created')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by created date"
                >
                  Created
                  {getSortIcon('created')}
                </button>
              ) : (
                'Created'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <span>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
          {recipes.map(recipe => (
            <RecipeTableRow
              key={recipe.id}
              recipe={recipe}
              recipePrice={recipePrices[recipe.id]}
              selectedRecipes={selectedRecipes}
              isSelectionMode={isSelectionMode}
              isHighlighting={highlightingRowId === recipe.id}
              onSelectRecipe={onSelectRecipe}
              onPreviewRecipe={onPreviewRecipe}
              onEditRecipe={onEditRecipe}
              onDeleteRecipe={onDeleteRecipe}
              capitalizeRecipeName={capitalizeRecipeName}
              onCancelLongPress={onCancelLongPress}
              onEnterSelectionMode={onEnterSelectionMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default RecipeTable;
