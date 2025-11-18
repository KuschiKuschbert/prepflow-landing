/**
 * Hook for managing par level selection state.
 */

import { useState, useEffect, useCallback } from 'react';

interface UseParLevelsSelectionProps {
  parLevels: { id: string }[];
  isSelectionMode: boolean;
  exitSelectionMode: () => void;
}

/**
 * Hook for managing par level selection state.
 *
 * @param {UseParLevelsSelectionProps} props - Hook dependencies
 * @returns {Object} Selection state and handlers
 */
export function useParLevelsSelection({
  parLevels,
  isSelectionMode,
  exitSelectionMode,
}: UseParLevelsSelectionProps) {
  const [selectedParLevels, setSelectedParLevels] = useState<Set<string>>(new Set());

  const handleSelectParLevel = useCallback((id: string, selected: boolean) => {
    setSelectedParLevels(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        const allIds = new Set(parLevels.map(pl => pl.id));
        setSelectedParLevels(allIds);
      } else {
        setSelectedParLevels(new Set());
        exitSelectionMode();
      }
    },
    [parLevels, exitSelectionMode],
  );

  // Clear selection when exiting selection mode
  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedParLevels(new Set());
    }
  }, [isSelectionMode]);

  return {
    selectedParLevels,
    handleSelectParLevel,
    handleSelectAll,
  };
}
