/**
 * Restore Dialog Component
 * Restore from backup with full, selective, or merge options.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Icon } from '@/components/ui/Icon';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';
import type { BackupFile, RestoreMode, MergeOptions } from '@/lib/backup/types';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { logger } from '@/lib/logger';

interface RestoreDialogProps {
  backup: BackupFile;
  open: boolean;
  onClose: () => void;
  onRestoreComplete: () => void;
}

export function RestoreDialog({ backup, open, onClose, onRestoreComplete }: RestoreDialogProps) {
  const [mode, setMode] = useState<RestoreMode>('full');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [backupFile, setBackupFile] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showSuccess, showError } = useNotification();

  const loadBackupFile = useCallback(async () => {
    try {
      if (backup.googleDriveFileId) {
        const res = await fetch(`/api/backup/drive/download/${backup.googleDriveFileId}`);
        const data = await res.json();

        if (res.ok && data.backupFile) {
          setBackupFile(data.backupFile);
        } else {
          showError('Failed to load backup file');
        }
      } else {
        // TODO: Load from local storage by ID
        showError('Loading backup from local storage not yet implemented');
      }
    } catch (error) {
      logger.error('[RestoreDialog.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to load backup file');
    }
  }, [backup, showError]);

  // Load backup file when dialog opens
  useEffect(() => {
    if (open && backup) {
      loadBackupFile();
    }
  }, [open, backup, loadBackupFile]);

  const handleRestore = async () => {
    if (!backupFile) {
      showError('Backup file not loaded');
      return;
    }

    if (mode === 'selective' && selectedTables.length === 0) {
      showError('Please select at least one table to restore');
      return;
    }

    if (backup.encryptionMode === 'user-password' && !password) {
      showError('Password is required for password-protected backups');
      return;
    }

    try {
      const mergeOptions: MergeOptions | undefined =
        mode === 'merge'
          ? {
              conflictResolution: 'skip',
              skipExisting: true,
              updateExisting: false,
              createNewIds: false,
            }
          : undefined;

      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backupFile,
          mode,
          tables: mode === 'selective' ? selectedTables : undefined,
          options: mergeOptions,
          password: backup.encryptionMode === 'user-password' ? password : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(`Restore completed: ${data.result.tablesRestored.length} table(s) restored`);
        onRestoreComplete();
        onClose();
      } else {
        showError(data.error || 'Failed to restore backup');
      }
    } catch (error: any) {
      logger.error('[RestoreDialog.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to restore backup');
    } finally {
      setShowConfirm(false);
    }
  };

  const availableTables = [
    'order_lists',
    'order_list_items',
    'prep_lists',
    'prep_list_items',
    'recipe_shares',
    'ai_specials_ingredients',
  ];

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]">
          <div className="rounded-3xl bg-[var(--surface)]/95 p-6 text-[var(--button-active-text)]">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon={RotateCcw} size="lg" className="text-[var(--primary)]" />
                <div>
                  <h2 className="text-2xl font-bold">Restore from Backup</h2>
                  <p className="text-sm text-[var(--foreground-muted)]">{backup.filename}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <Icon icon={X} size="sm" />
              </button>
            </div>

            {/* Warning */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 p-4">
              <Icon icon={AlertTriangle} size="sm" className="mt-0.5 text-[var(--color-warning)]" />
              <div className="flex-1 text-sm text-yellow-200">
                <p className="font-medium">Warning: Restore will modify your data</p>
                <p className="mt-1 text-yellow-300/80">
                  {mode === 'full' &&
                    'This will replace all your current data with the backup data.'}
                  {mode === 'selective' &&
                    'This will replace data in selected tables with backup data.'}
                  {mode === 'merge' &&
                    'This will add backup data to your existing data, skipping conflicts.'}
                </p>
              </div>
            </div>

            {/* Restore Mode Selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-[var(--foreground-secondary)]">
                Restore Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['full', 'selective', 'merge'] as RestoreMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      if (m !== 'selective') {
                        setSelectedTables([]);
                      }
                    }}
                    className={`rounded-2xl border p-3 text-sm transition-colors ${
                      mode === m
                        ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'border-[var(--border)] bg-[var(--muted)]/20 text-[var(--foreground-secondary)] hover:border-[var(--border)]/50'
                    }`}
                  >
                    <div className="font-medium capitalize">{m}</div>
                    <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                      {m === 'full' && 'Replace all data'}
                      {m === 'selective' && 'Restore selected tables'}
                      {m === 'merge' && 'Add to existing data'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Table Selection (for selective mode) */}
            {mode === 'selective' && (
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-[var(--foreground-secondary)]">
                  Select Tables
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTables.map(table => (
                    <label
                      key={table}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-3 transition-colors hover:bg-[var(--muted)]/30"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(table)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedTables([...selectedTables, table]);
                          } else {
                            setSelectedTables(selectedTables.filter(t => t !== table));
                          }
                        }}
                        className="h-4 w-4 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-[var(--foreground-secondary)]">{table}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Password Input (for password-protected backups) */}
            {backup.encryptionMode === 'user-password' && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                  Backup Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter backup password"
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl border border-[var(--border)] px-4 py-2 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!backupFile || (mode === 'selective' && selectedTables.length === 0)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg disabled:opacity-50"
              >
                <Icon icon={RotateCcw} size="sm" />
                Restore Backup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleRestore}
        title="Confirm Restore"
        message={`Are you sure you want to restore from this backup? This action ${mode === 'full' ? 'will replace all your current data' : mode === 'selective' ? 'will replace data in selected tables' : 'will add backup data to your existing data'}.`}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}
