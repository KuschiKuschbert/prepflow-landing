import { useCallback, useMemo } from 'react';
import { Recipe } from '../../types';
import { handlePreviewRecipe as handlePreviewRecipeUtil } from './utils/handlePreviewRecipe';
import { handleDuplicateRecipeWrapper as handleDuplicateRecipeWrapperUtil } from './utils/handleDuplicateRecipe';
import { buildRecipeHandlers } from './utils/buildRecipeHandlers';
import { buildFormatQuantity } from './utils/buildFormatQuantity';
import { buildRefreshIngredients } from './utils/buildRefreshIngredients';
import { buildRecipeHandlersReturn } from './utils/buildRecipeHandlersReturn';
import type { UseRecipeHandlersParams } from './utils/types';

/**
 * Hook to manage recipe handlers for preview, edit, duplicate, share, and print.
 */
export function useRecipeHandlers({
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
}: UseRecipeHandlersParams) {
  const formatQuantity = useMemo(
    () => buildFormatQuantity(previewYield, selectedRecipe),
    [previewYield, selectedRecipe],
  );
  const handlePreviewRecipe = useCallback(
    async (recipe: Recipe) => {
      await handlePreviewRecipeUtil({
        recipe,
        fetchRecipeIngredients,
        setSelectedRecipe,
        setRecipeIngredients,
        setPreviewYield,
        setShowUnifiedModal,
        clearChangedFlag,
        generateAIInstructions,
        setError,
      });
    },
    [
      fetchRecipeIngredients,
      setError,
      generateAIInstructions,
      clearChangedFlag,
      setSelectedRecipe,
      setRecipeIngredients,
      setPreviewYield,
      setShowUnifiedModal,
    ],
  );
  const {
    handleEditRecipeWrapper,
    handleEditRecipeFromCard,
    handleShareRecipeWrapper,
    handlePrint,
  } = useMemo(
    () =>
      buildRecipeHandlers({
        selectedRecipe,
        recipeIngredients,
        aiInstructions,
        setEditingRecipe,
        setShowRecipeEditDrawer,
        setShowUnifiedModal,
        handleShareRecipe,
      }),
    [
      selectedRecipe,
      recipeIngredients,
      aiInstructions,
      setEditingRecipe,
      setShowRecipeEditDrawer,
      setShowUnifiedModal,
      handleShareRecipe,
    ],
  );
  const handleDuplicateRecipeWrapper = useCallback(async () => {
    await handleDuplicateRecipeWrapperUtil({
      selectedRecipe,
      handleDuplicateRecipe,
      handlePreviewRecipe,
      setShowUnifiedModal,
    });
  }, [selectedRecipe, handleDuplicateRecipe, handlePreviewRecipe, setShowUnifiedModal]);
  const handleRefreshIngredients = useMemo(
    () => buildRefreshIngredients({ selectedRecipe, fetchRecipeIngredients, setRecipeIngredients }),
    [selectedRecipe, fetchRecipeIngredients, setRecipeIngredients],
  );
  return buildRecipeHandlersReturn({
    formatQuantity,
    handlePreviewRecipe,
    handleEditRecipeWrapper,
    handleEditRecipeFromCard,
    handleDuplicateRecipeWrapper,
    handleShareRecipeWrapper,
    handlePrint,
    handleRefreshIngredients,
  });
}
