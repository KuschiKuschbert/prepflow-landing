'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Warning {
  id: string;
  title?: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  dismissible?: boolean;
  autoHide?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GlobalWarningContextType {
  warnings: Warning[];
  addWarning: (warning: Partial<Warning> | string, type?: 'error' | 'warning' | 'info') => void;
  removeWarning: (id: string) => void;
  clearWarnings: () => void;
}

const GlobalWarningContext = createContext<GlobalWarningContextType | undefined>(undefined);

export const GlobalWarningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [warnings, setWarnings] = useState<Warning[]>([]);

  const addWarning = (
    warning: Partial<Warning> | string,
    type: 'error' | 'warning' | 'info' = 'warning',
  ) => {
    const warningObj: Warning =
      typeof warning === 'string'
        ? {
            id: Date.now().toString(),
            message: warning,
            type,
            timestamp: new Date(),
          }
        : {
            id: Date.now().toString(),
            message: warning.message || '',
            type: warning.type || type,
            timestamp: new Date(),
            title: warning.title,
            dismissible: warning.dismissible,
            autoHide: warning.autoHide,
            action: warning.action,
          };

    setWarnings(prev => [...prev, warningObj]);
  };

  const removeWarning = (id: string) => {
    setWarnings(prev => prev.filter(warning => warning.id !== id));
  };

  const clearWarnings = () => {
    setWarnings([]);
  };

  return (
    <GlobalWarningContext.Provider value={{ warnings, addWarning, removeWarning, clearWarnings }}>
      {children}
    </GlobalWarningContext.Provider>
  );
};

export const useGlobalWarning = () => {
  const context = useContext(GlobalWarningContext);
  if (context === undefined) {
    throw new Error('useGlobalWarning must be used within a GlobalWarningProvider');
  }
  return context;
};
