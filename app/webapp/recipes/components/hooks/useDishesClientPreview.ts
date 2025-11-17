import { useCallback, useState } from 'react';
import { Dish, Recipe, RecipeIngredientWithDetails } from '../../types';

import { logger } from '../../lib/logger';
interface UseDishesClientPreviewProps {
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  generateAIInstructions: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useDishesClientPreview({
  fetchRecipeIngredients,
  generateAIInstructions,
  setError,
}: UseDishesClientPreviewProps) {
  const [selectedRecipeForPreview, setSelectedRecipeForPreview] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientWithDetails[]>([]);
  const [showRecipePanel, setShowRecipePanel] = useState(false);
  const [previewYield, setPreviewYield] = useState<number>(1);
  const [selectedDishForPreview, setSelectedDishForPreview] = useState<Dish | null>(null);
  const [showDishPanel, setShowDishPanel] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showDishEditDrawer, setShowDishEditDrawer] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editingItem, setEditingItem] = useState<{
    item: Recipe | Dish;
    type: 'recipe' | 'dish';
  } | null>(null);
  const [highlightingRowId, setHighlightingRowId] = useState<string | null>(null);
  const [highlightingRowType, setHighlightingRowType] = useState<'recipe' | 'dish' | null>(null);

  const handlePreviewDish = useCallback((dish: Dish) => {
    setSelectedDishForPreview(dish);
    setShowDishPanel(true);
  }, []);

  const handlePreviewRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        const ingredients = await fetchRecipeIngredients(recipe.id);
        setSelectedRecipeForPreview(recipe);
        setRecipeIngredients(ingredients);
        setPreviewYield(recipe.yield || 1);
        setShowRecipePanel(true);
        generateAIInstructions(recipe, ingredients).catch(err => {
          logger.error('Failed to generate AI instructions:', err);
        });
      } catch (err) {
        logger.error('Failed to load recipe:', err);
        setError('Failed to load recipe details');
      }
    },
    [fetchRecipeIngredients, generateAIInstructions, setError],
  );

  return {
    selectedRecipeForPreview,
    setSelectedRecipeForPreview,
    recipeIngredients,
    setRecipeIngredients,
    showRecipePanel,
    setShowRecipePanel,
    previewYield,
    setPreviewYield,
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
  };
}
