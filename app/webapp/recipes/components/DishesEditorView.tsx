import { RecipeDishEditor } from './RecipeDishEditor';
import DishBuilderClient from '../../dish-builder/components/DishBuilderClient';
import { Recipe, Dish } from '../types';

type ViewMode = 'list' | 'editor' | 'builder';

interface DishesEditorViewProps {
  viewMode: ViewMode;
  editingItem: { item: Recipe | Dish; type: 'recipe' | 'dish' } | null;
  editingRecipe: Recipe | null;
  onViewModeChange: (mode: ViewMode) => void;
  onEditingItemChange: (item: { item: Recipe | Dish; type: 'recipe' | 'dish' } | null) => void;
  onEditingRecipeChange: (recipe: Recipe | null) => void;
  onSave: () => void;
}

export function DishesEditorView({
  viewMode,
  editingItem,
  editingRecipe,
  onViewModeChange,
  onEditingItemChange,
  onEditingRecipeChange,
  onSave,
}: DishesEditorViewProps) {
  if (viewMode === 'editor') {
    return (
      <RecipeDishEditor
        item={editingItem?.item || null}
        itemType={editingItem?.type}
        onClose={() => {
          onViewModeChange('list');
          onEditingItemChange(null);
        }}
        onSave={onSave}
      />
    );
  }

  if (viewMode === 'builder') {
    return (
      <DishBuilderClient
        editingRecipe={editingRecipe}
        onSaveSuccess={() => {
          onViewModeChange('list');
          onEditingRecipeChange(null);
          onSave();
        }}
      />
    );
  }

  return null;
}
