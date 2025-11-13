'use client';

import { useRef, useCallback } from 'react';

interface UseCardTouchHandlersProps {
  ingredientId: string;
  isSelectionMode: boolean;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function useCardTouchHandlers({
  ingredientId,
  isSelectionMode,
  selectedIngredients,
  onSelectIngredient,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: UseCardTouchHandlersProps) {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isSelectionMode) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        return;
      }
      hasMovedRef.current = false;
      const touch = e.touches[0];
      if (touch) {
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        touchStartTimeRef.current = Date.now();
      }
      return;
    }

    touchStartTimeRef.current = Date.now();
    hasMovedRef.current = false;
    const touch = e.touches[0];
    if (touch) {
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
    onStartLongPress?.();

    longPressTimerRef.current = setTimeout(() => {
      if (!hasMovedRef.current && touchStartTimeRef.current) {
        onEnterSelectionMode?.();
        const currentlySelected = selectedIngredients.has(ingredientId);
        if (!currentlySelected) {
          onSelectIngredient(ingredientId, true);
        }
      }
      longPressTimerRef.current = null;
    }, 500);
  }, [isSelectionMode, ingredientId, selectedIngredients, onSelectIngredient, onStartLongPress, onEnterSelectionMode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isSelectionMode) {
      const touch = e.touches[0];
      if (touchStartPosRef.current && touch) {
        const moveDistance = Math.abs(touch.clientX - touchStartPosRef.current.x) + Math.abs(touch.clientY - touchStartPosRef.current.y);
        if (moveDistance > 10) {
          hasMovedRef.current = true;
        }
      }
      return;
    }

    const touch = e.touches[0];
    if (touchStartPosRef.current && touch) {
      const moveDistance = Math.abs(touch.clientX - touchStartPosRef.current.x) + Math.abs(touch.clientY - touchStartPosRef.current.y);
      if (moveDistance > 10) {
        hasMovedRef.current = true;
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
          onCancelLongPress?.();
        }
      }
    }
  }, [isSelectionMode, onCancelLongPress]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isSelectionMode) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        touchStartTimeRef.current = null;
        touchStartPosRef.current = null;
        hasMovedRef.current = false;
        return;
      }

      if (!hasMovedRef.current && touchStartTimeRef.current) {
        const touchDuration = Date.now() - touchStartTimeRef.current;
        if (touchDuration < 300) {
          e.preventDefault();
          e.stopPropagation();
          const currentlySelected = selectedIngredients.has(ingredientId);
          onSelectIngredient(ingredientId, !currentlySelected);
        }
      }
      touchStartTimeRef.current = null;
      touchStartPosRef.current = null;
      hasMovedRef.current = false;
      return;
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      onCancelLongPress?.();
    }
    touchStartTimeRef.current = null;
    touchStartPosRef.current = null;
    hasMovedRef.current = false;
  }, [isSelectionMode, ingredientId, selectedIngredients, onSelectIngredient, onCancelLongPress]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (isSelectionMode) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const currentlySelected = selectedIngredients.has(ingredientId);
      onSelectIngredient(ingredientId, !currentlySelected);
    }
  }, [isSelectionMode, ingredientId, selectedIngredients, onSelectIngredient]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleCardClick,
  };
}



