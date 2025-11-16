'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatRecipeName } from '@/lib/text-utils';
import { useCallback, useEffect, useState } from 'react';
import { useAIInstructions } from '../hooks/useAIInstructions';
import { useRecipeIngredients } from '../hooks/useRecipeIngredients';
import { useRecipePricing } from '../hooks/useRecipePricing';
import { Dish, Recipe } from '../types';
import { SelectionModeBanner } from './SelectionModeBanner';
import { SuccessMessage } from './SuccessMessage';
import { DishesListView } from './DishesListView';
import { DishesViewModeToggle } from './DishesViewModeToggle';
import { DishesEditorView } from './DishesEditorView';
import { DishesSidePanels } from './DishesSidePanels';
import { useDishesClientData } from './hooks/useDishesClientData';
import { useDishesClientViewMode } from './hooks/useDishesClientViewMode';
import { useDishesClientPreview } from './hooks/useDishesClientPreview';
import { useDishesClientHandlers } from './hooks/useDishesClientHandlers';
import { useDishesClientSelection } from './hooks/useDishesClientSelection';
import { useDishesClientPagination } from './hooks/useDishesClientPagination';
import { useDishesClientRecipePricing } from './hooks/useDishesClientRecipePricing';
import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import { DishSortField } from '../hooks/useDishFiltering';

export default function DishesClient() {
  const { viewMode, setViewMode } = useDishesClientViewMode();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recipe pricing hooks
  const { recipePrices, updateVisibleRecipePrices } = useRecipePricing();
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError => {
    // Error handling
  });
  const capitalizeRecipeName = formatRecipeName;

  // AI Instructions hook
  const { generateAIInstructions } = useAIInstructions();

  // Data fetching
  const {
    dishes,
    recipes,
    loading,
    error,
    dishCosts,
    setDishes,
    setRecipes,
    setError,
    fetchItems,
  } = useDishesClientData();

  // Preview state
  const previewState = useDishesClientPreview({
    fetchRecipeIngredients,
    generateAIInstructions,
    setError,
  });
  const {
    selectedRecipeForPreview,
    setSelectedRecipeForPreview,
    recipeIngredients,
    setRecipeIngredients,
    showRecipePanel,
    setShowRecipePanel,
    previewYield,
    selectedDishForPreview,
    setSelectedDishForPreview,
    showDishPanel,
    setShowDishPanel,
    editingDish,
    setEditingDish,
    showDishEditDrawer,
    setShowDishEditDrawer,
    editingRecipe,
    setEditingRecipe,
    editingItem,
    setEditingItem,
    highlightingRowId,
    setHighlightingRowId,
    highlightingRowType,
    setHighlightingRowType,
    handlePreviewDish,
    handlePreviewRecipe,
  } = previewState;

  // Selection
  const {
    selectedItems,
    isSelectionMode,
    handleSelectItem,
    handleSelectAll,
    handleExitSelectionMode,
  } = useDishesClientSelection(dishes, recipes);

  // Pagination
  const {
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    filters,
    updateFilters,
  } = useDishesClientPagination({ dishes, recipes, dishCosts });

  const {
    showDeleteConfirm,
    itemToDelete,
    handleEditDish,
    handleEditRecipe,
    handleDeleteDish,
    handleDeleteRecipe,
    confirmDeleteItem,
    cancelDeleteItem,
  } = useDishesClientHandlers({
    dishes,
    recipes,
    viewMode,
    editingItem,
    setDishes,
    setRecipes,
    setViewMode,
    setEditingItem,
    setEditingRecipe,
    setShowRecipePanel,
    setSelectedRecipeForPreview,
    setHighlightingRowId,
    setHighlightingRowType,
    setSuccessMessage,
    setError,
  });

  // Selection mode for long press
  const { startLongPress, cancelLongPress, enterSelectionMode } = useSelectionMode();

  // Refresh items when switching from builder/editor to list view
  useEffect(() => {
    if (viewMode === 'list') {
      fetchItems();
      setEditingRecipe(null);
      setEditingItem(null);
      setHighlightingRowId(null);
      setHighlightingRowType(null);
    }
  }, [
    viewMode,
    fetchItems,
    setEditingRecipe,
    setEditingItem,
    setHighlightingRowId,
    setHighlightingRowType,
  ]);

  // Calculate recipe prices for visible recipes
  useDishesClientRecipePricing({
    paginatedRecipesList,
    recipePrices,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
  });

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div>
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Selection Mode Banner */}
      <SelectionModeBanner
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.size}
        onExitSelectionMode={handleExitSelectionMode}
      />

      <DishesViewModeToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onEditorClick={() => {
          setViewMode('editor');
          setEditingItem(null);
        }}
      />

      <DishesEditorView
        viewMode={viewMode}
        editingItem={editingItem}
        editingRecipe={editingRecipe}
        onViewModeChange={setViewMode}
        onEditingItemChange={setEditingItem}
        onEditingRecipeChange={setEditingRecipe}
        onSave={fetchItems}
      />

      {viewMode === 'list' && (
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
            onSortChange={(field: string, direction: 'asc' | 'desc') => {
              // Cast to DishSortField since updateFilters expects it (unified view uses dish filtering)
              updateFilters({ sortField: field as DishSortField, sortDirection: direction });
            }}
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
            onDishPanelClose={() => {
              setShowDishPanel(false);
              setSelectedDishForPreview(null);
            }}
            onDishEdit={dish => {
              setShowDishPanel(false);
              setSelectedDishForPreview(null);
              handleEditDish(dish);
            }}
            onDishDelete={dish => {
              setShowDishPanel(false);
              setSelectedDishForPreview(null);
              handleDeleteDish(dish);
            }}
            onRecipePanelClose={() => {
              setShowRecipePanel(false);
              setSelectedRecipeForPreview(null);
              setRecipeIngredients([]);
            }}
            onRecipeEdit={recipe => {
              setShowRecipePanel(false);
              setSelectedRecipeForPreview(null);
              handleEditRecipe(recipe);
            }}
            onRecipeDelete={recipe => {
              setShowRecipePanel(false);
              setSelectedRecipeForPreview(null);
              handleDeleteRecipe(recipe);
            }}
            onDeleteConfirm={confirmDeleteItem}
            onDeleteCancel={cancelDeleteItem}
            onDishEditDrawerClose={() => {
              setShowDishEditDrawer(false);
              setEditingDish(null);
            }}
            onDishEditDrawerSave={async () => {
              await fetchItems();
            }}
          />
        </>
      )}
    </div>
  );
}
