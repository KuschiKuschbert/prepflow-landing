/**
 * Client-side global error handlers for uncaught errors and promise rejections.
 * Sends errors to server for logging in admin_error_logs table.
 */

import { logger } from '../logger';

interface ClientError {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  filename?: string;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
  url?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Send client-side error to server for logging.
 */
async function sendErrorToServer(error: ClientError): Promise<void> {
  try {
    // Always attempt to send - server will decide whether to store based on STORE_ERROR_LOGS
    // This allows the server to control error logging without client-side configuration

    await fetch('/api/admin/errors/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });
  } catch (err) {
    // Silently fail - don't let error reporting break the app
    logger.error('[ClientErrorHandler] Failed to send error to server:', err);
  }
}

/**
 * Handle uncaught JavaScript errors.
 */
function handleError(event: ErrorEvent): void {
  const error: ClientError = {
    message: event.message || 'Unknown error',
    source: event.filename || undefined,
    lineno: event.lineno || undefined,
    colno: event.colno || undefined,
    stack: event.error?.stack || undefined,
    filename: event.filename || undefined,
    error: event.error
      ? {
          message: event.error.message,
          stack: event.error.stack,
          name: event.error.name,
        }
      : undefined,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  sendErrorToServer(error);
}

/**
 * Handle unhandled promise rejections.
 */
function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const error: ClientError = {
    message: event.reason?.message || String(event.reason) || 'Unhandled promise rejection',
    stack: event.reason?.stack || undefined,
    error:
      event.reason instanceof Error
        ? {
            message: event.reason.message,
            stack: event.reason.stack,
            name: event.reason.name,
          }
        : undefined,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  sendErrorToServer(error);
}

/**
 * Initialize global error handlers.
 * Should be called once when the app loads.
 */
export function initializeClientErrorHandlers(): void {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Wrap in try-catch to prevent handler errors from breaking the app
  try {
    // Remove existing handlers if any (for hot reload in development)
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);

    // Add global error handlers
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
  } catch (err) {
    logger.error('[ClientErrorHandler] Failed to initialize error handlers:', err);
  }
}

/**
 * Cleanup error handlers (useful for testing or cleanup).
 */
export function cleanupClientErrorHandlers(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  } catch (err) {
    logger.error('[ClientErrorHandler] Failed to cleanup error handlers:', err);
  }
}
