'use client';

import { Dish, DishCostData, Recipe, RecipePriceData } from '@/lib/types/recipes';
import DishCard from './DishCard';
import { DishesEmptyState } from './DishesEmptyState';
import { DishesListPagination, DishesListSearch } from './DishesListControls';
import RecipeCard from './RecipeCard';
import { UnifiedItem } from '@/lib/types/recipes';
import { UnifiedTable } from './UnifiedTable';
interface DishesListViewProps {
  allItems: UnifiedItem[];
  paginatedItems: UnifiedItem[];
  paginatedDishesList: (Dish & { itemType: 'dish' })[];
  paginatedRecipesList: (Recipe & { itemType: 'recipe' })[];
  dishCosts: Map<string, DishCostData>;
  recipePrices: Record<string, RecipePriceData>;
  selectedItems: Set<string>;
  highlightingRowId: string | null;
  highlightingRowType: 'recipe' | 'dish' | null;
  filters: {
    searchTerm?: string;
    currentPage: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    itemType?: 'all' | 'dish' | 'recipe';
  };
  isSelectionMode: boolean;
  capitalizeRecipeName: (name: string) => string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSearchChange?: (term: string) => void;
  onItemTypeChange?: (type: 'all' | 'dish' | 'recipe') => void;
  onSelectAll: () => void;
  onSelectItem: (itemId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditDish: (dish: Dish) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteDish: (dish: Dish) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  onStartLongPress: (itemId: string) => void;
  onCancelLongPress: () => void;
  onEnterSelectionMode: () => void;
  onViewModeChange: (mode: 'builder') => void;
}
export function DishesListView({
  allItems,
  paginatedItems,
  paginatedDishesList: _paginatedDishesList,
  paginatedRecipesList: _paginatedRecipesList,
  dishCosts,
  recipePrices,
  selectedItems,
  highlightingRowId,
  highlightingRowType,
  filters,
  isSelectionMode,
  capitalizeRecipeName,
  onPageChange,
  onItemsPerPageChange,
  onSearchChange,
  onItemTypeChange,
  onSelectAll,
  onSelectItem,
  onPreviewDish,
  onPreviewRecipe,
  onEditDish,
  onEditRecipe,
  onDeleteDish,
  onDeleteRecipe,
  onSortChange,
  onStartLongPress: _onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
  onViewModeChange,
}: DishesListViewProps) {
  const totalPages = Math.ceil(allItems.length / filters.itemsPerPage);
  const searchTerm = filters.searchTerm || '';
  const itemType = filters.itemType ?? 'all';

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <DishesListSearch
          searchTerm={searchTerm}
          itemsPerPage={filters.itemsPerPage}
          itemType={itemType}
          onSearchChange={onSearchChange}
          onItemsPerPageChange={onItemsPerPageChange}
          onItemTypeChange={onItemTypeChange}
        />

        {/* Mobile/Tablet Card Layout - hidden at desktop (1025px+) */}
        <div className="desktop:hidden block">
          <div className="divide-y divide-[var(--muted)]">
            {paginatedItems.map(item => {
              if (item.itemType === 'dish') {
                return (
                  <DishCard
                    key={`dish-${item.id}`}
                    dish={item}
                    dishCost={dishCosts.get(item.id)}
                    selectedDishes={selectedItems}
                    onSelectDish={onSelectItem}
                    onPreviewDish={onPreviewDish}
                    onEditDish={onEditDish}
                    onDeleteDish={onDeleteDish}
                  />
                );
              } else {
                return (
                  <RecipeCard
                    key={`recipe-${item.id}`}
                    recipe={item}
                    recipePrices={recipePrices}
                    selectedRecipes={selectedItems}
                    onSelectRecipe={onSelectItem}
                    onPreviewRecipe={onPreviewRecipe}
                    onEditRecipe={onEditRecipe}
                    onDeleteRecipe={onDeleteRecipe}
                    capitalizeRecipeName={capitalizeRecipeName}
                  />
                );
              }
            })}
          </div>
        </div>

        {/* Desktop Table Layout - visible at 1025px+ only */}
        <div className="desktop:block hidden p-4">
          {paginatedItems.length > 0 ? (
            <UnifiedTable
              items={paginatedItems}
              dishCosts={dishCosts}
              recipePrices={recipePrices}
              selectedItems={selectedItems}
              highlightingRowId={highlightingRowId}
              highlightingRowType={highlightingRowType}
              sortField={filters.sortField}
              sortDirection={filters.sortDirection}
              isSelectionMode={isSelectionMode}
              capitalizeRecipeName={capitalizeRecipeName}
              capitalizeDishName={(name: string) =>
                name
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')
              }
              onSelectAll={onSelectAll}
              onSelectItem={onSelectItem}
              onPreviewDish={onPreviewDish}
              onPreviewRecipe={onPreviewRecipe}
              onEditDish={onEditDish}
              onEditRecipe={onEditRecipe}
              onDeleteDish={onDeleteDish}
              onDeleteRecipe={onDeleteRecipe}
              onSortChange={onSortChange}
              onStartLongPress={() => {
                // Unified table handles long press internally
              }}
              onCancelLongPress={onCancelLongPress}
              onEnterSelectionMode={onEnterSelectionMode}
            />
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl text-[var(--foreground-muted)]">🍽️</div>
              <h3 className="mb-2 text-lg font-medium text-[var(--foreground)]">
                No dishes or recipes found
              </h3>
              <p className="text-[var(--foreground-subtle)]">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Single pagination bar - 2026 style, no top/bottom duplication */}
      <div className="mt-4">
        <DishesListPagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          totalItems={allItems.length}
          itemsPerPage={filters.itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>

      {/* Empty State */}
      {allItems.length === 0 && <DishesEmptyState onViewModeChange={onViewModeChange} />}
    </>
  );
}
