'use client';

/**
 * Responsive Card Actions Menu Component
 *
 * Meatball menu for touch devices (tablets, phones, foldables).
 * Automatically hidden on hover-capable devices via CSS media queries.
 *
 * @component
 */

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, X } from 'lucide-react';
import type { Action } from './ResponsiveCardActions';

export interface ResponsiveCardActionsMenuProps {
  actions: Action[];
  /** Position of the actions menu */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Design system theme */
  theme?: 'curbos' | 'prepflow';
  /** Custom className for menu container */
  className?: string;
  /** Called after any action is executed (useful for closing menus) */
  onActionComplete?: () => void;
}

/**
 * Responsive card actions menu component (touch device meatball menu)
 */
export function ResponsiveCardActionsMenu({
  actions,
  position = 'top-right',
  theme = 'curbos',
  className = '',
  onActionComplete,
}: ResponsiveCardActionsMenuProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showMobileMenu]);

  if (!actions || actions.length === 0) {
    return null;
  }

  const handleAction = (action: Action) => {
    if (action.disabled) return;

    action.onClick();
    setShowMobileMenu(false);
    onActionComplete?.();
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-3 right-3',
    'top-left': 'top-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'bottom-left': 'bottom-3 left-3',
  }[position];

  // Theme-based styling
  const themeStyles = {
    curbos: {
      container: 'bg-neutral-900/90 backdrop-blur-xl border border-white/10',
      toggleButton: 'bg-neutral-900/90 text-white border border-white/20',
      closeButton: 'bg-neutral-900/90 text-white border border-white/20',
      buttonPrimary: 'bg-[#C0FF02] text-black',
      buttonSecondary: 'bg-neutral-900/90 text-white',
      buttonDanger: 'bg-red-500/20 text-red-500 border border-red-500/50',
      divider: 'bg-white/10',
    },
    prepflow: {
      container: 'bg-[var(--muted)] backdrop-blur-xl border border-[var(--border)]',
      toggleButton: 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]',
      closeButton: 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]',
      buttonPrimary: 'bg-[var(--primary)] text-[var(--primary-text)]',
      buttonSecondary: 'bg-[var(--muted)] text-[var(--foreground)]',
      buttonDanger:
        'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-border)]',
      divider: 'bg-[var(--border)]',
    },
  };

  const styles = themeStyles[theme];

  return (
    <div
      ref={menuRef}
      className={`hover-capable-hide absolute ${positionClasses} z-30 flex items-end ${className}`}
    >
      {!showMobileMenu ? (
        <button
          onClick={e => {
            e.stopPropagation();
            setShowMobileMenu(true);
          }}
          className={`rounded-full p-2 shadow-xl backdrop-blur-md transition-all active:scale-90 ${styles.toggleButton}`}
          aria-label="Show actions"
        >
          <MoreVertical size={20} />
        </button>
      ) : (
        <div
          className={`animate-in fade-in slide-in-from-top-4 flex flex-col items-end gap-2 rounded-2xl p-1.5 shadow-2xl duration-200 ${styles.container}`}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              setShowMobileMenu(false);
            }}
            className={`rounded-full p-2 backdrop-blur-md transition-transform active:scale-95 ${styles.closeButton}`}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
          <div className={`my-0.5 h-px w-4 ${styles.divider}`} />
          {actions.map(action => {
            const Icon = action.icon;
            const buttonClass =
              action.variant === 'primary'
                ? styles.buttonPrimary
                : action.variant === 'danger'
                  ? styles.buttonDanger
                  : styles.buttonSecondary;

            return (
              <button
                key={action.id}
                onClick={e => {
                  e.stopPropagation();
                  handleAction(action);
                }}
                disabled={action.disabled}
                className={`rounded-full p-2 transition-transform active:scale-95 ${buttonClass} ${
                  action.disabled ? 'cursor-not-allowed opacity-50' : ''
                }`}
                aria-label={action.label}
              >
                <Icon size={16} strokeWidth={2.5} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
