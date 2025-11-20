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

interface ScheduledBackupConfigProps {
  settings: BackupSettings | null;
  onSettingsChange?: () => void;
}

export function ScheduledBackupConfig({ settings, onSettingsChange }: ScheduledBackupConfigProps) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [enabled, setEnabled] = useState(settings?.scheduledBackupEnabled || false);
  const [intervalHours, setIntervalHours] = useState(settings?.scheduledBackupInterval || 24);
  const [autoUploadToDrive, setAutoUploadToDrive] = useState(settings?.autoUploadToDrive || false);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotification();

  const intervalOptions = [
    { value: 24, label: 'Daily (24 hours)' },
    { value: 168, label: 'Weekly (7 days)' },
    { value: 720, label: 'Monthly (30 days)' },
    { value: 0, label: 'Custom' },
  ];

  const handleSave = async () => {
    setSaving(true);
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
      showError('Failed to save scheduled backup settings');
    } finally {
      setSaving(false);
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

    setSaving(true);
    try {
      const res = await fetch('/api/backup/schedule', {
        method: 'DELETE',
      });

      if (res.ok) {
        setEnabled(false);
        showSuccess('Scheduled backups disabled');
        onSettingsChange?.();
      } else {
        const data = await res.json();
        showError(data.error || 'Failed to disable scheduled backups');
      }
    } catch (error: any) {
      showError('Failed to disable scheduled backups');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Icon icon={Clock} size="lg" className="text-[#29E7CD]" />
          <div>
            <h2 className="text-xl font-semibold">Scheduled Backups</h2>
            <p className="text-sm text-gray-400">
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
              className="h-5 w-5 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
            />
            <span className="text-sm text-gray-300">Enable scheduled backups</span>
          </label>

          {enabled && (
            <>
              {/* Backup Interval */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
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
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
                    className="mt-2 w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                  />
                )}
              </div>

              {/* Auto Upload to Drive */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoUploadToDrive}
                  onChange={e => setAutoUploadToDrive(e.target.checked)}
                  className="h-5 w-5 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                />
                <span className="text-sm text-gray-300">Automatically upload to Google Drive</span>
              </label>

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                >
                  <Icon icon={Save} size="sm" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                <button
                  onClick={handleDisable}
                  disabled={saving}
                  className="rounded-2xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40 disabled:opacity-50"
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
