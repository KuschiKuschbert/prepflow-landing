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
      requestAnimationFrame(() => {
        updateHeight();
        // Also measure after a short delay to catch any layout changes
        setTimeout(updateHeight, 50);
      });

      // Set up ResizeObserver for dynamic height changes
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(warningRef.current);

      return () => {
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
          container: 'bg-red-900/90 border-red-700/50 text-red-100',
          icon: 'text-red-400',
          button: 'bg-red-800/50 hover:bg-red-700/50 text-red-100',
        };
      case 'warning':
        return {
          container: 'bg-yellow-900/90 border-yellow-700/50 text-yellow-100',
          icon: 'text-yellow-400',
          button: 'bg-yellow-800/50 hover:bg-yellow-700/50 text-yellow-100',
        };
      case 'info':
        return {
          container: 'bg-blue-900/90 border-blue-700/50 text-blue-100',
          icon: 'text-blue-400',
          button: 'bg-blue-800/50 hover:bg-blue-700/50 text-blue-100',
        };
      case 'success':
        return {
          container: 'bg-green-900/90 border-green-700/50 text-green-100',
          icon: 'text-green-400',
          button: 'bg-green-800/50 hover:bg-green-700/50 text-green-100',
        };
      default:
        return {
          container: 'bg-gray-900/90 border-gray-700/50 text-gray-100',
          icon: 'text-gray-400',
          button: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-100',
        };
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const styles = getWarningStyles(warning.type);

  return (
    <div
      ref={warningRef}
      className={`fixed right-0 left-0 z-[45] w-full border-b backdrop-blur-sm ${styles.container} top-[calc(var(--header-height-mobile)+var(--safe-area-inset-top))] lg:top-[calc(var(--header-height-desktop)+var(--safe-area-inset-top))] transition-all duration-200`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={styles.icon}>{getWarningIcon(warning.type)}</div>
            <div>
              <h4 className="text-fluid-sm font-semibold">{warning.title || 'Notification'}</h4>
              <p className="text-fluid-xs opacity-90">{warning.message}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {warning.action && (
              <button
                onClick={() => {
                  warning.action?.onClick();
                  removeWarning(warning.id);
                }}
                className={`rounded-lg px-3 py-1.5 text-fluid-xs font-medium transition-colors duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none ${styles.button}`}
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
