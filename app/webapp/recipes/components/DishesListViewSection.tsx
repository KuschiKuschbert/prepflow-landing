'use client';
import {
  UnifiedFilters,
  UnifiedSortField,
} from '@/app/webapp/recipes/components/hooks/useDishesClientPagination/helpers/useFilterState';
import { useCallback } from 'react';
import {
  Dish,
  DishCostData,
  Recipe,
  RecipeIngredientWithDetails,
  RecipePriceData,
} from '@/lib/types/recipes';
import { DishesListView } from './DishesListView';
import { DishesSidePanels, DishesSidePanelsProps } from './DishesSidePanels';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

type DishesSidePanelsHandlers = Omit<
  DishesSidePanelsProps,
  | 'showDishPanel'
  | 'selectedDishForPreview'
  | 'showRecipePanel'
  | 'selectedRecipeForPreview'
  | 'recipeIngredients'
  | 'previewYield'
  | 'showDeleteConfirm'
  | 'itemToDelete'
  | 'showDishEditDrawer'
  | 'editingDish'
  | 'capitalizeRecipeName'
>;

interface DishesListViewSectionProps {
  allItems: UnifiedItem[];
  paginatedItems: UnifiedItem[];
  paginatedDishesList: (Dish & { itemType: 'dish' })[];
  paginatedRecipesList: (Recipe & { itemType: 'recipe' })[];
  dishCosts: Map<string, DishCostData>;
  recipePrices: Record<string, RecipePriceData>;
  selectedItems: Set<string>;
  highlightingRowId: string | null;
  highlightingRowType: 'recipe' | 'dish' | null;
  filters: UnifiedFilters;
  isSelectionMode: boolean;
  capitalizeRecipeName: (name: string) => string;
  showDishPanel: boolean;
  selectedDishForPreview: Dish | null;
  showRecipePanel: boolean;
  selectedRecipeForPreview: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
  previewYield: number;
  showDeleteConfirm: boolean;
  itemToDelete: UnifiedItem | null;
  showDishEditDrawer: boolean;
  editingDish: Dish | null;
  sidePanelsHandlers: DishesSidePanelsHandlers;
  updateFilters: (filters: Partial<UnifiedFilters>) => void;
  handleSelectAll: () => void;
  handleSelectItem: (itemId: string) => void;
  handlePreviewDish: (dish: Dish) => void;
  handlePreviewRecipe: (recipe: Recipe) => void;
  handleEditDish: (dish: Dish) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  startLongPress: (itemId: string) => void;
  cancelLongPress: () => void;
  enterSelectionMode: () => void;
  setViewMode: (mode: 'list' | 'editor' | 'builder') => void;
}

export function DishesListViewSection({
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
  showDishPanel,
  selectedDishForPreview,
  showRecipePanel,
  selectedRecipeForPreview,
  recipeIngredients,
  previewYield,
  showDeleteConfirm,
  itemToDelete,
  showDishEditDrawer,
  editingDish,
  sidePanelsHandlers,
  updateFilters,
  handleSelectAll,
  handleSelectItem,
  handlePreviewDish,
  handlePreviewRecipe,
  handleEditDish,
  handleEditRecipe,
  handleDeleteDish,
  handleDeleteRecipe,
  startLongPress,
  cancelLongPress,
  enterSelectionMode,
  setViewMode,
}: DishesListViewSectionProps) {
  // Memoize callback functions to prevent unnecessary re-renders
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ currentPage: page });
    },
    [updateFilters],
  );

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage: number) => {
      updateFilters({ itemsPerPage, currentPage: 1 });
    },
    [updateFilters],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      updateFilters({ searchTerm, currentPage: 1 });
    },
    [updateFilters],
  );

  const handleSortChange = useCallback(
    (field: string, direction: 'asc' | 'desc') => {
      // Accept both dish and recipe sort fields
      updateFilters({ sortField: field as UnifiedSortField, sortDirection: direction });
    },
    [updateFilters],
  );

  const handleItemTypeChange = useCallback(
    (itemType: 'all' | 'dish' | 'recipe') => {
      updateFilters({ itemType });
    },
    [updateFilters],
  );

  return (
    <>
      <DishesListView
        allItems={allItems}
        paginatedItems={paginatedItems}
        paginatedDishesList={paginatedDishesList}
        paginatedRecipesList={paginatedRecipesList}
        dishCosts={dishCosts}
        recipePrices={recipePrices}
        selectedItems={selectedItems}
        highlightingRowId={highlightingRowId}
        highlightingRowType={highlightingRowType}
        filters={filters}
        isSelectionMode={isSelectionMode}
        capitalizeRecipeName={capitalizeRecipeName}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onSearchChange={handleSearchChange}
        onItemTypeChange={handleItemTypeChange}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onPreviewDish={handlePreviewDish}
        onPreviewRecipe={handlePreviewRecipe}
        onEditDish={handleEditDish}
        onEditRecipe={handleEditRecipe}
        onDeleteDish={handleDeleteDish}
        onDeleteRecipe={handleDeleteRecipe}
        onSortChange={handleSortChange}
        onStartLongPress={startLongPress}
        onCancelLongPress={cancelLongPress}
        onEnterSelectionMode={enterSelectionMode}
        onViewModeChange={setViewMode}
      />
      <DishesSidePanels
        showDishPanel={showDishPanel}
        selectedDishForPreview={selectedDishForPreview}
        showRecipePanel={showRecipePanel}
        selectedRecipeForPreview={selectedRecipeForPreview}
        recipeIngredients={recipeIngredients}
        previewYield={previewYield}
        showDeleteConfirm={showDeleteConfirm}
        itemToDelete={itemToDelete}
        showDishEditDrawer={showDishEditDrawer}
        editingDish={editingDish}
        capitalizeRecipeName={capitalizeRecipeName}
        {...sidePanelsHandlers}
      />
    </>
  );
}
