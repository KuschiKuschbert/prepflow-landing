'use client';

/**
 * Toast notification component.
 * Renders a single dismissible toast message in one of five visual variants.
 * Used internally by {@link NotificationContainer}.
 */

import { CheckCircle2, XCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Icon } from './Icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'personality';

export interface ToastProps {
  /** Visual variant of the toast */
  type: ToastType;
  /** Text to display */
  message: string;
}

const STYLES: Record<ToastType, { container: string; icon: string }> = {
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
    container:
      'border-[#29E7CD]/50 bg-gradient-to-r from-[#29E7CD]/20 via-[#FF6B00]/20 via-[#D925C7]/20 to-[#29E7CD]/20 text-[var(--foreground)] shadow-2xl backdrop-blur-md',
    icon: 'text-[#29E7CD]',
  },
};

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  personality: Sparkles,
};

/**
 * Renders a dismissible toast notification.
 *
 * @param {ToastProps} props - Toast variant and message
 * @returns {JSX.Element | null} Toast element, or null once dismissed
 */
export function Toast({ type, message }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isPersonality = type === 'personality';
  const style = STYLES[type];
  const IconComponent = ICONS[type];

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
          isPersonality
            ? 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            : 'text-[var(--foreground-subtle)] hover:text-[var(--foreground)]'
        }`}
        aria-label="Close notification"
      >
        <Icon icon={XCircle} size="xs" className="text-current" aria-hidden={true} />
      </button>
    </div>
  );
}
