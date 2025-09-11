'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GlobalWarning {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

interface GlobalWarningContextType {
  warnings: GlobalWarning[];
  addWarning: (warning: Omit<GlobalWarning, 'id'>) => void;
  removeWarning: (id: string) => void;
  clearWarnings: () => void;
  hasWarnings: boolean;
}

const GlobalWarningContext = createContext<GlobalWarningContextType | undefined>(undefined);

export const useGlobalWarning = () => {
  const context = useContext(GlobalWarningContext);
  if (!context) {
    throw new Error('useGlobalWarning must be used within a GlobalWarningProvider');
  }
  return context;
};

interface GlobalWarningProviderProps {
  children: ReactNode;
}

export const GlobalWarningProvider: React.FC<GlobalWarningProviderProps> = ({ children }) => {
  const [warnings, setWarnings] = useState<GlobalWarning[]>([]);

  const addWarning = (warning: Omit<GlobalWarning, 'id'>) => {
    const id = `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWarning: GlobalWarning = {
      ...warning,
      id,
      dismissible: warning.dismissible !== false,
      autoHide: warning.autoHide || false,
      autoHideDelay: warning.autoHideDelay || 5000,
    };

    setWarnings(prev => {
      // Check if similar warning already exists
      const existingWarning = prev.find(w => 
        w.type === newWarning.type && 
        w.title === newWarning.title && 
        w.message === newWarning.message
      );
      
      if (existingWarning) {
        return prev; // Don't add duplicate warnings
      }
      
      return [...prev, newWarning];
    });

    // Auto-hide warning if enabled
    if (newWarning.autoHide) {
      setTimeout(() => {
        removeWarning(id);
      }, newWarning.autoHideDelay);
    }
  };

  const removeWarning = (id: string) => {
    setWarnings(prev => prev.filter(warning => warning.id !== id));
  };

  const clearWarnings = () => {
    setWarnings([]);
  };

  const hasWarnings = warnings.length > 0;

  return (
    <GlobalWarningContext.Provider
      value={{
        warnings,
        addWarning,
        removeWarning,
        clearWarnings,
        hasWarnings,
      }}
    >
      {children}
    </GlobalWarningContext.Provider>
  );
};
