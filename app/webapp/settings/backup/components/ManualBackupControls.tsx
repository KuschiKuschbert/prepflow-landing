/**
 * Manual Backup Controls Component
 * Create manual backups in various formats.
 */

'use client';

import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Icon } from '@/components/ui/Icon';
import { Download, CloudUpload, Lock, FileText } from 'lucide-react';
import type { BackupFormat, EncryptionMode } from '@/lib/backup/types';
import { logger } from '@/lib/logger';

interface ManualBackupControlsProps {
  onBackupCreated?: () => void;
}

export function ManualBackupControls({ onBackupCreated }: ManualBackupControlsProps) {
  const [format, setFormat] = useState<BackupFormat>('encrypted');
  const [encryptionMode, setEncryptionMode] = useState<EncryptionMode>('prepflow-only');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleCreateBackup = async () => {
    if (format === 'encrypted' && encryptionMode === 'user-password' && !password) {
      showError('Password is required for user-password encryption mode');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          encryptionMode: format === 'encrypted' ? encryptionMode : undefined,
          password:
            format === 'encrypted' && encryptionMode === 'user-password' ? password : undefined,
        }),
      });

      if (res.ok) {
        // Download the backup file
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          res.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') ||
          'backup';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showSuccess('Backup created and downloaded successfully');
        setPassword(''); // Clear password
        onBackupCreated?.();
      } else {
        const data = await res.json();
        showError(data.error || 'Failed to create backup');
      }
    } catch (error: any) {
      logger.error('[ManualBackupControls.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  const handleUploadToDrive = async () => {
    if (format === 'encrypted' && encryptionMode === 'user-password' && !password) {
      showError('Password is required for user-password encryption mode');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/backup/upload-to-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptionMode: format === 'encrypted' ? encryptionMode : undefined,
          password:
            format === 'encrypted' && encryptionMode === 'user-password' ? password : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess('Backup uploaded to Google Drive successfully');
        setPassword(''); // Clear password
        onBackupCreated?.();
      } else {
        showError(data.error || 'Failed to upload backup to Google Drive');
      }
    } catch (error: any) {
      logger.error('[ManualBackupControls.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to upload backup to Google Drive');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon icon={Download} size="lg" className="text-[var(--primary)]" />
        <div>
          <h2 className="text-xl font-semibold">Manual Backup</h2>
          <p className="text-sm text-[var(--foreground-muted)]">Create a backup of your data now</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Backup Format</label>
          <div className="grid grid-cols-3 gap-3">
            {(['json', 'sql', 'encrypted'] as BackupFormat[]).map(fmt => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`rounded-2xl border p-3 text-sm transition-colors ${
                  format === fmt
                    ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--muted)]/20 text-[var(--foreground-secondary)] hover:border-[var(--border)]/50'
                }`}
              >
                {fmt === 'json' && <Icon icon={FileText} size="sm" className="mx-auto mb-1" />}
                {fmt === 'sql' && <Icon icon={FileText} size="sm" className="mx-auto mb-1" />}
                {fmt === 'encrypted' && <Icon icon={Lock} size="sm" className="mx-auto mb-1" />}
                <div className="font-medium capitalize">{fmt}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Encryption Mode (for encrypted format) */}
        {format === 'encrypted' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Encryption Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setEncryptionMode('prepflow-only');
                  setPassword('');
                }}
                className={`rounded-2xl border p-3 text-sm transition-colors ${
                  encryptionMode === 'prepflow-only'
                    ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--muted)]/20 text-[var(--foreground-secondary)] hover:border-[var(--border)]/50'
                }`}
              >
                <div className="font-medium">PrepFlow-Only</div>
                <div className="mt-1 text-xs text-[var(--foreground-muted)]">Convenient, locked to PrepFlow</div>
              </button>
              <button
                onClick={() => setEncryptionMode('user-password')}
                className={`rounded-2xl border p-3 text-sm transition-colors ${
                  encryptionMode === 'user-password'
                    ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--muted)]/20 text-[var(--foreground-secondary)] hover:border-[var(--border)]/50'
                }`}
              >
                <div className="font-medium">Password-Protected</div>
                <div className="mt-1 text-xs text-[var(--foreground-muted)]">Portable, works anywhere</div>
              </button>
            </div>
          </div>
        )}

        {/* Password Input (for user-password mode) */}
        {format === 'encrypted' && encryptionMode === 'user-password' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter backup password"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            />
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Remember this password - you&apos;ll need it to restore this backup
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCreateBackup}
            disabled={creating || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-3 font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg disabled:opacity-50"
          >
            <Icon icon={Download} size="sm" />
            {creating ? 'Creating...' : 'Create & Download Backup'}
          </button>
          <button
            onClick={handleUploadToDrive}
            disabled={creating || uploading}
            className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 px-4 py-3 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40 disabled:opacity-50"
          >
            <Icon icon={CloudUpload} size="sm" />
            {uploading ? 'Uploading...' : 'Upload to Drive'}
          </button>
        </div>
      </div>
    </div>
  );
}
