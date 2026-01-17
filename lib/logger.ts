/**
 * Logger utilities - re-exported from specialized modules.
 */

import { detectCategory } from './error-detection/category-detector';
import { detectSeverity } from './error-detection/severity-detector';
import { createLogEntry, formatLogEntry, type ErrorContext } from './logger/logEntry';

import { logger } from '@/lib/logger';

const isDev = process.env.NODE_ENV === 'development';
const enableProdLogs = process.env.NEXT_PUBLIC_ENABLE_PROD_LOGS === 'true';

// Re-export types
export type { ErrorContext } from './logger/logEntry';

/**
 * Store error in admin_error_logs table (non-blocking).
 * This runs asynchronously and won't block the main execution.
 */
async function storeErrorInDatabase(
  message: string,
  context?: ErrorContext,
  error?: Error,
): Promise<void> {
  // Only store on server-side and in production or if explicitly enabled
  if (typeof window !== 'undefined') return; // Client-side, skip
  if (!isDev && process.env.STORE_ERROR_LOGS !== 'true') {
    return;
  }

  // Run asynchronously to avoid blocking
  // Use setTimeout in browser, setImmediate in Node.js
  const scheduleAsync = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
  scheduleAsync(async () => {
    try {
      // Lazy import supabaseAdmin to prevent module load failures if env vars are missing
      // This allows logger to work even if Supabase is unavailable
      let supabaseAdminModule;
      try {
        supabaseAdminModule = await import('./supabase');
      } catch (importErr) {
        // Supabase module failed to load (likely missing env vars) - skip database storage
        // Logger still works, just won't store errors in DB
        return;
      }

      const supabaseAdmin = supabaseAdminModule.supabaseAdmin;
      if (!supabaseAdmin) return;

      // Auto-detect severity and category if not explicitly provided
      const detectionContext = {
        message,
        error: error?.message || error,
        endpoint: context?.endpoint,
        component: context?.component,
        operation: context?.operation,
        ...context,
      };

      const severity = context?.severity || detectSeverity(detectionContext);
      const category = context?.category || detectCategory(detectionContext);

      const { error: insertError } = await supabaseAdmin.from('admin_error_logs').insert({
        user_id: context?.userId || null,
        endpoint: context?.endpoint || null,
        error_message: message,
        stack_trace: error?.stack || null,
        context: context ? JSON.parse(JSON.stringify(context)) : null,
        severity,
        category,
        status: 'new',
      });

      if (insertError) {
        // Silently fail - don't let error logging break the app
        // Use console.error directly to avoid circular dependency (logger.error would cause infinite loop)
        logger.error('[Logger] Failed to store error in database:', insertError);
      }
    } catch (err) {
      // Silently fail - don't let error logging break the app
      // Use console.error directly to avoid circular dependency (logger.error would cause infinite loop)
      logger.error('[Logger] Failed to store error in database:', err);
    }
  }, 0);
}

export const logger = {
  dev: (message: string, data?: unknown): void => {
    if (isDev || enableProdLogs) {
      const entry = createLogEntry('dev', message, data);
      const formatted = formatLogEntry(entry);
      logger.dev(`[DEV] ${formatted}`);
    }
  },

  error: (
    message: string,
    contextOrError?: ErrorContext | Error | unknown,
    error?: Error,
  ): void => {
    let logError: Error | undefined;
    let context: ErrorContext | undefined;
    if (contextOrError instanceof Error) {
      logError = contextOrError;
    } else if (contextOrError && typeof contextOrError === 'object') {
      context = contextOrError as ErrorContext;
      if (error) {
        logError = error;
      }
    }

    const entry = createLogEntry('error', message, context, logError);
    const formatted = formatLogEntry(entry);
    logger.error(`[ERROR] ${formatted}`);

    // Store error in database for admin viewing
    storeErrorInDatabase(message, context, logError);
  },

  warn: (message: string, context?: ErrorContext | unknown): void => {
    const entry = createLogEntry('warn', message, context);
    const formatted = formatLogEntry(entry);
    logger.warn(`[WARN] ${formatted}`);
  },

  info: (message: string, context?: ErrorContext | unknown): void => {
    if (isDev || enableProdLogs) {
      const entry = createLogEntry('info', message, context);
      const formatted = formatLogEntry(entry);
      logger.info(`[INFO] ${formatted}`);
    }
  },

  debug: (message: string, data?: unknown): void => {
    if (isDev || enableProdLogs) {
      const entry = createLogEntry('debug', message, data);
      const formatted = formatLogEntry(entry);
      logger.debug(`[DEBUG] ${formatted}`);
    }
  },
};

export const devLog = logger.dev;
export const devInfo = logger.info;
export const devDebug = logger.debug;
