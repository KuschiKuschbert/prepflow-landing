'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { logger } from '@/lib/logger';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAIInstructions } from '../hooks/useAIInstructions';
import { useRecipeActions } from '../hooks/useRecipeActions';
import { useRecipeAutosaveListener } from '../hooks/useRecipeAutosaveListener';
import { useRecipeManagement } from '../hooks/useRecipeManagement';
import { useRecipeFiltering } from '../hooks/useRecipeFiltering';
import { useRecipeRefreshEffects } from '../hooks/useRecipeRefreshEffects';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { TablePagination } from '@/components/ui/TablePagination';
import { RecipesEmptyState } from './RecipesEmptyState';
import { RecipesErrorDisplay } from './RecipesErrorDisplay';
import { UnifiedBulkActionsMenu } from './UnifiedBulkActionsMenu';
import { BulkAddToMenuDialog } from './BulkAddToMenuDialog';
import { BulkDeleteConfirmationModal } from './BulkDeleteConfirmationModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import RecipeCard from './RecipeCard';
import { UnifiedRecipeModal } from './UnifiedRecipeModal';
import RecipeTable from './RecipeTable';
import { RecipesActionButtons } from './RecipesActionButtons';
import { RecipeFilterBar } from './RecipeFilterBar';
import { RecipeEditDrawer } from './RecipeEditDrawer';
import { RecipesContent } from './RecipesContent';
import { RecipesModals } from './RecipesModals';
import { useIngredientsChangeEffect } from './hooks/useIngredientsChangeEffect';
import { usePriceCalculationEffect } from './hooks/usePriceCalculationEffect';
import { useRecipeHandlers } from './hooks/useRecipeHandlers';
import { useUnifiedBulkActions } from '../hooks/useUnifiedBulkActions';
import { useBulkShare } from '../hooks/useBulkShare';
import { useBulkAddToMenu } from '../hooks/useBulkAddToMenu';

