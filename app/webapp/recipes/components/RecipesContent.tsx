'use client';

import { Recipe, RecipePriceData } from '../types';
import { RecipeFilters } from '../hooks/useRecipeFiltering';
import { TablePagination } from '@/components/ui/TablePagination';
import RecipeCard from './RecipeCard';
import RecipeTable from './RecipeTable';
import { RecipeFilterBar } from './RecipeFilterBar';

interface RecipesContentProps {
  recipes: Recipe[];
  filteredAndSortedRecipes: Recipe[];
  paginatedRecipes: Recipe[];
  recipePrices: Record<string, RecipePriceData>;
  selectedRecipes: Set<string>;
  filters: RecipeFilters;
  totalPages: number;
  updateFilters: (updates: Partial<RecipeFilters>) => void;
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
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow">
      <RecipeFilterBar
        recipes={recipes}
        searchTerm={filters.searchTerm}
        categoryFilter={filters.categoryFilter}
        excludeAllergens={filters.excludeAllergens}
        includeAllergens={filters.includeAllergens}
        vegetarian={filters.vegetarian}
        vegan={filters.vegan}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
        itemsPerPage={filters.itemsPerPage}
        onSearchChange={term => updateFilters({ searchTerm: term })}
        onCategoryFilterChange={category => updateFilters({ categoryFilter: category })}
        onExcludeAllergensChange={allergens => updateFilters({ excludeAllergens: allergens })}
        onIncludeAllergensChange={allergens => updateFilters({ includeAllergens: allergens })}
        onVegetarianChange={vegetarian => updateFilters({ vegetarian })}
        onVeganChange={vegan => updateFilters({ vegan })}
        onSortChange={(field, direction) =>
          updateFilters({ sortField: field, sortDirection: direction })
        }
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
      />
      <div className="tablet:px-6 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]" suppressHydrationWarning>
            Recipes ({filteredAndSortedRecipes.length}
            {filteredAndSortedRecipes.length !== recipes.length && ` of ${recipes.length}`})
          </h2>
          {selectedRecipes.size > 0 && (
            <div className="flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-error)] to-[#dc2626]">
                <span className="text-xs font-bold text-[var(--button-active-text)]">
                  {selectedRecipes.size}
                </span>
              </div>
              <span className="text-sm text-[var(--foreground-secondary)]">
                {selectedRecipes.size} selected
              </span>
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
        <div className="divide-y divide-[var(--muted)]">
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
