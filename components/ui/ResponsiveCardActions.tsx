'use client';

/**
 * Responsive Card Actions Component
 *
 * Automatically handles device-appropriate action menus:
 * - Hover overlay on devices with hover capability (mouse/trackpad)
 * - Meatball menu on touch devices (tablets, phones, foldables)
 *
 * Uses CSS media queries for hover capability detection, ensuring
 * optimal UX on all device types including hybrid form factors.
 *
 * @component
 */

import { useState, useRef, useEffect } from 'react';
import { Icon as IconWrapper } from '@/components/ui/Icon';
import { MoreVertical, X, type LucideIcon } from 'lucide-react';

export interface Action {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface ResponsiveCardActionsProps {
  actions: Action[];
  /** Position of the actions menu */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Design system theme */
  theme?: 'curbos' | 'prepflow';
  /** Custom className for hover overlay container */
  overlayClassName?: string;
  /** Custom className for meatball menu container */
  menuClassName?: string;
  /** Called after any action is executed (useful for closing menus) */
  onActionComplete?: () => void;
}

/**
 * Responsive card actions component with automatic device detection
 */
export function ResponsiveCardActions({
  actions,
  position = 'top-right',
  theme = 'curbos',
  overlayClassName = '',
  menuClassName = '',
  onActionComplete,
}: ResponsiveCardActionsProps) {
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
      overlay: {
        container: 'bg-black/40 backdrop-blur-[2px]',
        buttonPrimary: 'bg-[#C0FF02] text-black hover:bg-background',
        buttonSecondary: 'bg-neutral-900/90 text-white',
        buttonDanger:
          'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white',
      },
      menu: {
        container: 'bg-neutral-900/90 backdrop-blur-xl border border-white/10',
        toggleButton: 'bg-neutral-900/90 text-white border border-white/20',
        closeButton: 'bg-neutral-900/90 text-white border border-white/20',
        buttonPrimary: 'bg-[#C0FF02] text-black',
        buttonSecondary: 'bg-neutral-900/90 text-white',
        buttonDanger: 'bg-red-500/20 text-red-500 border border-red-500/50',
        divider: 'bg-white/10',
      },
    },
    prepflow: {
      overlay: {
        container: 'bg-[var(--muted)]/90 backdrop-blur-sm',
        buttonPrimary: 'bg-[var(--primary)] text-[var(--primary-text)]',
        buttonSecondary: 'bg-[var(--muted)] text-[var(--foreground)]',
        buttonDanger:
          'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-border)]',
      },
      menu: {
        container: 'bg-[var(--muted)] backdrop-blur-xl border border-[var(--border)]',
        toggleButton: 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]',
        closeButton: 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]',
        buttonPrimary: 'bg-[var(--primary)] text-[var(--primary-text)]',
        buttonSecondary: 'bg-[var(--muted)] text-[var(--foreground)]',
        buttonDanger:
          'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-border)]',
        divider: 'bg-[var(--border)]',
      },
    },
  };

  const styles = themeStyles[theme];

  return (
    <>
      {/* --- DESKTOP: HOVER OVERLAY --- */}
      <div
        className={`hover-capable-show absolute inset-0 ${styles.overlay.container} z-20 translate-y-4 items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${overlayClassName}`}
      >
        {actions.map(action => {
          const ActionIcon = action.icon;
          const buttonClass =
            action.variant === 'primary'
              ? styles.overlay.buttonPrimary
              : action.variant === 'danger'
                ? styles.overlay.buttonDanger
                : styles.overlay.buttonSecondary;

          return (
            <button
              key={action.id}
              onClick={e => {
                e.stopPropagation();
                handleAction(action);
              }}
              disabled={action.disabled}
              className={`rounded-full p-3 shadow-lg transition-all hover:scale-110 ${buttonClass} ${
                action.disabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
              title={action.label}
              aria-label={action.label}
            >
              <IconWrapper icon={ActionIcon} size="sm" aria-hidden />
            </button>
          );
        })}
      </div>

      {/* --- MOBILE/TOUCH: MEATBALL MENU --- */}
      <div
        ref={menuRef}
        className={`hover-capable-hide absolute ${positionClasses} z-30 flex items-end ${menuClassName}`}
      >
        {!showMobileMenu ? (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowMobileMenu(true);
            }}
            className={`rounded-full p-2 shadow-xl backdrop-blur-md transition-all active:scale-90 ${styles.menu.toggleButton}`}
            aria-label="Show actions"
          >
            <IconWrapper icon={MoreVertical} size="md" aria-hidden />
          </button>
        ) : (
          <div
            className={`animate-in fade-in slide-in-from-top-4 flex flex-col items-end gap-2 rounded-2xl p-1.5 shadow-2xl duration-200 ${styles.menu.container}`}
          >
            <button
              onClick={e => {
                e.stopPropagation();
                setShowMobileMenu(false);
              }}
              className={`rounded-full p-2 backdrop-blur-md transition-transform active:scale-95 ${styles.menu.closeButton}`}
              aria-label="Close menu"
            >
              <IconWrapper icon={X} size="sm" aria-hidden />
            </button>
            <div className={`my-0.5 h-px w-4 ${styles.menu.divider}`} />
            {actions.map(action => {
              const ActionIcon = action.icon;
              const buttonClass =
                action.variant === 'primary'
                  ? styles.menu.buttonPrimary
                  : action.variant === 'danger'
                    ? styles.menu.buttonDanger
                    : styles.menu.buttonSecondary;

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
                  <IconWrapper icon={ActionIcon} size="sm" aria-hidden />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
