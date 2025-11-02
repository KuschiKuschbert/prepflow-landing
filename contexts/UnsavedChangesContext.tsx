'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  registerUnsavedChanges: (source: string) => () => void;
  clearUnsavedChanges: () => void;
  unsavedSources: string[];
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [unsavedSources, setUnsavedSources] = useState<Set<string>>(new Set());

  const setHasUnsavedChanges = useCallback((hasChanges: boolean) => {
    if (!hasChanges) {
      setUnsavedSources(new Set());
    }
  }, []);

  const registerUnsavedChanges = useCallback((source: string) => {
    // Add source to unsaved changes
    setUnsavedSources(prev => new Set(prev).add(source));

    // Return cleanup function to unregister
    return () => {
      setUnsavedSources(prev => {
        const next = new Set(prev);
        next.delete(source);
        return next;
      });
    };
  }, []);

  const clearUnsavedChanges = useCallback(() => {
    setUnsavedSources(new Set());
  }, []);

  const hasUnsavedChanges = unsavedSources.size > 0;

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        registerUnsavedChanges,
        clearUnsavedChanges,
        unsavedSources: Array.from(unsavedSources),
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
  }
  return context;
}
