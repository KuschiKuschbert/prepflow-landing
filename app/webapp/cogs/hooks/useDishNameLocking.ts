import { useEffect } from 'react';

interface UseDishNameLockingProps {
  recipeExists: boolean | null;
  dishName: string;
  dishNameLocked: boolean;
  setDishNameLocked: (locked: boolean) => void;
}

export function useDishNameLocking({
  recipeExists,
  dishName,
  dishNameLocked,
  setDishNameLocked,
}: UseDishNameLockingProps) {
  // Auto-lock dish name when recipe exists
  useEffect(() => {
    if (recipeExists === true && dishName.trim() && !dishNameLocked) {
      setDishNameLocked(true);
    }
  }, [recipeExists, dishName, dishNameLocked, setDishNameLocked]);
}
