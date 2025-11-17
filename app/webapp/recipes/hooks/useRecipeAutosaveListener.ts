'use client';

import { useEffect } from 'react';

import { logger } from '../../lib/logger';
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
      // entityId can be either the recipe ID directly or a derived ID
      // We check for 'recipes' entityType and any non-null entityId
      if (status === 'saved' && entityType === 'recipes' && entityId && entityId !== 'new') {
        logger.dev('[useRecipeAutosaveListener] Recipe metadata saved, refreshing recipes list', {
          entityId,
          entityType,
        });
        // Debounce to avoid multiple rapid refreshes
        setTimeout(() => {
          onRecipeSaved();
        }, 100);
      }
    };

    window.addEventListener('autosave:status', handleAutosaveStatus as EventListener);
    return () => {
      window.removeEventListener('autosave:status', handleAutosaveStatus as EventListener);
    };
  }, [onRecipeSaved]);
}
