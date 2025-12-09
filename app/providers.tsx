'use client';

import { SeasonalEvaluator } from '@/components/SeasonalEvaluator';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { clearDraft, getAllDrafts, saveDraft } from '@/lib/autosave-storage';
import { initializeClientErrorHandlers } from '@/lib/error-handlers/client-error-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  // Run one-time draft migration on client
  useDraftMigration();
  // Initialize global error handlers
  useGlobalErrorHandlers();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SeasonalEvaluator />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}

// Initialize global error handlers once on client mount
function useGlobalErrorHandlers(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initializeClientErrorHandlers();
  }, []);
}

// One-time client migration: purge very stale drafts and re-key "new" drafts with stable IDs
function useDraftMigration(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
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
    } catch (e) {
      // Silent: migration should never block UI
    }
  }, []);
}
