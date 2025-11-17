'use client';

import React, { useState, useEffect } from 'react';
import { getAllDrafts, DraftMetadata, clearDraft } from '@/lib/autosave-storage';
import { syncAllDrafts } from '@/lib/autosave-sync';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSession } from 'next-auth/react';

import { logger } from '../../lib/logger';
export function DraftRecovery() {
  const session = useSession();
  // Safely destructure session data, handling undefined during SSR
  const sessionData = session?.data;
  const userId = sessionData?.user?.email || null;
  const [drafts, setDrafts] = useState<DraftMetadata[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    // Only check drafts on client side after hydration
    if (typeof window === 'undefined') return;

    // Check for unsynced drafts on mount
    const checkDrafts = () => {
      const allDrafts = getAllDrafts(userId);
      const now = Date.now();

      // Purge very stale drafts (>24h)
      const staleThreshold = 24 * 60 * 60 * 1000;
      allDrafts.forEach(d => {
        if (now - d.timestamp > staleThreshold) {
          clearDraft(d.entityType, d.entityId, d.userId);
        }
      });

      // Filter drafts that are likely meaningful and older than 10 minutes
      const unsyncedDrafts = allDrafts.filter(draft => {
        const age = now - draft.timestamp;
        if (age < 10 * 60 * 1000) return false; // younger than 10 minutes
        // Minimal signal per entity type to avoid false prompts
        const data = draft.data as Record<string, unknown> | null;
        if (!data || Object.keys(data).length === 0) return false;
        if (draft.entityType === 'ingredients') {
          return Boolean((data as any).ingredient_name);
        }
        if (draft.entityType === 'recipes') {
          return Boolean((data as any).name);
        }
        return true;
      });

      if (unsyncedDrafts.length > 0) {
        setDrafts(unsyncedDrafts);
        setShowDialog(true);
      }
    };

    // Check after a short delay to allow session to load
    const timer = setTimeout(checkDrafts, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  const handleRestore = async () => {
    setSyncing(true);
    setProgress({ current: 0, total: drafts.length });

    const result = await syncAllDrafts(userId, (synced, total) => {
      setProgress({ current: synced, total });
    });

    setSyncing(false);
    setShowDialog(false);

    if (result.failed > 0) {
      logger.warn(`Failed to sync ${result.failed} drafts:`, result.errors);
      // Could show a toast notification here
    }
  };

  const handleDismiss = () => {
    setShowDialog(false);
    setDrafts([]);
  };

  if (!showDialog || drafts.length === 0) {
    return null;
  }

  const draftSummary = drafts.reduce(
    (acc, draft) => {
      acc[draft.entityType] = (acc[draft.entityType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const summaryText = Object.entries(draftSummary)
    .map(([type, count]) => `${count} ${type}`)
    .join(', ');

  return (
    <ConfirmDialog
      isOpen={showDialog}
      title="Restore Unsaved Drafts?"
      message={`You have ${drafts.length} unsaved draft${drafts.length > 1 ? 's' : ''} (${summaryText}). Would you like to restore them?`}
      confirmLabel={syncing ? `Syncing... (${progress.current}/${progress.total})` : 'Restore All'}
      cancelLabel="Dismiss"
      onConfirm={handleRestore}
      onCancel={handleDismiss}
      variant="info"
    />
  );
}
