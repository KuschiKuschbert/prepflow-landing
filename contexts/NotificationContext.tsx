'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

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

function NotificationContainer({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full px-4">
      {notifications.map(n => (
        <Toast key={n.id} type={n.type} message={n.message} />
      ))}
    </div>
  );
}

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

function Toast({ type, message }: ToastProps) {
  const styles = {
    success: 'border-green-500/30 bg-green-500/5 text-green-400',
    error: 'border-red-500/30 bg-red-500/5 text-red-400',
    warning: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
    info: 'border-[#29E7CD]/30 bg-[#29E7CD]/5 text-[#29E7CD]',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`rounded-xl border px-4 py-2.5 shadow-md backdrop-blur-sm ${styles[type]} animate-in slide-in-from-top duration-200`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{icons[type]}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}

