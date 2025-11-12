'use client';

import { useRef, useCallback } from 'react';

interface UsePortionHandlingProps {
  setDishPortions: (portions: number) => void;
}

export function usePortionHandling({ setDishPortions }: UsePortionHandlingProps) {
  const hasManualPortionsRef = useRef(false);
  const lastPortionChangeTimeRef = useRef<number>(0);

  // Handler for manual portion changes (from user input)
  const handleDishPortionsChange = useCallback(
    (portions: number) => {
      hasManualPortionsRef.current = true;
      lastPortionChangeTimeRef.current = Date.now();
      setDishPortions(portions);
    },
    [setDishPortions],
  );

  // Handler for setting portions from recipe selection (not manual)
  const handleDishPortionsFromRecipe = useCallback(
    (portions: number) => {
      hasManualPortionsRef.current = false;
      lastPortionChangeTimeRef.current = 0;
      setDishPortions(portions);
    },
    [setDishPortions],
  );

  return {
    hasManualPortionsRef,
    lastPortionChangeTimeRef,
    handleDishPortionsChange,
    handleDishPortionsFromRecipe,
  };
}
