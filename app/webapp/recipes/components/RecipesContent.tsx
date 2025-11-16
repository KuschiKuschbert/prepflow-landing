'use client';

import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeSortField } from '../hooks/useRecipeFiltering';
import { TablePagination } from '@/components/ui/TablePagination';
import RecipeCard from './RecipeCard';
import RecipeTable from './RecipeTable';
import { RecipeFilterBar } from './RecipeFilterBar';

interface RecipesContentProps {
  recipes: Recipe[];
  filteredAndSortedRecipes: Recipe[];
  paginatedRecipes: Recipe[];
  recipePrices: Record<string, any>;
  selectedRecipes: Set<string>;
  filters: {
    searchTerm: string;
    categoryFilter: string;
    sortField: RecipeSortField;
    sortDirection: 'asc' | 'desc';
    itemsPerPage: number;
    currentPage: number;
  };
  totalPages: number;
  updateFilters: (updates: Partial<RecipesContentProps['filters']>) => void;
  handleSelectRecipe: (recipeId: string) => void;
  handleSelectAll: () => void;
  handlePreviewRecipe: (recipe: Recipe) => void;
  handleEditRecipeFromCard: (recipe: Recipe) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
}

export function RecipesContent({
  recipes,
  filteredAndSortedRecipes,
  paginatedRecipes,
  recipePrices,
  selectedRecipes,
  filters,
  totalPages,
  updateFilters,
  handleSelectRecipe,
  handleSelectAll,
  handlePreviewRecipe,
  handleEditRecipeFromCard,
  handleDeleteRecipe,
  capitalizeRecipeName,
}: RecipesContentProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow">
      <RecipeFilterBar
        recipes={recipes}
        searchTerm={filters.searchTerm}
        categoryFilter={filters.categoryFilter}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
        itemsPerPage={filters.itemsPerPage}
        onSearchChange={term => updateFilters({ searchTerm: term })}
        onCategoryFilterChange={category => updateFilters({ categoryFilter: category })}
        onSortChange={(field, direction) =>
          updateFilters({ sortField: field, sortDirection: direction })
        }
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
      />
      <div className="tablet:px-6 border-b border-[#2a2a2a] bg-[#1f1f1f] px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white" suppressHydrationWarning>
            Recipes ({filteredAndSortedRecipes.length}
            {filteredAndSortedRecipes.length !== recipes.length && ` of ${recipes.length}`})
          </h2>
          {selectedRecipes.size > 0 && (
            <div className="flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
                <span className="text-xs font-bold text-white">{selectedRecipes.size}</span>
              </div>
              <span className="text-sm text-gray-300">{selectedRecipes.size} selected</span>
            </div>
          )}
        </div>
      </div>
      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        total={filteredAndSortedRecipes.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        className="mb-4"
      />

      <div className="large-desktop:hidden block">
        <div className="divide-y divide-[#2a2a2a]">
          {paginatedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              recipePrices={recipePrices}
              selectedRecipes={selectedRecipes}
              onSelectRecipe={recipeId => handleSelectRecipe(recipeId)}
              onPreviewRecipe={handlePreviewRecipe}
              onEditRecipe={handleEditRecipeFromCard}
              onDeleteRecipe={handleDeleteRecipe}
              capitalizeRecipeName={capitalizeRecipeName}
            />
          ))}
        </div>
      </div>
      <RecipeTable
        recipes={paginatedRecipes}
        recipePrices={recipePrices}
        selectedRecipes={selectedRecipes}
        onSelectAll={handleSelectAll}
        onSelectRecipe={recipeId => handleSelectRecipe(recipeId)}
        onPreviewRecipe={handlePreviewRecipe}
        onEditRecipe={handleEditRecipeFromCard}
        onDeleteRecipe={handleDeleteRecipe}
        capitalizeRecipeName={capitalizeRecipeName}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
        onSortChange={(field, direction) =>
          updateFilters({ sortField: field, sortDirection: direction })
        }
      />

      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        total={filteredAndSortedRecipes.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        className="mt-4"
      />
    </div>
  );
}
