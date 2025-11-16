import { RecipeSidePanel } from './RecipeSidePanel';
import { DishSidePanel } from './DishSidePanel';
import { DishEditDrawer } from './DishEditDrawer';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Dish, Recipe, RecipeIngredientWithDetails } from '../types';
import { formatQuantity as formatQuantityUtil } from '../utils/formatQuantity';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface DishesSidePanelsProps {
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
  capitalizeRecipeName: (name: string) => string;
  onDishPanelClose: () => void;
  onDishEdit: (dish: Dish) => void;
  onDishDelete: (dish: Dish) => void;
  onRecipePanelClose: () => void;
  onRecipeEdit: (recipe: Recipe) => void;
  onRecipeDelete: (recipe: Recipe) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onDishEditDrawerClose: () => void;
  onDishEditDrawerSave: () => Promise<void>;
}

export function DishesSidePanels({
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
  capitalizeRecipeName,
  onDishPanelClose,
  onDishEdit,
  onDishDelete,
  onRecipePanelClose,
  onRecipeEdit,
  onRecipeDelete,
  onDeleteConfirm,
  onDeleteCancel,
  onDishEditDrawerClose,
  onDishEditDrawerSave,
}: DishesSidePanelsProps) {
  const formatQuantity = (q: number, u: string) =>
    formatQuantityUtil(q, u, previewYield, selectedRecipeForPreview?.yield || 1);

  return (
    <>
      {/* Dish Side Panel */}
      <DishSidePanel
        isOpen={showDishPanel}
        dish={selectedDishForPreview}
        onClose={onDishPanelClose}
        onEdit={onDishEdit}
        onDelete={onDishDelete}
      />

      {/* Recipe Side Panel */}
      <RecipeSidePanel
        isOpen={showRecipePanel}
        recipe={selectedRecipeForPreview}
        recipeIngredients={recipeIngredients}
        previewYield={previewYield}
        onClose={onRecipePanelClose}
        onEditRecipe={onRecipeEdit}
        onDeleteRecipe={onRecipeDelete}
        capitalizeRecipeName={capitalizeRecipeName}
        formatQuantity={formatQuantity}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <DeleteConfirmationModal
          itemName={itemToDelete.itemType === 'dish' ? itemToDelete.dish_name : itemToDelete.name}
          itemType={itemToDelete.itemType}
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
        />
      )}

      {/* Dish Edit Drawer */}
      <DishEditDrawer
        isOpen={showDishEditDrawer}
        dish={editingDish}
        onClose={onDishEditDrawerClose}
        onSave={onDishEditDrawerSave}
      />
    </>
  );
}
