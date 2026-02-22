'use client';

import { useGlobalWarning } from '@/contexts/GlobalWarningContext';
import React from 'react';

interface GlobalWarningProps {
  onHeightChange?: (height: number) => void;
}

const GlobalWarning: React.FC<GlobalWarningProps> = ({ onHeightChange }) => {
  const { warnings, removeWarning } = useGlobalWarning();
  const warningRef = React.useRef<HTMLDivElement | null>(null);

  // Show only the first warning in the bar
  const warning = warnings.length > 0 ? warnings[0] : null;

  // Measure height and notify parent when it changes
  // Move useEffect before early return to comply with Rules of Hooks
  React.useEffect(() => {
    if (warningRef.current && onHeightChange && warning) {
      const updateHeight = () => {
        if (warningRef.current) {
          const height = warningRef.current.offsetHeight || 0;
          onHeightChange(height);
          // Also set CSS variable directly for immediate effect
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--warning-height', `${height}px`);
          }
        }
      };

      // Initial measurement - use requestAnimationFrame for immediate update
      let timeoutId: NodeJS.Timeout | null = null;
      requestAnimationFrame(() => {
        updateHeight();
        // Also measure after a short delay to catch any layout changes
        timeoutId = setTimeout(updateHeight, 50);
      });

      // Set up ResizeObserver for dynamic height changes
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(warningRef.current);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        resizeObserver.disconnect();
        onHeightChange(0); // Reset height when warning is removed
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--warning-height', '0px');
        }
      };
    } else if (!warning && onHeightChange) {
      // Reset height when no warnings
      onHeightChange(0);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--warning-height', '0px');
      }
    }
  }, [warning, onHeightChange]);

  // Early return AFTER hooks
  if (warnings.length === 0 || !warning) {
    return null;
  }

  const getWarningStyles = (type: string) => {
    switch (type) {
      case 'error':
        return {
          container:
            'bg-[var(--color-error-bg)] border-[var(--color-error-border)] text-[var(--color-error)]',
          icon: 'text-[var(--color-error)]',
          button: 'bg-[var(--color-error)] text-white hover:opacity-90',
        };
      case 'warning':
        return {
          container:
            'bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning)]',
          icon: 'text-[var(--color-warning)]',
          button: 'bg-[var(--color-warning)] text-white hover:opacity-90',
        };
      case 'info':
        return {
          container:
            'bg-[var(--color-info-bg)] border-[var(--color-info-border)] text-[var(--color-info)]',
          icon: 'text-[var(--color-info)]',
          button: 'bg-[var(--color-info)] text-white hover:opacity-90',
        };
      case 'success':
        return {
          container:
            'bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success)]',
          icon: 'text-[var(--color-success)]',
          button: 'bg-[var(--color-success)] text-white hover:opacity-90',
        };
      default:
        return {
          container: 'bg-[var(--muted)]/80 border-[var(--border)] text-[var(--foreground)]',
          icon: 'text-[var(--foreground-muted)]',
          button: 'bg-[var(--primary)] text-white hover:opacity-90',
        };
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'success':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const styles = getWarningStyles(warning.type);

  return (
    <div
      ref={warningRef}
      className={`fixed right-0 left-0 z-50 w-full border-b shadow-lg backdrop-blur-md ${styles.container} desktop:top-[calc(var(--header-height-desktop)+var(--safe-area-inset-top))] top-[calc(var(--header-height-mobile)+var(--safe-area-inset-top))] transition-all duration-300`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`flex-shrink-0 ${styles.icon}`}>{getWarningIcon(warning.type)}</div>
            <div className="min-w-0">
              <h4 className="text-sm leading-tight font-bold">{warning.title || 'Notification'}</h4>
              <p className="tablet:whitespace-normal truncate text-xs opacity-90">
                {warning.message}
              </p>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center space-x-2">
            {warning.action && (
              <button
                onClick={() => {
                  warning.action?.onClick();
                  removeWarning(warning.id);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 ${styles.button}`}
              >
                {warning.action.label}
              </button>
            )}
            {warning.dismissible && (
              <button
                onClick={() => removeWarning(warning.id)}
                className="rounded-full p-1 transition-colors hover:bg-white/10 focus:ring-2 focus:ring-white/20 focus:outline-none"
                aria-label="Dismiss warning"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalWarning;
