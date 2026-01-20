'use client';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { DishesBulkActionsSection } from './DishesBulkActionsSection';
import { ErrorBanner } from './DishesClient/components/ErrorBanner';
import { DishesEditorView } from './DishesEditorView';
import { DishesListViewSection } from './DishesListViewSection';
import { DishesModalsSection } from './DishesModalsSection';
import { DishesViewModeToggle } from './DishesViewModeToggle';
import { useDishesClientController } from './hooks/useDishesClientController';
export default function DishesClient() {
  const {
    loading,
    error,
    viewMode,
    setViewMode,
    isSelectionMode,
    selectedItems,
    selectedRecipeCount,
    handleExitSelectionMode,
    bulkActionLoading,
    showBulkMenu,
    setShowBulkMenu,
    handleBulkDelete,
    handleBulkShare,
    handleBulkAddToMenu,
    showBulkDeleteConfirm,
    confirmBulkDelete,
    cancelBulkDelete,
    showMenuDialog,
    setShowMenuDialog,
    menus,
    loadingMenus,
    selectedItemTypes,
    recipes,
    dishes,
    capitalizeRecipeName,
    handleSelectMenu,
    handleCreateNewMenu,
    editingItem,
    setEditingItem,
    editingRecipe,
    setEditingRecipe,
    fetchItems,
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    dishCosts,
    recipePrices,
    highlightingRowId,
    highlightingRowType,
    filters,
    updateFilters,
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
  } = useDishesClientController();

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <ErrorBanner error={error} />
      <DishesBulkActionsSection
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.size}
        selectedRecipeCount={selectedRecipeCount}
        bulkActionLoading={bulkActionLoading}
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
