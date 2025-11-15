'use client';

import { useCallback } from 'react';

interface UseSelectionModeHandlersProps {
  ingredientId: string;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  recordTouchStart: (touch: Touch) => void;
  checkMovement: (touch: Touch) => boolean;
  getTouchDuration: () => number | null;
  resetTracking: () => void;
  hasMoved: () => boolean;
}

export function useSelectionModeHandlers({
  ingredientId,
  selectedIngredients,
  onSelectIngredient,
  recordTouchStart,
  checkMovement,
  getTouchDuration,
  resetTracking,
  hasMoved,
}: UseSelectionModeHandlersProps) {
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        return;
      }
      const touch = e.touches[0];
      if (touch) {
        recordTouchStart(touch as Touch);
      }
    },
    [recordTouchStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        checkMovement(touch as Touch);
      }
    },
    [checkMovement],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        resetTracking();
        return;
      }

      const touchDuration = getTouchDuration();
      if (touchDuration !== null && touchDuration < 300 && !hasMoved()) {
        e.preventDefault();
        e.stopPropagation();
        const currentlySelected = selectedIngredients.has(ingredientId);
        onSelectIngredient(ingredientId, !currentlySelected);
      }
      resetTracking();
    },
    [ingredientId, selectedIngredients, onSelectIngredient, getTouchDuration, resetTracking, hasMoved],
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const currentlySelected = selectedIngredients.has(ingredientId);
      onSelectIngredient(ingredientId, !currentlySelected);
    },
    [ingredientId, selectedIngredients, onSelectIngredient],
  );

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleCardClick,
  };
}