export default function RecipesClient() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientWithDetails[]>([]);
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [previewYield, setPreviewYield] = useState<number>(1);
  const [changedRecipeIds, setChangedRecipeIds] = useState<Set<string>>(new Set());
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showRecipeEditDrawer, setShowRecipeEditDrawer] = useState(false);
  const handleIngredientsChangeRef = useRef<((recipeId: string) => void) | null>(null);

  const trackRecipeChange = useCallback((recipeId: string) => {
    setChangedRecipeIds(prev => new Set(prev).add(recipeId));
    if (handleIngredientsChangeRef.current) {
      handleIngredientsChangeRef.current(recipeId);
    }
  }, []);

  const {
    recipes,
    loading,
    error,
    recipeError,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    handleEditRecipe,
    updateVisibleRecipePrices,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
    setError,
  } = useRecipeManagement(trackRecipeChange);

  const clearChangedFlag = useCallback((recipeId: string) => {
    setChangedRecipeIds(prev => {
      const next = new Set(prev);
      next.delete(recipeId);
      return next;
    });
  }, []);

  useIngredientsChangeEffect({
    showUnifiedModal,
    selectedRecipe,
    changedRecipeIds,
    fetchRecipeIngredients,
    setRecipeIngredients,
    clearChangedFlag,
    handleIngredientsChangeRef,
  });

  // Listen for autosave completion events to refresh recipes when yield/portions are updated
  useRecipeAutosaveListener({
    onRecipeSaved: () => {
      fetchRecipes().catch(err => logger.error('Failed to refresh recipes after autosave:', err));
    },
  });

  useRecipeRefreshEffects({ loading, changedRecipeIds, fetchRecipes });
  const { aiInstructions, generatingInstructions, generateAIInstructions } = useAIInstructions();
  const {
    recipeToDelete,
    showDeleteConfirm,
    setShowDeleteConfirm,
    selectedRecipes,
    setSelectedRecipes,
    showShareModal,
    setShowShareModal,
    shareUrl,
    shareLoading,
    handleAddRecipe: handleAddRecipeAction,
    handleEditFromPreview,
    handleDuplicateRecipe,
    handleDeleteRecipe,
    confirmDeleteRecipe,
    cancelDeleteRecipe,
    handleSelectRecipe,
    handleSelectAll,
    handleShareRecipe,
  } = useRecipeActions({
    recipes,
    fetchRecipes,
    fetchRecipeIngredients,
    setError,
    capitalizeRecipeName,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  });
  const selectedItemTypes = new Map<string, 'recipe' | 'dish'>();
  selectedRecipes.forEach(id => selectedItemTypes.set(id, 'recipe'));
  const {
    bulkActionLoading,
    showBulkDeleteConfirm: showUnifiedBulkDeleteConfirm,
    setShowBulkDeleteConfirm: setShowUnifiedBulkDeleteConfirm,
    handleBulkDelete: handleUnifiedBulkDelete,
    confirmBulkDelete: confirmUnifiedBulkDelete,
    cancelBulkDelete: cancelUnifiedBulkDelete,
    selectedRecipeIds,
  } = useUnifiedBulkActions({
    recipes,
    dishes: [],
    selectedItems: selectedRecipes,
    selectedItemTypes,
    optimisticallyUpdateRecipes,
    optimisticallyUpdateDishes: () => {},
    rollbackRecipes,
    rollbackDishes: () => {},
    onClearSelection: () => setSelectedRecipes(new Set()),
  });
  const { handleBulkShare, shareLoading: bulkShareLoading } = useBulkShare({
    selectedRecipeIds,
    onSuccess: () => setSelectedRecipes(new Set()),
  });
  const {
    handleBulkAddToMenu,
    handleSelectMenu,
    handleCreateNewMenu,
    menus,
    loadingMenus,
    addLoading: addToMenuLoading,
    showMenuDialog,
    setShowMenuDialog,
  } = useBulkAddToMenu({
    selectedItems: selectedRecipes,
    selectedItemTypes,
    onSuccess: () => setSelectedRecipes(new Set()),
  });

  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const { filters, updateFilters, paginatedRecipes, filteredAndSortedRecipes, totalPages } =
    useRecipeFiltering(recipes, recipePrices);

  usePriceCalculationEffect({
    paginatedRecipes,
    recipePrices,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
  });

  const {
    formatQuantity,
    handlePreviewRecipe,
    handleEditRecipeWrapper,
    handleEditRecipeFromCard,
    handleDuplicateRecipeWrapper,
    handleShareRecipeWrapper,
    handlePrint,
    handleRefreshIngredients,
  } = useRecipeHandlers({
    selectedRecipe,
    previewYield,
    recipeIngredients,
    aiInstructions,
    fetchRecipeIngredients,
    setSelectedRecipe,
    setRecipeIngredients,
    setPreviewYield,
    setShowUnifiedModal,
    setEditingRecipe,
    setShowRecipeEditDrawer,
    setError,
    clearChangedFlag,
    generateAIInstructions,
    handleDuplicateRecipe,
    handleShareRecipe,
  });
  if (loading && recipes.length === 0) return <PageSkeleton />;

  return (
    <>
      <RecipesActionButtons
        onRefresh={fetchRecipes}
        loading={loading}
        recipes={recipes}
        fetchBatchRecipeIngredients={fetchBatchRecipeIngredients}
      />
      <div className="mb-4 flex items-center justify-between">
        <UnifiedBulkActionsMenu
          selectedCount={selectedRecipes.size}
          selectedRecipeCount={selectedRecipes.size}
          bulkActionLoading={bulkActionLoading || bulkShareLoading || addToMenuLoading}
          onBulkDelete={handleUnifiedBulkDelete}
          onBulkShare={() => handleBulkShare('pdf')}
          onBulkAddToMenu={handleBulkAddToMenu}
          showBulkMenu={showBulkMenu}
          onToggleBulkMenu={() => setShowBulkMenu(!showBulkMenu)}
        />
      </div>
      <BulkAddToMenuDialog
        show={showMenuDialog}
        menus={menus}
        loadingMenus={loadingMenus}
        onClose={() => setShowMenuDialog(false)}
        onSelectMenu={handleSelectMenu}
        onCreateNew={handleCreateNewMenu}
      />

      <RecipesErrorDisplay
        error={error}
        recipeError={recipeError}
        onRetry={recipeError?.retryAction}
        onDismiss={() => setError(null)}
      />
      <RecipesContent
        recipes={recipes}
        filteredAndSortedRecipes={filteredAndSortedRecipes}
        paginatedRecipes={paginatedRecipes}
        recipePrices={recipePrices}
        selectedRecipes={selectedRecipes}
        filters={filters}
        totalPages={totalPages}
        updateFilters={updateFilters}
        handleSelectRecipe={handleSelectRecipe}
        handleSelectAll={handleSelectAll}
        handlePreviewRecipe={handlePreviewRecipe}
        handleEditRecipeFromCard={handleEditRecipeFromCard}
        handleDeleteRecipe={handleDeleteRecipe}
        capitalizeRecipeName={capitalizeRecipeName}
      />
      {recipes.length === 0 && <RecipesEmptyState />}
      <RecipesModals
        showUnifiedModal={showUnifiedModal}
        selectedRecipe={selectedRecipe}
        recipeIngredients={recipeIngredients}
        aiInstructions={aiInstructions}
        generatingInstructions={generatingInstructions}
        previewYieldValue={previewYield}
        shareLoading={shareLoading}
        showDeleteConfirm={showDeleteConfirm}
        recipeToDelete={recipeToDelete}
        showBulkDeleteConfirm={showUnifiedBulkDeleteConfirm}
        selectedRecipes={selectedRecipes}
        recipes={recipes}
        showRecipeEditDrawer={showRecipeEditDrawer}
        editingRecipe={editingRecipe}
        capitalizeRecipeName={capitalizeRecipeName}
        formatQuantity={formatQuantity}
        onCloseModal={() => {
          setShowUnifiedModal(false);
          setSelectedRecipe(null);
        }}
        onSetSelectedRecipe={setSelectedRecipe}
        onSetShowUnifiedModal={setShowUnifiedModal}
        onSetPreviewYield={setPreviewYield}
        onSetShowRecipeEditDrawer={setShowRecipeEditDrawer}
        onSetEditingRecipe={setEditingRecipe}
        onEditRecipe={handleEditRecipeWrapper}
        onShareRecipe={handleShareRecipeWrapper}
        onPrint={handlePrint}
        onDuplicateRecipe={handleDuplicateRecipeWrapper}
        onDeleteRecipe={handleDeleteRecipe}
        onConfirmDelete={confirmDeleteRecipe}
        onCancelDelete={cancelDeleteRecipe}
        onConfirmBulkDelete={confirmUnifiedBulkDelete}
        onCancelBulkDelete={cancelUnifiedBulkDelete}
        onRefreshIngredients={handleRefreshIngredients}
        onRefreshRecipes={fetchRecipes}
      />
    </>
  );
}
