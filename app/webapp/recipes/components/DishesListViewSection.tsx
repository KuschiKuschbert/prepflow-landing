'use client';
import { DishesListView } from './DishesListView';
import { DishesSidePanels } from './DishesSidePanels';
import { Dish, Recipe, DishCostData, RecipePriceData } from '../types';
import { DishSortField } from '../hooks/useDishFiltering';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

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
  filters: {
    currentPage: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  isSelectionMode: boolean;
  capitalizeRecipeName: (name: string) => string;
  showDishPanel: boolean;
  selectedDishForPreview: Dish | null;
  showRecipePanel: boolean;
  selectedRecipeForPreview: Recipe | null;
  recipeIngredients: any[];
  previewYield: number;
  showDeleteConfirm: boolean;
  itemToDelete: any;
  showDishEditDrawer: boolean;
  editingDish: Dish | null;
  sidePanelsHandlers: any;
  updateFilters: (filters: any) => void;
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
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onPreviewDish={handlePreviewDish}
        onPreviewRecipe={handlePreviewRecipe}
        onEditDish={handleEditDish}
        onEditRecipe={handleEditRecipe}
        onDeleteDish={handleDeleteDish}
        onDeleteRecipe={handleDeleteRecipe}
        onSortChange={(field: string, direction: 'asc' | 'desc') =>
          updateFilters({ sortField: field as DishSortField, sortDirection: direction })
        }
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
