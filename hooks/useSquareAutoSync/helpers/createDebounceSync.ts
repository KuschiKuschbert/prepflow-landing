import { logger } from '@/lib/logger';

interface CreateDebounceSyncParams {
  debounceTimersRef: React.MutableRefObject<Map<string, NodeJS.Timeout>>;
  debounceDelay: number;
  userId?: string;
}

/**
 * Create debounced sync function for Square auto-sync
 */
export function createDebounceSync({
  debounceTimersRef,
  debounceDelay,
  userId,
}: CreateDebounceSyncParams) {
  return (key: string, entityType: string, entityId: string, operation: string) => {
    const existingTimer = debounceTimersRef.current.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/square/sync/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityType,
            entityId,
            operation,
          }),
        });
      } catch (error: any) {
        logger.error('[Square Auto-Sync Hook] Error in debounced sync:', {
          error: error.message,
          key,
          userId,
        });
      } finally {
        debounceTimersRef.current.delete(key);
      }
    }, debounceDelay);
    debounceTimersRef.current.set(key, timer);
  };
}

