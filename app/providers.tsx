'use client';

import { SeasonalEvaluator } from '@/components/SeasonalEvaluator';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { clearDraft, getAllDrafts, saveDraft } from '@/lib/autosave-storage';
import { initializeClientErrorHandlers } from '@/lib/error-handlers/client-error-handler';
import { logger } from '@/lib/logger';
import { queryClient } from '@/lib/react-query';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  // Run one-time draft migration on client
  useDraftMigration();
  // Initialize global error handlers
  useGlobalErrorHandlers();
  return (
    <Auth0Provider>
      <QueryClientProvider client={queryClient}>
        <SafeSeasonalEvaluator />
        <Toaster richColors closeButton position="top-center" />
        {children}
      </QueryClientProvider>
    </Auth0Provider>
  );
}

// Initialize global error handlers once on client mount
function useGlobalErrorHandlers(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Defer initialization to idle time (fallback for browsers without requestIdleCallback)
    const deferInit: (cb: () => void) => void =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1000));

    deferInit(() => {
      initializeClientErrorHandlers();
      logger.dev('[Providers] Global error handlers initialized (deferred)');
    });
  }, []);
}

// Safe wrapper for SeasonalEvaluator to prevent hydration jitter
function SafeSeasonalEvaluator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <SeasonalEvaluator />;
}

// One-time client migration: purge very stale drafts and re-key "new" drafts with stable IDs
function useDraftMigration(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Defer migration to idle time - non-critical for initial render (fallback for browsers without requestIdleCallback)
    const deferMigrate: (cb: () => void) => void =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));

    deferMigrate(() => {
      try {
        const now = Date.now();
        const drafts = getAllDrafts(null);
        drafts.forEach(d => {
          const age = now - d.timestamp;
          // Purge drafts older than 7 days
          if (age > 7 * 24 * 60 * 60 * 1000) {
            clearDraft(d.entityType, d.entityId, d.userId);
            return;
          }
          // Re-key temporary ids
          if (d.entityId === 'new' || String(d.entityId).startsWith('tmp_')) {
            const data = (d.data || {}) as Record<string, unknown>;
            const keyFields: Array<string | number> = [];
            if (d.entityType === 'ingredients') {
              keyFields.push(String(data['ingredient_name'] || ''));
              keyFields.push(String(data['supplier'] || ''));
              keyFields.push(String(data['product_code'] || ''));
            } else if (d.entityType === 'recipes') {
              keyFields.push(String(data['name'] || ''));
            }
            const stableId = deriveAutosaveId(d.entityType, null, keyFields);
            if (stableId !== d.entityId) {
              saveDraft(d.entityType, stableId, d.data, d.userId);
              clearDraft(d.entityType, d.entityId, d.userId);
            }
          }
        });
        logger.dev('[Providers] Draft migration completed (deferred)');
      } catch (e) {
        // Migration should never block UI, but log for debugging
        logger.dev('[Providers] Draft migration error (non-blocking):', {
          error: e instanceof Error ? e.message : String(e),
        });
      }
    });
  }, []);
}
