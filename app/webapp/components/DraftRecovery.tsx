'use client';

import React, { useState, useEffect } from 'react';
import { getAllDrafts, DraftMetadata } from '@/lib/autosave-storage';
import { syncAllDrafts } from '@/lib/autosave-sync';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSession } from 'next-auth/react';

export function DraftRecovery() {
  const { data: session } = useSession();
  const userId = session?.user?.email || null;
  const [drafts, setDrafts] = useState<DraftMetadata[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    // Check for unsynced drafts on mount
    const checkDrafts = () => {
      const allDrafts = getAllDrafts(userId);
      // Filter drafts older than 1 minute (assuming they're unsynced)
      const unsyncedDrafts = allDrafts.filter(draft => {
        const age = Date.now() - draft.timestamp;
        return age > 60000; // Older than 1 minute
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
      console.warn(`Failed to sync ${result.failed} drafts:`, result.errors);
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
