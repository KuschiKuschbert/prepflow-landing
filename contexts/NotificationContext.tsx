'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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

  // Listen for personality toast events
  React.useEffect(() => {
    const handlePersonalityToast = (event: CustomEvent<{ message: string }>) => {
      addNotification('info', event.detail.message);
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

function NotificationContainer({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
    >
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
  const [isVisible, setIsVisible] = useState(true);

  const styles = {
    success: {
      container: 'border-green-500/30 bg-green-500/10 text-green-400',
      icon: 'text-green-400',
    },
    error: {
      container: 'border-red-500/30 bg-red-500/10 text-red-400',
      icon: 'text-red-400',
    },
    warning: {
      container: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
      icon: 'text-yellow-400',
    },
    info: {
      container: 'border-[#29E7CD]/30 bg-[#29E7CD]/10 text-[#29E7CD]',
      icon: 'text-[#29E7CD]',
    },
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const style = styles[type];
  const IconComponent = icons[type];

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300 ${style.container} animate-in slide-in-from-top fade-in duration-200`}
      role="alert"
      aria-live="polite"
    >
      <Icon icon={IconComponent} size="sm" className={style.icon} aria-hidden={true} />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-400 transition-colors hover:text-white"
        aria-label="Close notification"
      >
        <Icon icon={XCircle} size="xs" className="text-current" aria-hidden={true} />
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}
