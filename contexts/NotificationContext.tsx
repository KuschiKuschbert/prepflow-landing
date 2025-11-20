'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'personality';
  message: string;
  duration?: number; // Optional custom duration in milliseconds
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

  const addNotification = (type: Notification['type'], message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);

    // Use custom duration or default based on type
    // Personality messages: 8 seconds, others: 3 seconds
    const timeoutDuration = duration ?? (type === 'personality' ? 8000 : 3000);

    setNotifications(prev => [...prev, { id, type, message, duration: timeoutDuration }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, timeoutDuration);
  };

  // Listen for personality toast events
  React.useEffect(() => {
    const handlePersonalityToast = (event: CustomEvent<{ message: string }>) => {
      // Use 'personality' type with longer duration (8 seconds)
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

function NotificationContainer({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) return null;

  // Separate personality notifications from regular ones
  const personalityNotifications = notifications.filter(n => n.type === 'personality');
  const regularNotifications = notifications.filter(n => n.type !== 'personality');

  return (
    <>
      {/* Personality notifications - more prominent, positioned lower */}
      {personalityNotifications.length > 0 && (
        <div
          role="status"
          aria-live="assertive"
          className="desktop:top-[calc(var(--header-height-desktop,64px)+var(--safe-area-inset-top,0px)+24px)] fixed top-[calc(var(--header-height-mobile,56px)+var(--safe-area-inset-top,0px)+24px)] left-1/2 z-[60] flex w-full max-w-lg -translate-x-1/2 flex-col gap-3 px-4"
        >
          {personalityNotifications.map(n => (
            <Toast key={n.id} type={n.type} message={n.message} />
          ))}
        </div>
      )}

      {/* Regular notifications - original position */}
      {regularNotifications.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
        >
          {regularNotifications.map(n => (
            <Toast key={n.id} type={n.type} message={n.message} />
          ))}
        </div>
      )}
    </>
  );
}

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'personality';
  message: string;
}

function Toast({ type, message }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isPersonality = type === 'personality';

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
    personality: {
      // More prominent styling for personality messages
      container:
        'border-[#29E7CD]/50 bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 to-[#29E7CD]/20 text-white shadow-2xl backdrop-blur-md',
      icon: 'text-[#29E7CD]',
    },
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    personality: Sparkles, // Special icon for personality messages
  };

  const style = styles[type];
  const IconComponent = icons[type];

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center gap-4 rounded-3xl border-2 px-6 py-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
        style.container
      } ${
        isPersonality
          ? 'animate-in slide-in-from-top fade-in scale-100 animate-pulse duration-300'
          : 'animate-in slide-in-from-top fade-in duration-200'
      }`}
      role="alert"
      aria-live={isPersonality ? 'assertive' : 'polite'}
    >
      <Icon
        icon={IconComponent}
        size={isPersonality ? 'lg' : 'sm'}
        className={style.icon}
        aria-hidden={true}
      />
      <span
        className={`flex-1 font-medium ${isPersonality ? 'text-base leading-relaxed' : 'text-sm'}`}
      >
        {message}
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className={`transition-colors ${
          isPersonality ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-white'
        }`}
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
