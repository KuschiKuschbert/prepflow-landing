import { TablePagination } from '@/components/ui/TablePagination';
import { Dish, Recipe, DishCostData, RecipePriceData } from '../types';
import DishCard from './DishCard';
import DishTable from './DishTable';
import RecipeCard from './RecipeCard';
import RecipeTable from './RecipeTable';

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
    currentPage: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  isSelectionMode: boolean;
  capitalizeRecipeName: (name: string) => string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
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

  // Wrapper functions to handle type conversion for sort callbacks
  const handleDishSortChange = (field: DishSortField, direction: 'asc' | 'desc') => {
    onSortChange(field as string, direction);
  };

  const handleRecipeSortChange = (field: RecipeSortField, direction: 'asc' | 'desc') => {
    onSortChange(field as string, direction);
  };

  // Wrapper functions for long press handlers (DishTable and RecipeTable expect no parameters)
  const handleDishStartLongPress = () => {
    // DishTable doesn't pass itemId, so we can't use it here
    // This is a limitation of the current implementation
  };

  const handleDishCancelLongPress = () => {
    onCancelLongPress();
  };

  const handleRecipeStartLongPress = () => {
    // RecipeTable doesn't pass itemId, so we can't use it here
    // This is a limitation of the current implementation
  };

  const handleRecipeCancelLongPress = () => {
    onCancelLongPress();
  };

  return (
    <>
      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        total={allItems.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        className="mb-4"
      />

      {/* Mobile Card Layout */}
      <div className="large-desktop:hidden block">
        <div className="divide-y divide-[#2a2a2a]">
          {paginatedItems.map(item => {
            if (item.itemType === 'dish') {
              return (
                <DishCard
                  key={item.id}
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
                  key={item.id}
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
      <div className="tablet:block hidden space-y-6">
        {/* Dishes Table */}
        {paginatedDishesList.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#29E7CD]/60"></span>
              <span>Dishes</span>
              <span className="text-sm font-normal text-gray-400">
                ({paginatedDishesList.length})
              </span>
            </h3>
            <DishTable
              dishes={paginatedDishesList}
              dishCosts={dishCosts}
              selectedDishes={selectedItems}
              highlightingRowId={highlightingRowType === 'dish' ? highlightingRowId : null}
              onSelectAll={onSelectAll}
              onSelectDish={onSelectItem}
              onPreviewDish={onPreviewDish}
              onEditDish={onEditDish}
              onDeleteDish={onDeleteDish}
              sortField={filters.sortField as DishSortField | undefined}
              sortDirection={filters.sortDirection}
              onSortChange={handleDishSortChange}
              isSelectionMode={isSelectionMode}
              onStartLongPress={handleDishStartLongPress}
              onCancelLongPress={handleDishCancelLongPress}
              onEnterSelectionMode={onEnterSelectionMode}
            />
          </div>
        )}

        {/* Recipes Table */}
        {paginatedRecipesList.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]/60"></span>
              <span>Recipes</span>
              <span className="text-sm font-normal text-gray-400">
                ({paginatedRecipesList.length})
              </span>
            </h3>
            <RecipeTable
              recipes={paginatedRecipesList}
              recipePrices={recipePrices}
              selectedRecipes={selectedItems}
              highlightingRowId={highlightingRowType === 'recipe' ? highlightingRowId : null}
              onSelectAll={onSelectAll}
              onSelectRecipe={onSelectItem}
              onPreviewRecipe={onPreviewRecipe}
              onEditRecipe={onEditRecipe}
              onDeleteRecipe={onDeleteRecipe}
              capitalizeRecipeName={capitalizeRecipeName}
              sortField={filters.sortField as RecipeSortField | undefined}
              sortDirection={filters.sortDirection}
              onSortChange={handleRecipeSortChange}
              isSelectionMode={isSelectionMode}
              onStartLongPress={handleRecipeStartLongPress}
              onCancelLongPress={handleRecipeCancelLongPress}
              onEnterSelectionMode={onEnterSelectionMode}
            />
          </div>
        )}
      </div>

      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        total={allItems.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        className="mt-4"
      />

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
