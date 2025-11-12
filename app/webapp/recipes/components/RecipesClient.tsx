'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

// UI components
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Local hooks and types
import { useAIInstructions } from '../hooks/useAIInstructions';
import { useRecipeManagement } from '../hooks/useRecipeManagement';
import { useRecipeActions } from '../hooks/useRecipeActions';
import { Recipe, RecipeIngredientWithDetails } from '../types';

// Local components
import BulkActionsBar from './BulkActionsBar';
import { BulkDeleteConfirmationModal } from './BulkDeleteConfirmationModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import RecipeCard from './RecipeCard';
import RecipePreviewModal from './RecipePreviewModal';
import RecipeTable from './RecipeTable';
import { RecipesActionButtons } from './RecipesActionButtons';
import { SuccessMessage } from './SuccessMessage';

// Utils
import { formatQuantity as formatQuantityUtil } from '../utils/formatQuantity';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';

export default function RecipesClient() {
  const router = useRouter();
  const {
    recipes,
    loading,
    error,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    handleEditRecipe,
    setError,
  } = useRecipeManagement();

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
  });

  // Preview state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientWithDetails[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewYield, setPreviewYield] = useState<number>(1);

  // Helper function - format quantity with yield adjustment
  const formatQuantity = (quantity: number, unit: string) => {
    return formatQuantityUtil(quantity, unit, previewYield, selectedRecipe?.yield || 1);
  };

  // Event handlers
  const handlePreviewRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        const ingredients = await fetchRecipeIngredients(recipe.id);
        setSelectedRecipe(recipe);
        setRecipeIngredients(ingredients);
        setPreviewYield(recipe.yield);
        setShowPreview(true);
        await generateAIInstructions(recipe, ingredients);
      } catch (err) {
        console.error('❌ Error in handlePreviewRecipe:', err);
        setError('Failed to load recipe preview');
      }
    },
    [fetchRecipeIngredients, setError, generateAIInstructions],
  );

  const handleEditFromPreviewWrapper = () => {
    if (!selectedRecipe || !recipeIngredients.length) return;
    handleEditFromPreview(selectedRecipe, recipeIngredients);
    setShowPreview(false);
  };

  const handleShareRecipeWrapper = () => {
    if (!selectedRecipe || !recipeIngredients.length) return;
    handleShareRecipe(selectedRecipe, recipeIngredients, aiInstructions);
  };

  const handlePrint = () => {
    window.print();
  };

  // Gate the arcade overlay while recipes are loading
  useEffect(() => {
    if (loading) {
      startLoadingGate('recipes');
    } else {
      stopLoadingGate('recipes');
    }
    return () => {
      stopLoadingGate('recipes');
    };
  }, [loading]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      {/* Action Buttons */}
      <RecipesActionButtons onRefresh={fetchRecipes} />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedRecipes.size}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedRecipes(new Set())}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      <SuccessMessage message={successMessage} />

      {/* Recipes List */}
      <div className="overflow-hidden rounded-lg bg-[#1f1f1f] shadow">
        <div className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#1f1f1f] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recipes ({recipes.length})</h2>
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

        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          <div className="divide-y divide-[#2a2a2a]">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                recipePrices={recipePrices}
                selectedRecipes={selectedRecipes}
                onSelectRecipe={handleSelectRecipe}
                onPreviewRecipe={handlePreviewRecipe}
                onEditRecipe={handleEditRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                capitalizeRecipeName={capitalizeRecipeName}
              />
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <RecipeTable
          recipes={recipes}
          recipePrices={recipePrices}
          selectedRecipes={selectedRecipes}
          onSelectAll={handleSelectAll}
          onSelectRecipe={handleSelectRecipe}
          onPreviewRecipe={handlePreviewRecipe}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          capitalizeRecipeName={capitalizeRecipeName}
        />
      </div>

      {/* Empty State */}
      {recipes.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 flex justify-center">
            <Icon icon={ChefHat} size="xl" className="text-gray-400" aria-hidden={true} />
          </div>
          <h3 className="mb-2 text-lg font-medium text-white">No recipes yet</h3>
          <p className="mb-4 text-gray-500">
            Start by adding your first recipe to begin managing your kitchen costs.
          </p>
          <a
            href="/webapp/cogs"
            className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-white transition-colors hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
          >
            Add Your First Recipe
          </a>
        </div>
      )}

      {/* Recipe Preview Modal */}
      <RecipePreviewModal
        showPreview={showPreview}
        selectedRecipe={selectedRecipe}
        recipeIngredients={recipeIngredients}
        aiInstructions={aiInstructions}
        generatingInstructions={generatingInstructions}
        previewYield={previewYield}
        shareLoading={shareLoading}
        onClose={() => setShowPreview(false)}
        onEditFromPreview={handleEditFromPreviewWrapper}
        onShareRecipe={handleShareRecipeWrapper}
        onPrint={handlePrint}
        onUpdatePreviewYield={setPreviewYield}
        capitalizeRecipeName={capitalizeRecipeName}
        formatQuantity={formatQuantity}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteConfirm}
        recipe={recipeToDelete}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={confirmDeleteRecipe}
        onCancel={cancelDeleteRecipe}
      />

      {/* Bulk Delete Confirmation Modal */}
      <BulkDeleteConfirmationModal
        show={showBulkDeleteConfirm}
        selectedRecipeIds={selectedRecipes}
        recipes={recipes}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
      />
    </>
  );
}
