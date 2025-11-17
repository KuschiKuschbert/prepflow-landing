import { logger } from '@/lib/logger';

export function extractErrorMessage(err: unknown): string {
  let errorMessage = 'Failed to save changes';
  if (err && typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    if (errorObj.message) {
      errorMessage = String(errorObj.message);
      if (errorObj.details && String(errorObj.details).trim())
        errorMessage += `: ${errorObj.details}`;
      if (errorObj.hint && String(errorObj.hint).trim()) errorMessage += ` (${errorObj.hint})`;
    } else if (errorObj.details) {
      errorMessage = String(errorObj.details);
    } else if (errorObj.hint) {
      errorMessage = String(errorObj.hint);
    } else if ('code' in errorObj && errorObj.code) {
      errorMessage = `Database error (${String(errorObj.code)})`;
    }
  } else if (err instanceof Error) {
    errorMessage = err.message || 'Failed to save changes';
  } else if (typeof err === 'string') {
    errorMessage = err;
  }
  return errorMessage;
}

export function broadcastAutosaveStatus(
  status: 'saving' | 'saved' | 'error',
  entityType: string,
  entityId: string | null,
  error?: string,
): void {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('autosave:status', {
          detail: { status, entityType, entityId, ...(error && { error }) },
        }),
      );
    }
  } catch {}
}

export function logAutosaveError(entityType: string, entityId: string | null, err: unknown): void {
  logger.error(`Autosave error for ${entityType}/${entityId}:`, err);
  logger.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
}
