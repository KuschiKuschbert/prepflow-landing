/**
 * Hook for managing keyboard shortcuts on cleaning page
 */

import { useEffect } from 'react';

interface UseCleaningKeyboardShortcutsProps {
  activeTab: 'grid' | 'areas';
  onCreateTask: () => void;
  onAddArea: () => void;
  onSetActiveTab: (tab: 'grid' | 'areas') => void;
}

export function useCleaningKeyboardShortcuts({
  activeTab,
  onCreateTask,
  onAddArea,
  onSetActiveTab,
}: UseCleaningKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input/textarea
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        return;
      }

      // N for new task
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onCreateTask();
      }

      // A for add area (when on areas tab)
      if ((e.key === 'a' || e.key === 'A') && activeTab === 'areas') {
        e.preventDefault();
        onAddArea();
      }

      // G for grid tab, M for areas tab (Manage)
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        onSetActiveTab('grid');
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onSetActiveTab('areas');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, onCreateTask, onAddArea, onSetActiveTab]);
}



