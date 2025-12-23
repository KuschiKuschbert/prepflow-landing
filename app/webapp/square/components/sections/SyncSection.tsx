'use client';

import { useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { RefreshCw, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import { useSquareStatus } from '../../hooks/useSquareStatus';

type SyncOperation = 'catalog' | 'orders' | 'staff' | 'costs' | 'initial_sync';
type SyncDirection = 'from_square' | 'to_square' | 'bidirectional';

export function SyncSection() {
  const { showSuccess, showError } = useNotification();
  const { refresh: refreshStatus } = useSquareStatus();
  const [syncing, setSyncing] = useState<Set<SyncOperation>>(new Set());
  const [lastResults, setLastResults] = useState<Record<string, any>>({});

  const handleSync = useCallback(async (operation: SyncOperation, direction?: SyncDirection) => {
    try {
      setSyncing(prev => new Set(prev).add(operation));

      const response = await fetch('/api/square/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          direction: direction || (operation === 'orders' ? 'from_square' : 'bidirectional'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      setLastResults(prev => ({
        ...prev,
        [operation]: data,
      }));

      showSuccess(`${operation} sync completed: ${data.message}`);
      // Refresh status to update recent syncs
      refreshStatus();
    } catch (error) {
      logger.error('[Square Sync] Error:', {
        error: error instanceof Error ? error.message : String(error),
        operation,
      });
      showError(`Failed to sync ${operation}`);
    } finally {
      setSyncing(prev => {
        const next = new Set(prev);
        next.delete(operation);
        return next;
      });
    }
  }, [showSuccess, showError, refreshStatus]);

  const SyncButton = ({
    operation,
    direction,
    label,
  }: {
    operation: SyncOperation;
    direction?: SyncDirection;
    label: string;
  }) => {
    const isSyncing = syncing.has(operation);
    const result = lastResults[operation];

    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--foreground)]">{label}</p>
            {result && (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {result.success ? (
                  <span className="text-green-400">
                    Synced {result.details?.syncedCount || 0} items
                  </span>
                ) : (
                  <span className="text-red-400">Sync failed</span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={() => handleSync(operation, direction)}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)] disabled:opacity-50"
          >
            {isSyncing ? (
              <Icon icon={Loader2} size="sm" className="animate-spin" />
            ) : (
              <Icon icon={RefreshCw} size="sm" />
            )}
            {isSyncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Manual Sync</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Manually trigger synchronization between Square POS and PrepFlow
        </p>
      </div>

      <div className="space-y-4">
        <SyncButton operation="initial_sync" label="Initial Sync (All Data)" />
        <SyncButton operation="catalog" direction="bidirectional" label="Sync Catalog (Menu Items)" />
        <SyncButton operation="orders" direction="from_square" label="Sync Orders (Sales Data)" />
        <SyncButton operation="staff" direction="bidirectional" label="Sync Staff (Employees)" />
        <SyncButton operation="costs" direction="to_square" label="Sync Food Costs" />
      </div>

      {/* Sync Results Summary */}
      {Object.keys(lastResults).length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Last Sync Results</h3>
          <div className="space-y-2">
            {Object.entries(lastResults).map(([operation, result]) => (
              <div
                key={operation}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <span className="text-sm font-medium text-[var(--foreground)] capitalize">
                  {operation.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <Icon icon={CheckCircle2} size="sm" className="text-green-400" />
                      <span className="text-sm text-green-400">
                        {result.details?.syncedCount || 0} items
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon icon={XCircle} size="sm" className="text-red-400" />
                      <span className="text-sm text-red-400">Failed</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
