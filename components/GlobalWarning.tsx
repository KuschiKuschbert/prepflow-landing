'use client';

import React from 'react';
import { useGlobalWarning } from '@/contexts/GlobalWarningContext';

const GlobalWarning: React.FC = () => {
  const { warnings, removeWarning } = useGlobalWarning();

  if (warnings.length === 0) return null;

  const getWarningStyles = (type: string) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-500/10 border-red-500/30 text-red-400',
          icon: 'text-red-400',
          iconBg: 'bg-red-500/20',
        };
      case 'warning':
        return {
          container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          icon: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
        };
      case 'info':
        return {
          container: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
        };
      case 'success':
        return {
          container: 'bg-green-500/10 border-green-500/30 text-green-400',
          icon: 'text-green-400',
          iconBg: 'bg-green-500/20',
        };
      default:
        return {
          container: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
          icon: 'text-gray-400',
          iconBg: 'bg-gray-500/20',
        };
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {warnings.map((warning) => {
        const styles = getWarningStyles(warning.type);
        
        return (
          <div
            key={warning.id}
            className={`${styles.container} border rounded-xl p-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform animate-in slide-in-from-right-5`}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`${styles.iconBg} p-1 rounded-full flex-shrink-0`}>
                <div className={styles.icon}>
                  {getWarningIcon(warning.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">
                  {warning.title}
                </h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  {warning.message}
                </p>
                
                {/* Action Button */}
                {warning.action && (
                  <button
                    onClick={warning.action.onClick}
                    className="mt-2 text-xs font-medium hover:underline focus:outline-none focus:underline"
                  >
                    {warning.action.label}
                  </button>
                )}
              </div>

              {/* Dismiss Button */}
              {warning.dismissible && (
                <button
                  onClick={() => removeWarning(warning.id)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                  aria-label="Dismiss warning"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalWarning;
