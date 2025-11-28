import { Icon } from '@/components/ui/Icon';
import { Search, X } from 'lucide-react';
import { Dish, DishCostData, Recipe, RecipePriceData } from '../types';
import DishCard from './DishCard';
import RecipeCard from './RecipeCard';
import { UnifiedTable } from './UnifiedTable';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

type DishSortField = 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';
type RecipeSortField =
  | 'name'
  | 'recommended_price'
  | 'profit_margin'
  | 'contributing_margin'
  | 'created';
type UnifiedSortField = DishSortField | RecipeSortField;

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
  };
  isSelectionMode: boolean;
  capitalizeRecipeName: (name: string) => string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSearchChange?: (term: string) => void;
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
  paginatedDishesList,
  paginatedRecipesList,
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
  onSelectAll,
  onSelectItem,
  onPreviewDish,
  onPreviewRecipe,
  onEditDish,
  onEditRecipe,
  onDeleteDish,
  onDeleteRecipe,
  onSortChange,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
  onViewModeChange,
}: DishesListViewProps) {
  const totalPages = Math.ceil(allItems.length / filters.itemsPerPage);
  const searchTerm = filters.searchTerm || '';

  return (
    <>
      {/* Top Pagination */}
      {allItems.length > 0 && totalPages > 1 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Page {filters.currentPage} of {totalPages} ({allItems.length} items)
          </span>
          <div className="space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, filters.currentPage - 1))}
              disabled={filters.currentPage <= 1}
              className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, filters.currentPage + 1))}
              disabled={filters.currentPage >= totalPages}
              className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Main Container with Search Bar */}
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
        {/* Search Bar - Sticky Filter Bar */}
        {onSearchChange && (
          <div className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 p-3 backdrop-blur-sm">
            {/* Search and Pagination - Optimized Layout */}
            <div className="tablet:flex-row tablet:items-center tablet:gap-2 flex flex-col gap-2">
              <div className="relative min-w-0 flex-1">
                <Icon
                  icon={Search}
                  size="sm"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  aria-hidden={true}
                />
                <input
                  type="text"
                  placeholder="Search dishes and recipes..."
                  value={searchTerm}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-10 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  aria-label="Search dishes and recipes"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                    aria-label="Clear search"
                  >
                    <Icon icon={X} size="sm" aria-hidden={true} />
                  </button>
                )}
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-1.5">
                <label htmlFor="items-per-page" className="text-xs whitespace-nowrap text-gray-400">
                  Per page:
                </label>
                <select
                  id="items-per-page"
                  value={filters.itemsPerPage}
                  onChange={e => onItemsPerPageChange(Number(e.target.value))}
                  className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-2.5 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  title="Items per page"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Card Layout */}
        <div className="large-desktop:hidden block">
          <div className="divide-y divide-[#2a2a2a]">
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

        {/* Desktop Table Layout */}
        <div className="tablet:block hidden p-4">
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
              <div className="mb-4 text-6xl text-gray-400">🍽️</div>
              <h3 className="mb-2 text-lg font-medium text-white">No dishes or recipes found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pagination */}
      {allItems.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Page {filters.currentPage} of {totalPages} ({allItems.length} items)
          </span>
          <div className="space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, filters.currentPage - 1))}
              disabled={filters.currentPage <= 1}
              className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, filters.currentPage + 1))}
              disabled={filters.currentPage >= totalPages}
              className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {allItems.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">🍽️</div>
          <h3 className="mb-2 text-lg font-medium text-white">No dishes or recipes yet</h3>
          <p className="mb-4 text-gray-500">
            Create your first dish or recipe by combining ingredients.
          </p>
          <button
            onClick={() => onViewModeChange('builder')}
            className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-white transition-colors hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
          >
            Create Your First Item
          </button>
        </div>
      )}
    </>
  );
}
