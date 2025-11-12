'use client';

import { useEffect } from 'react';

interface UseRecipeAutosaveListenerProps {
  onRecipeSaved: () => void;
}

/**
 * Hook to listen for autosave completion events and refresh recipes
 * when recipe metadata (yield/portions) is updated
 */
export function useRecipeAutosaveListener({ onRecipeSaved }: UseRecipeAutosaveListenerProps) {
  useEffect(() => {
    const handleAutosaveStatus = (event: CustomEvent) => {
      const { status, entityType, entityId } = event.detail;
      // Refresh recipes when recipe metadata (yield) is saved
      if (status === 'saved' && entityType === 'recipes' && entityId) {
        console.log('[useRecipeAutosaveListener] Recipe metadata saved, refreshing recipes list');
        onRecipeSaved();
      }
    };

    window.addEventListener('autosave:status', handleAutosaveStatus as EventListener);
    return () => {
      window.removeEventListener('autosave:status', handleAutosaveStatus as EventListener);
    };
  }, [onRecipeSaved]);
}
