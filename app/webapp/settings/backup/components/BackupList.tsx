/**
 * Backup List Component
 * Display list of available backups with download and restore options.
 */

'use client';

import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Icon } from '@/components/ui/Icon';
import { History, Download, RotateCcw, RefreshCw, Trash2 } from 'lucide-react';
import type { BackupFile } from '@/lib/backup/types';
import { formatDistanceToNow } from 'date-fns';

interface BackupListProps {
  backups: BackupFile[];
  onRestore: (backup: BackupFile) => void;
  onRefresh: () => void;
}

export function BackupList({ backups, onRestore, onRefresh }: BackupListProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (backup: BackupFile) => {
    setDownloading(backup.id);
    try {
      // If backup is in Google Drive, download from Drive
      if (backup.googleDriveFileId) {
        const res = await fetch(`/api/backup/drive/download/${backup.googleDriveFileId}`);
        const data = await res.json();

        if (res.ok && data.backupFile) {
          // Convert base64 to blob and download
          const binaryString = atob(data.backupFile);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = backup.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          showSuccess('Backup downloaded successfully');
        } else {
          showError(data.error || 'Failed to download backup');
        }
      } else {
        // TODO: Download from local storage by ID
        showError('Download from local storage not yet implemented');
      }
    } catch (error: any) {
      showError('Failed to download backup');
    } finally {
      setDownloading(null);
    }
  };

  if (backups.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Icon icon={History} size="lg" className="text-[#29E7CD]" />
          <div>
            <h2 className="text-xl font-semibold">Backup History</h2>
            <p className="text-sm text-gray-400">Your backup files will appear here</p>
          </div>
        </div>
        <div className="py-8 text-center text-gray-400">
          <p>No backups yet. Create your first backup to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon={History} size="lg" className="text-[#29E7CD]" />
          <div>
            <h2 className="text-xl font-semibold">Backup History</h2>
            <p className="text-sm text-gray-400">{backups.length} backup(s) available</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/20 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40"
        >
          <Icon icon={RefreshCw} size="sm" />
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {backups.map(backup => (
          <div
            key={backup.id}
            className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/30"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{backup.filename}</span>
                {backup.encryptionMode && (
                  <span className="rounded-full bg-[#29E7CD]/10 px-2 py-0.5 text-xs text-[#29E7CD]">
                    {backup.encryptionMode === 'user-password' ? 'Password' : 'PrepFlow'}
                  </span>
                )}
                {backup.googleDriveFileId && (
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                    Google Drive
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                <span>{formatFileSize(backup.size)}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true })}</span>
                <span>•</span>
                <span className="capitalize">{backup.format}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(backup)}
                disabled={downloading === backup.id}
                className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40 disabled:opacity-50"
                title="Download backup"
              >
                <Icon icon={Download} size="sm" />
                {downloading === backup.id ? 'Downloading...' : 'Download'}
              </button>
              <button
                onClick={() => onRestore(backup)}
                className="flex items-center gap-2 rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-2 text-sm text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
                title="Restore from backup"
              >
                <Icon icon={RotateCcw} size="sm" />
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




