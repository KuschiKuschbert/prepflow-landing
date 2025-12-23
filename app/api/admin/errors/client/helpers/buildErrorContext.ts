import { detectCategory } from '@/lib/error-detection/category-detector';
import { detectSeverity } from '@/lib/error-detection/severity-detector';

interface ClientErrorData {
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

interface ErrorContext {
  message: string;
  stackTrace?: string;
  severity: string;
  category: string;
  context: Record<string, unknown>;
}

/**
 * Build error context from client error data
 *
 * @param {ClientErrorData} errorData - Validated client error data
 * @returns {ErrorContext} Error context with severity and category
 */
export function buildErrorContext(errorData: ClientErrorData): ErrorContext {
  // Auto-detect severity and category
  const detectionContext = {
    message: errorData.message,
    error: errorData.error?.message || errorData.message,
    endpoint: errorData.url,
    component: errorData.filename || errorData.source,
  };

  const severity = detectSeverity(detectionContext);
  const category = detectCategory(detectionContext);

  // Build error message with context
  const errorMessage = errorData.error?.message || errorData.message;
  const stackTrace = errorData.error?.stack || errorData.stack || undefined;

  // Build context object
  const context = {
    source: errorData.source,
    lineno: errorData.lineno,
    colno: errorData.colno,
    filename: errorData.filename,
    url: errorData.url,
    userAgent: errorData.userAgent,
    timestamp: errorData.timestamp,
  };

  return {
    message: errorMessage,
    stackTrace,
    severity,
    category,
    context,
  };
}
