'use client';

import { Recipe, RecipeIngredientWithDetails } from '../types';
import { BulkDeleteConfirmationModal } from './BulkDeleteConfirmationModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { RecipeEditDrawer } from './RecipeEditDrawer';
import { UnifiedRecipeModal } from './UnifiedRecipeModal';

interface RecipesModalsProps {
  showUnifiedModal: boolean;
  selectedRecipe: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
  aiInstructions: string;
  generatingInstructions: boolean;
  previewYieldValue: number;
  shareLoading: boolean;
  showDeleteConfirm: boolean;
  recipeToDelete: Recipe | null;
  showBulkDeleteConfirm: boolean;
  selectedRecipes: Set<string>;
  recipes: Recipe[];
  showRecipeEditDrawer: boolean;
  editingRecipe: Recipe | null;
  capitalizeRecipeName: (name: string) => string;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
  onCloseModal: () => void;
  onSetSelectedRecipe: (recipe: Recipe | null) => void;
  onSetShowUnifiedModal: (show: boolean) => void;
  onSetPreviewYield: (yieldValue: number) => void;
  onSetShowRecipeEditDrawer: (show: boolean) => void;
  onSetEditingRecipe: (recipe: Recipe | null) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onShareRecipe: () => void;
  onPrint: () => void;
  onDuplicateRecipe: () => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onConfirmBulkDelete: () => void;
  onCancelBulkDelete: () => void;
  onRefreshIngredients: () => Promise<void>;
  onRefreshRecipes: () => Promise<void>;
}

export function RecipesModals({
  showUnifiedModal,
  selectedRecipe,
  recipeIngredients,
  aiInstructions,
  generatingInstructions,
  previewYieldValue,
  shareLoading,
  showDeleteConfirm,
  recipeToDelete,
  showBulkDeleteConfirm,
  selectedRecipes,
  recipes,
  showRecipeEditDrawer,
  editingRecipe,
  capitalizeRecipeName,
  formatQuantity,
  onCloseModal,
  onSetSelectedRecipe,
  onSetShowUnifiedModal,
  onSetPreviewYield,
  onSetShowRecipeEditDrawer,
  onSetEditingRecipe,
  onEditRecipe,
  onShareRecipe,
  onPrint,
  onDuplicateRecipe,
  onDeleteRecipe,
  onConfirmDelete,
  onCancelDelete,
  onConfirmBulkDelete,
  onCancelBulkDelete,
  onRefreshIngredients,
  onRefreshRecipes,
}: RecipesModalsProps) {
  return (
    <>
      <UnifiedRecipeModal
        isOpen={showUnifiedModal}
        recipe={selectedRecipe}
        recipeIngredients={recipeIngredients}
        aiInstructions={aiInstructions}
        generatingInstructions={generatingInstructions}
        previewYield={previewYieldValue}
        shareLoading={shareLoading}
        onClose={onCloseModal}
        onEditRecipe={onEditRecipe}
        onShareRecipe={onShareRecipe}
        onPrint={onPrint}
        onDuplicateRecipe={onDuplicateRecipe}
        onDeleteRecipe={() => {
          if (selectedRecipe) {
            onDeleteRecipe(selectedRecipe);
            onSetShowUnifiedModal(false);
          }
        }}
        onUpdatePreviewYield={onSetPreviewYield}
        onRefreshIngredients={async () => {
          await onRefreshIngredients();
        }}
        capitalizeRecipeName={capitalizeRecipeName}
        formatQuantity={formatQuantity}
      />

      <DeleteConfirmationModal
        show={showDeleteConfirm}
        recipe={recipeToDelete}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <BulkDeleteConfirmationModal
        show={showBulkDeleteConfirm}
        selectedRecipeIds={selectedRecipes}
        recipes={recipes}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={onConfirmBulkDelete}
        onCancel={onCancelBulkDelete}
      />

      <RecipeEditDrawer
        isOpen={showRecipeEditDrawer}
        recipe={editingRecipe}
        onClose={() => {
          onSetShowRecipeEditDrawer(false);
          onSetEditingRecipe(null);
        }}
        onRefresh={onRefreshRecipes}
      />
    </>
  );
}
