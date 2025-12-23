/**
 * Square Auto-Sync Hook
 * Client-side hook for managing Supabase real-time subscriptions for automatic Square syncing
 */

'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { useSession } from 'next-auth/react';
import { createDebounceSync } from './useSquareAutoSync/helpers/createDebounceSync';
import { setupSquareSubscriptions } from './useSquareAutoSync/helpers/setupSquareSubscriptions';
// Note: This hook triggers syncs via API endpoints, not direct server-side calls
// The actual sync logic is handled server-side via API routes

export interface UseSquareAutoSyncOptions {
  enabled?: boolean; // Override auto-sync enabled check
  debounceMs?: number; // Debounce time for rapid changes
}

/**
 * Hook to set up Square auto-sync subscriptions
 * Listens for changes to employees, dishes, recipes, and ingredients
 */
export function useSquareAutoSync(options: UseSquareAutoSyncOptions = {}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const debounceTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!userId) {
      return;
    }

    if (!supabase) {
      return;
    }

    // Check if auto-sync is enabled (via API)
    let isEnabled = options.enabled;
    if (isEnabled === undefined) {
      // Check server-side via API if not provided
      fetch('/api/square/config')
        .then(res => res.json())
        .then(data => {
          if (data.config) {
            isEnabled = data.config.auto_sync_enabled === true;
          }
        })
        .catch(err => {
          logger.error('[Square Auto-Sync Hook] Error checking auto-sync status:', {
            error: err.message,
            userId,
          });
        });
    }

    if (isEnabled === false) {
      return;
    }

    const debounceDelay = options.debounceMs || 5000;
    const debounceSync = createDebounceSync({
      debounceTimersRef,
      debounceDelay,
      userId,
    });
    const channel = setupSquareSubscriptions({ debounceSync, userId });

    return () => {
      // Cleanup: unsubscribe and clear timers
      channel.unsubscribe();
      debounceTimersRef.current.forEach(timer => clearTimeout(timer));
      debounceTimersRef.current.clear();
      logger.dev('[Square Auto-Sync Hook] Subscriptions cleaned up');
    };
  }, [userId, options.enabled, options.debounceMs]);
}
