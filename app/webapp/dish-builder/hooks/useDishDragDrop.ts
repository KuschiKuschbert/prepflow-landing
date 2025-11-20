'use client';

import { useCallback, useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DragItem, ExpandedRecipeIngredient } from '../types';
import { Ingredient, Recipe } from '../../cogs/types';

import { logger } from '@/lib/logger';
interface UseDishDragDropProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onRecipeExpanded: (recipeId: string) => Promise<void>;
  onIngredientAdded: (ingredient: Ingredient, quantity: number, unit: string) => void;
  setError: (error: string) => void;
}

export function useDishDragDrop({
  recipes,
  ingredients,
  onRecipeExpanded,
  onIngredientAdded,
  setError,
}: UseDishDragDropProps) {
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragItem | undefined;

    if (data) {
      setActiveDragItem(data);
    }
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragItem(null);

      if (!over) return;

      const dragData = active.data.current as DragItem | undefined;
      if (!dragData) return;

      // Check if dropped on a valid drop zone
      const dropZoneId = over.id as string;
      if (dropZoneId !== 'dish-drop-zone') {
        return;
      }

      try {
        if (dragData.type === 'recipe') {
          // Expand recipe to individual ingredients
          await onRecipeExpanded(dragData.id);
        } else if (dragData.type === 'ingredient') {
          // Add ingredient directly (default quantity: 1, use ingredient's unit)
          const ingredient = dragData.data as Ingredient;
          const defaultQuantity = 1;
          const defaultUnit = ingredient.unit || 'kg';
          onIngredientAdded(ingredient, defaultQuantity, defaultUnit);
        }
      } catch (err) {
        logger.error('Error handling drag end:', err);
        setError(err instanceof Error ? err.message : 'Failed to add item');
      }
    },
    [onRecipeExpanded, onIngredientAdded, setError],
  );

  return {
    activeDragItem,
    handleDragStart,
    handleDragEnd,
  };
}
