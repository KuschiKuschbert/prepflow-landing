/**
 * Scheduled Backup Configuration Component
 * Configure automatic backup intervals and settings.
 */

'use client';

import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { BackupSettings } from '@/lib/backup/types';
import { Icon } from '@/components/ui/Icon';
import { Clock, Save } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

interface ScheduledBackupConfigProps {
  settings: BackupSettings | null;
  onSettingsChange?: () => void;
}

export function ScheduledBackupConfig({ settings, onSettingsChange }: ScheduledBackupConfigProps) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [enabled, setEnabled] = useState(settings?.scheduledBackupEnabled || false);
  const [intervalHours, setIntervalHours] = useState(settings?.scheduledBackupInterval || 24);
  const [autoUploadToDrive, setAutoUploadToDrive] = useState(settings?.autoUploadToDrive || false);
  const { showSuccess, showError } = useNotification();

  const intervalOptions = [
    { value: 24, label: 'Daily (24 hours)' },
    { value: 168, label: 'Weekly (7 days)' },
    { value: 720, label: 'Monthly (30 days)' },
    { value: 0, label: 'Custom' },
  ];

  const handleSave = async () => {
    try {
      const res = await fetch('/api/backup/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intervalHours: intervalHours || 24,
          enabled,
          autoUploadToDrive,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess('Scheduled backup settings saved');
        onSettingsChange?.();
      } else {
        showError(data.error || 'Failed to save settings');
      }
    } catch (error: any) {
      logger.error('[ScheduledBackupConfig.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to save scheduled backup settings');
    }
  };

  const handleDisable = async () => {
    const confirmed = await showConfirm({
      title: 'Disable Scheduled Backups?',
      message:
        "Disable scheduled backups? Your data won't auto-save to the cloud anymore. Continue?",
      variant: 'warning',
      confirmLabel: 'Disable',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    // Store original state for rollback
    const originalEnabled = enabled;

    // Optimistically disable immediately
    setEnabled(false);

    try {
      const res = await fetch('/api/backup/schedule', {
        method: 'DELETE',
      });

      if (res.ok) {
        showSuccess('Scheduled backups disabled');
        onSettingsChange?.();
      } else {
        // Rollback on error
        setEnabled(originalEnabled);
        const data = await res.json();
        showError(data.error || 'Failed to disable scheduled backups');
      }
    } catch (error: any) {
      // Rollback on error
      setEnabled(originalEnabled);
      logger.error('[ScheduledBackupConfig.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to disable scheduled backups');
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Icon icon={Clock} size="lg" className="text-[var(--primary)]" />
          <div>
            <h2 className="text-xl font-semibold">Scheduled Backups</h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              Automatically backup your data at regular intervals
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
            />
            <span className="text-sm text-[var(--foreground-secondary)]">
              Enable scheduled backups
            </span>
          </label>

          {enabled && (
            <>
              {/* Backup Interval */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                  Backup Interval
                </label>
                <select
                  value={
                    intervalOptions.find(opt => opt.value === intervalHours) ? intervalHours : 0
                  }
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    if (value > 0) {
                      setIntervalHours(value);
                    }
                  }}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {intervalOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {intervalHours === 0 && (
                  <input
                    type="number"
                    min="1"
                    max="8760"
                    value={intervalHours || ''}
                    onChange={e => setIntervalHours(parseInt(e.target.value, 10) || 24)}
                    placeholder="Hours (1-8760)"
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                  />
                )}
              </div>

              {/* Auto Upload to Drive */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoUploadToDrive}
                  onChange={e => setAutoUploadToDrive(e.target.checked)}
                  className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--foreground-secondary)]">
                  Automatically upload to Google Drive
                </span>
              </label>

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg"
                >
                  <Icon icon={Save} size="sm" />
                  Save Settings
                </button>
                <button
                  onClick={handleDisable}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40"
                >
                  Disable
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
