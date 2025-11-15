'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// UI components
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Local hooks and types
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

// Local components
import BulkActionsBar from './BulkActionsBar';
import { BulkDeleteConfirmationModal } from './BulkDeleteConfirmationModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import RecipeCard from './RecipeCard';
import { UnifiedRecipeModal } from './UnifiedRecipeModal';
import RecipeTable from './RecipeTable';
import { RecipesActionButtons } from './RecipesActionButtons';
import { RecipeFilterBar } from './RecipeFilterBar';
import { SuccessMessage } from './SuccessMessage';
import { RecipeEditDrawer } from './RecipeEditDrawer';

// Utils
import { formatQuantity as formatQuantityUtil } from '../utils/formatQuantity';

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

  useEffect(() => {
    handleIngredientsChangeRef.current = (recipeId: string) => {
      if (showUnifiedModal && selectedRecipe && selectedRecipe.id === recipeId) {
        fetchRecipeIngredients(recipeId)
          .then(ingredients => {
            setRecipeIngredients(ingredients);
            clearChangedFlag(recipeId);
          })
          .catch(err => console.error('Failed to refresh preview ingredients:', err));
      }
    };
    if (showUnifiedModal && selectedRecipe && changedRecipeIds.has(selectedRecipe.id)) {
      fetchRecipeIngredients(selectedRecipe.id)
        .then(ingredients => {
          setRecipeIngredients(ingredients);
          clearChangedFlag(selectedRecipe.id);
        })
        .catch(err => console.error('Failed to refresh on open:', err));
    }
  }, [showUnifiedModal, selectedRecipe, changedRecipeIds, fetchRecipeIngredients, clearChangedFlag]);

  // Listen for autosave completion events to refresh recipes when yield/portions are updated
  useRecipeAutosaveListener({
    onRecipeSaved: () => {
      fetchRecipes().catch(err => console.error('Failed to refresh recipes after autosave:', err));
    },
  });

  useRecipeRefreshEffects({
    loading,
    changedRecipeIds,
    fetchRecipes,
  });

  const { aiInstructions, generatingInstructions, generateAIInstructions } = useAIInstructions();
  const {
    successMessage,
    setSuccessMessage,
    recipeToDelete,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
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
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
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

  const {
    filters,
    updateFilters,
    paginatedRecipes,
    filteredAndSortedRecipes,
    totalPages,
  } = useRecipeFiltering(recipes, recipePrices);

  // Track which recipes are currently being calculated to prevent duplicate requests
  const calculatingPricesRef = useRef<Set<string>>(new Set());

  // Create stable reference to paginated recipe IDs to prevent infinite loops
  const paginatedRecipeIds = useMemo(
    () => paginatedRecipes.map(r => r.id).sort().join(','),
    [paginatedRecipes]
  );

  // Calculate prices for visible recipes only (lazy loading)
  useEffect(() => {
    if (paginatedRecipes.length === 0) return;

    // Get recipe IDs that don't have prices yet and aren't currently being calculated
    const recipesNeedingPrices = paginatedRecipes.filter(
      recipe => !recipePrices[recipe.id] && !calculatingPricesRef.current.has(recipe.id)
    );

    if (recipesNeedingPrices.length > 0) {
      // Mark recipes as being calculated
      recipesNeedingPrices.forEach(recipe => {
        calculatingPricesRef.current.add(recipe.id);
      });

      console.log('[RecipesClient] Calculating prices for', recipesNeedingPrices.length, 'recipes');
      updateVisibleRecipePrices(
        recipesNeedingPrices,
        fetchRecipeIngredients,
        fetchBatchRecipeIngredients,
      )
        .then(() => {
          console.log('[RecipesClient] Price calculation completed');
          // Remove from calculating set after completion
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        })
        .catch(err => {
          console.error('[RecipesClient] Failed to calculate visible recipe prices:', err);
          // Remove from calculating set on error
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        });
    }
    // Only depend on paginatedRecipeIds - don't retrigger when recipePrices changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedRecipeIds]);

  const formatQuantity = useCallback(
    (q: number, u: string) => formatQuantityUtil(q, u, previewYield, selectedRecipe?.yield || 1),
    [previewYield, selectedRecipe?.yield],
  );
  const handlePreviewRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        console.log('[RecipesClient] Opening unified modal:', recipe.id);
        const ingredients = await fetchRecipeIngredients(recipe.id);
        console.log('[RecipesClient] Fetched:', ingredients.length);
        setSelectedRecipe(recipe);
        setRecipeIngredients(ingredients);
        setPreviewYield(recipe.yield || 1);
        setShowUnifiedModal(true);
        clearChangedFlag(recipe.id);
        await generateAIInstructions(recipe, ingredients);
      } catch (err) {
        console.error('❌ Error in handlePreviewRecipe:', err);
        setError('Failed to load recipe');
      }
    },
    [fetchRecipeIngredients, setError, generateAIInstructions, clearChangedFlag],
  );

  const handleEditRecipeWrapper = useCallback(
    (recipe: Recipe) => {
      setEditingRecipe(recipe);
      setShowRecipeEditDrawer(true);
      setShowUnifiedModal(false);
    },
    [],
  );

  const handleEditRecipeFromCard = useCallback(
    (recipe: Recipe) => {
      setEditingRecipe(recipe);
      setShowRecipeEditDrawer(true);
    },
    [],
  );

  const handleDuplicateRecipeWrapper = useCallback(async () => {
    if (!selectedRecipe) return;
    const duplicated = await handleDuplicateRecipe(selectedRecipe);
    if (duplicated) {
      setShowUnifiedModal(false);
      // Optionally open the new recipe
      setTimeout(() => {
        handlePreviewRecipe(duplicated);
      }, 500);
    }
  }, [selectedRecipe, handleDuplicateRecipe, handlePreviewRecipe]);

  const handleShareRecipeWrapper = useCallback(() => {
    if (!selectedRecipe || !recipeIngredients.length) return;
    handleShareRecipe(selectedRecipe, recipeIngredients, aiInstructions);
  }, [selectedRecipe, recipeIngredients, aiInstructions, handleShareRecipe]);

  const handlePrint = () => window.print();

  const handleRefreshIngredients = useCallback(async () => {
    if (!selectedRecipe) return;
    const ingredients = await fetchRecipeIngredients(selectedRecipe.id);
    setRecipeIngredients(ingredients);
  }, [selectedRecipe, fetchRecipeIngredients]);

  // Show recipes immediately if we have cached data, even if loading
  const showRecipes = recipes.length > 0 || !loading;

  if (loading && recipes.length === 0) return <PageSkeleton />;

  return (
    <>
      <RecipesActionButtons onRefresh={fetchRecipes} loading={loading} />
      <BulkActionsBar
        selectedCount={selectedRecipes.size}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedRecipes(new Set())}
      />

      <RecipesErrorDisplay
        error={error}
        recipeError={recipeError}
        onRetry={recipeError?.retryAction}
        onDismiss={() => setError(null)}
      />
      <SuccessMessage message={successMessage} />
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow">
        <RecipeFilterBar
          recipes={recipes}
          searchTerm={filters.searchTerm}
          categoryFilter={filters.categoryFilter}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          itemsPerPage={filters.itemsPerPage}
          onSearchChange={term => updateFilters({ searchTerm: term })}
          onCategoryFilterChange={category => updateFilters({ categoryFilter: category })}
          onSortChange={(field, direction) => updateFilters({ sortField: field, sortDirection: direction })}
          onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        />
        <div className="border-b border-[#2a2a2a] bg-[#1f1f1f] px-4 py-4 tablet:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white" suppressHydrationWarning>
              Recipes ({filteredAndSortedRecipes.length}
              {filteredAndSortedRecipes.length !== recipes.length && ` of ${recipes.length}`})
            </h2>
            {selectedRecipes.size > 0 && (
              <div className="flex items-center">
                <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
                  <span className="text-xs font-bold text-white">{selectedRecipes.size}</span>
                </div>
                <span className="text-sm text-gray-300">{selectedRecipes.size} selected</span>
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

        <div className="block large-desktop:hidden">
          <div className="divide-y divide-[#2a2a2a]">
            {paginatedRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                recipePrices={recipePrices}
                selectedRecipes={selectedRecipes}
                onSelectRecipe={handleSelectRecipe}
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
          onSelectRecipe={handleSelectRecipe}
          onPreviewRecipe={handlePreviewRecipe}
          onEditRecipe={handleEditRecipeFromCard}
          onDeleteRecipe={handleDeleteRecipe}
          capitalizeRecipeName={capitalizeRecipeName}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          onSortChange={(field, direction) => updateFilters({ sortField: field, sortDirection: direction })}
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

      {recipes.length === 0 && <RecipesEmptyState />}

      <UnifiedRecipeModal
        isOpen={showUnifiedModal}
        recipe={selectedRecipe}
        recipeIngredients={recipeIngredients}
        aiInstructions={aiInstructions}
        generatingInstructions={generatingInstructions}
        previewYield={previewYield}
        shareLoading={shareLoading}
        onClose={() => {
          setShowUnifiedModal(false);
          setSelectedRecipe(null);
        }}
        onEditRecipe={handleEditRecipeWrapper}
        onShareRecipe={handleShareRecipeWrapper}
        onPrint={handlePrint}
        onDuplicateRecipe={handleDuplicateRecipeWrapper}
        onDeleteRecipe={() => {
          if (selectedRecipe) {
            handleDeleteRecipe(selectedRecipe);
            setShowUnifiedModal(false);
          }
        }}
        onUpdatePreviewYield={setPreviewYield}
        onRefreshIngredients={handleRefreshIngredients}
        capitalizeRecipeName={capitalizeRecipeName}
        formatQuantity={formatQuantity}
      />

      <DeleteConfirmationModal
        show={showDeleteConfirm}
        recipe={recipeToDelete}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={confirmDeleteRecipe}
        onCancel={cancelDeleteRecipe}
      />

      <BulkDeleteConfirmationModal
        show={showBulkDeleteConfirm}
        selectedRecipeIds={selectedRecipes}
        recipes={recipes}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
      />

      <RecipeEditDrawer
        isOpen={showRecipeEditDrawer}
        recipe={editingRecipe}
        onClose={() => {
          setShowRecipeEditDrawer(false);
          setEditingRecipe(null);
        }}
        onRefresh={async () => {
          await fetchRecipes();
        }}
      />
    </>
  );
}
