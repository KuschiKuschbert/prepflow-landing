'use client';

import { useCallback } from 'react';

interface UseRegularModeHandlersProps {
  ingredientId: string;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onEnterSelectionMode?: () => void;
  recordTouchStart: (touch: Touch) => void;
  checkMovement: (touch: Touch) => boolean;
  resetTracking: () => void;
  startLongPressTimer: (onLongPress: () => void) => void;
  cancelLongPressTimer: () => void;
}

export function useRegularModeHandlers({
  ingredientId,
  selectedIngredients,
  onSelectIngredient,
  onEnterSelectionMode,
  recordTouchStart,
  checkMovement,
  resetTracking,
  startLongPressTimer,
  cancelLongPressTimer,
}: UseRegularModeHandlersProps) {
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        recordTouchStart(touch as Touch);
      }
      startLongPressTimer(() => {
        onEnterSelectionMode?.();
        const currentlySelected = selectedIngredients.has(ingredientId);
        if (!currentlySelected) {
          onSelectIngredient(ingredientId, true);
        }
      });
    },
    [
      ingredientId,
      selectedIngredients,
      onSelectIngredient,
      onEnterSelectionMode,
      recordTouchStart,
      startLongPressTimer,
    ],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch && checkMovement(touch as Touch)) {
        cancelLongPressTimer();
      }
    },
    [checkMovement, cancelLongPressTimer],
  );

  const handleTouchEnd = useCallback(() => {
    cancelLongPressTimer();
    resetTracking();
  }, [cancelLongPressTimer, resetTracking]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
