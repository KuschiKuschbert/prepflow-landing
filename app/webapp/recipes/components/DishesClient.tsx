'use client';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatRecipeName } from '@/lib/text-utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAIInstructions } from '../hooks/useAIInstructions';
import { useRecipeIngredients } from '../hooks/useRecipeIngredients';
import { useRecipePricing } from '../hooks/useRecipePricing';
import { Dish, Recipe } from '../types';
import { DishesBulkActionsSection } from './DishesBulkActionsSection';
import { DishesListViewSection } from './DishesListViewSection';
import { DishesModalsSection } from './DishesModalsSection';
import { DishesViewModeToggle } from './DishesViewModeToggle';
import { DishesEditorView } from './DishesEditorView';
import { ErrorBanner } from './DishesClient/components/ErrorBanner';
import { useDishesClientData } from './hooks/useDishesClientData';
import { useDishesClientViewMode } from './hooks/useDishesClientViewMode';
import { useDishesClientPreview } from './hooks/useDishesClientPreview';
import { useDishesClientHandlers } from './hooks/useDishesClientHandlers';
import { useDishesClientSelection } from './hooks/useDishesClientSelection';
import { useDishesClientPagination } from './hooks/useDishesClientPagination';
import { useDishesClientRecipePricing } from './hooks/useDishesClientRecipePricing';
import { useDishesSidePanelsHandlers } from './hooks/useDishesSidePanelsHandlers';
import { useDishesClientBulkActions } from './DishesClient/hooks/useDishesClientBulkActions';
import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import { createRecipeImagesGeneratedHandler } from './DishesClient/helpers/handleRecipeImagesGenerated';
export default function DishesClient() {
  const { viewMode, setViewMode } = useDishesClientViewMode();
  const { recipePrices, updateVisibleRecipePrices } = useRecipePricing();
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
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError);
  const capitalizeRecipeName = formatRecipeName;
  const { generateAIInstructions } = useAIInstructions();
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
  const {
    selectedItems,
    isSelectionMode,
    handleSelectItem,
    handleSelectAll,
    handleExitSelectionMode,
  } = useDishesClientSelection(dishes, recipes);
  const {
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    filters,
    updateFilters,
  } = useDishesClientPagination({ dishes, recipes, dishCosts, recipePrices });
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
    setError,
  });
  const { startLongPress, cancelLongPress, enterSelectionMode } = useSelectionMode();
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
  useDishesClientRecipePricing({
    paginatedRecipesList,
    recipePrices,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
  });
  const selectedItemTypes = useMemo(() => {
    const types = new Map<string, 'recipe' | 'dish'>();
    dishes.forEach(d => { if (selectedItems.has(d.id)) types.set(d.id, 'dish'); });
    recipes.forEach(r => { if (selectedItems.has(r.id)) types.set(r.id, 'recipe'); });
    return types;
  }, [dishes, recipes, selectedItems]);

  const {
    bulkActionLoading,
    bulkShareLoading,
    addToMenuLoading,
    showBulkMenu,
    setShowBulkMenu,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    handleBulkShare,
    handleBulkAddToMenu,
    handleSelectMenu,
    handleCreateNewMenu,
    menus,
    loadingMenus,
    showMenuDialog,
    setShowMenuDialog,
    selectedRecipeIds,
    selectedDishIds,
  } = useDishesClientBulkActions({
    dishes,
    recipes,
    selectedItems,
    selectedItemTypes,
    setDishes,
    setRecipes,
    onClearSelection: handleExitSelectionMode,
  });

  const selectedRecipeCount = selectedRecipeIds.length;
  const handleRecipeImagesGenerated = useCallback(createRecipeImagesGeneratedHandler(setRecipes, selectedRecipeForPreview, setSelectedRecipeForPreview), [setRecipes, selectedRecipeForPreview, setSelectedRecipeForPreview]);

  const sidePanelsHandlers = useDishesSidePanelsHandlers({
    setShowDishPanel,
    setSelectedDishForPreview,
    setShowRecipePanel,
    setSelectedRecipeForPreview,
    setRecipeIngredients,
    setShowDishEditDrawer,
    setEditingDish,
    handleEditDish,
    handleDeleteDish,
    handleEditRecipe,
    handleDeleteRecipe,
    confirmDeleteItem,
    cancelDeleteItem,
    fetchItems,
    onRecipeImagesGenerated: handleRecipeImagesGenerated,
  });
  if (loading) return <PageSkeleton />;
  return (
    <div>
      <ErrorBanner error={error} />
      <DishesBulkActionsSection
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.size}
        selectedRecipeCount={selectedRecipeCount}
        bulkActionLoading={bulkActionLoading}
        bulkShareLoading={bulkShareLoading}
        addToMenuLoading={addToMenuLoading}
        showBulkMenu={showBulkMenu}
        onExitSelectionMode={handleExitSelectionMode}
        onBulkDelete={handleBulkDelete}
        onBulkShare={() => handleBulkShare('pdf')}
        onBulkAddToMenu={handleBulkAddToMenu}
        onToggleBulkMenu={() => setShowBulkMenu(!showBulkMenu)}
      />
      <DishesModalsSection
        showMenuDialog={showMenuDialog}
        menus={menus}
        loadingMenus={loadingMenus}
        showBulkDeleteConfirm={showBulkDeleteConfirm}
        selectedItems={selectedItems}
        selectedItemTypes={selectedItemTypes}
        recipes={recipes}
        dishes={dishes}
        capitalizeRecipeName={capitalizeRecipeName}
        onCloseMenuDialog={() => setShowMenuDialog(false)}
        onSelectMenu={handleSelectMenu}
        onCreateNewMenu={handleCreateNewMenu}
        onConfirmBulkDelete={confirmBulkDelete}
        onCancelBulkDelete={cancelBulkDelete}
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
        <DishesListViewSection
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
          sidePanelsHandlers={sidePanelsHandlers}
          updateFilters={updateFilters}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          handlePreviewDish={handlePreviewDish}
          handlePreviewRecipe={handlePreviewRecipe}
          handleEditDish={handleEditDish}
          handleEditRecipe={handleEditRecipe}
          handleDeleteDish={handleDeleteDish}
          handleDeleteRecipe={handleDeleteRecipe}
          startLongPress={startLongPress}
          cancelLongPress={cancelLongPress}
          enterSelectionMode={enterSelectionMode}
          setViewMode={setViewMode}
        />
      )}
    </div>
  );
}
