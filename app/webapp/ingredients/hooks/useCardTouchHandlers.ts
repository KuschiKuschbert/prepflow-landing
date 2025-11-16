'use client';

import { useCallback } from 'react';
import { useLongPressDetection } from './useLongPressDetection';
import { useRegularModeHandlers } from './useRegularModeHandlers';
import { useSelectionModeHandlers } from './useSelectionModeHandlers';
import { useTouchPositionTracking } from './useTouchPositionTracking';

interface UseCardTouchHandlersProps {
  ingredientId: string;
  isSelectionMode: boolean;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onEdit?: () => void;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function useCardTouchHandlers({
  ingredientId,
  isSelectionMode,
  selectedIngredients,
  onSelectIngredient,
  onEdit,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: UseCardTouchHandlersProps) {
  const { startLongPressTimer, cancelLongPressTimer } = useLongPressDetection({
    isSelectionMode,
    onStartLongPress,
    onCancelLongPress,
    onEnterSelectionMode,
  });

  const { recordTouchStart, checkMovement, getTouchDuration, resetTracking, hasMoved } =
    useTouchPositionTracking();

  const selectionHandlers = useSelectionModeHandlers({
    ingredientId,
    selectedIngredients,
    onSelectIngredient,
    recordTouchStart,
    checkMovement,
    getTouchDuration,
    resetTracking,
    hasMoved,
  });

  const regularHandlers = useRegularModeHandlers({
    ingredientId,
    selectedIngredients,
    onSelectIngredient,
    onEnterSelectionMode,
    recordTouchStart,
    checkMovement,
    resetTracking,
    startLongPressTimer,
    cancelLongPressTimer,
  });

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't trigger if clicking on buttons or interactive elements
      if (target.closest('button') || target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      // Open edit drawer when clicking card in regular mode
      onEdit?.();
    },
    [onEdit],
  );

  if (isSelectionMode) {
    return {
      handleTouchStart: selectionHandlers.handleTouchStart,
      handleTouchMove: selectionHandlers.handleTouchMove,
      handleTouchEnd: selectionHandlers.handleTouchEnd,
      handleCardClick: selectionHandlers.handleCardClick,
    };
  }

  return {
    handleTouchStart: regularHandlers.handleTouchStart,
    handleTouchMove: regularHandlers.handleTouchMove,
    handleTouchEnd: regularHandlers.handleTouchEnd,
    handleCardClick,
  };
}
