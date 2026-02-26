'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationContainer } from '@/components/ui/NotificationContainer';
import type { Notification } from '@/components/ui/NotificationContainer';

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Provides toast notification state to the component tree.
 * Wraps children with `NotificationContext` and renders the toast container.
 *
 * @param {object} props
 * @param {ReactNode} props.children - Components that can call {@link useNotification}
 * @returns {JSX.Element} Provider with notification overlay
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Personality messages linger for 8 s, everything else 3 s
    const timeoutDuration = duration ?? (type === 'personality' ? 8000 : 3000);
    setNotifications(prev => [...prev, { id, type, message, duration: timeoutDuration }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, timeoutDuration);
  };

  // Listen for personality toast events dispatched from outside React
  React.useEffect(() => {
    const handlePersonalityToast = (event: CustomEvent<{ message: string }>) => {
      addNotification('personality', event.detail.message, 8000);
    };
    window.addEventListener('personality:addToast', handlePersonalityToast as EventListener);
    return () => {
      window.removeEventListener('personality:addToast', handlePersonalityToast as EventListener);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showSuccess: msg => addNotification('success', msg),
        showError: msg => addNotification('error', msg),
        showWarning: msg => addNotification('warning', msg),
        showInfo: msg => addNotification('info', msg),
      }}
    >
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
}

/**
 * Access the notification API inside any component wrapped by {@link NotificationProvider}.
 *
 * @returns {{ showSuccess, showError, showWarning, showInfo }} - Toast trigger functions
 * @throws {Error} If called outside of `NotificationProvider`
 *
 * @example
 * ```tsx
 * const { showSuccess } = useNotification();
 * showSuccess('Ingredient saved!');
 * ```
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}
