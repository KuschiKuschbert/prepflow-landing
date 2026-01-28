/**
 * Backup Settings Page
 * Main page for backup and restore configuration.
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import type { BackupFile, BackupSettings } from '@/lib/backup/types';
import { logger } from '@/lib/logger';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BackupList } from './components/BackupList';
import { GoogleDriveConnection } from './components/GoogleDriveConnection';
import { ManualBackupControls } from './components/ManualBackupControls';
import { RestoreDialog } from './components/RestoreDialog';
import { ScheduledBackupConfig } from './components/ScheduledBackupConfig';

export default function BackupSettingsPage() {
  const [settings, setSettings] = useState<BackupSettings | null>(null);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null);
  const { showSuccess: _showSuccess, showError } = useNotification();

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/backup/settings');
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      logger.error('[page.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to load backup settings');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const loadBackups = useCallback(async () => {
    try {
      const res = await fetch('/api/backup/list');
      const data = await res.json();
      if (res.ok && data.backups) {
        setBackups(data.backups);
      }
    } catch (error) {
      logger.error('[page.tsx] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to load backups');
    }
  }, [showError]);

  // Load settings and backups
  useEffect(() => {
    loadSettings();
    loadBackups();
  }, [loadSettings, loadBackups]);

  const handleRestore = (backup: BackupFile) => {
    setSelectedBackup(backup);
    setRestoreDialogOpen(true);
  };

  const handleRestoreComplete = () => {
    setRestoreDialogOpen(false);
    setSelectedBackup(null);
    loadBackups(); // Refresh backup list
  };

  if (loading) {
    return (
      <div className="large-desktop:max-w-[1400px] mx-auto max-w-[1400px] p-6 text-[var(--foreground)] xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-[var(--muted)]"></div>
          <div className="h-32 rounded bg-[var(--muted)]"></div>
          <div className="h-32 rounded bg-[var(--muted)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="large-desktop:max-w-[1400px] mx-auto max-w-[1400px] p-6 text-[var(--foreground)] xl:max-w-[1400px] 2xl:max-w-[1600px]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/webapp/settings"
          className="flex items-center gap-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
        >
          <Icon icon={ArrowLeft} size="sm" />
          <span>Back to Settings</span>
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold">Backup & Restore</h1>
      <p className="mb-8 text-[var(--foreground-muted)]">
        Backup your data to Google Drive or download encrypted backup files. Restore from backups
        with full, selective, or merge options.
      </p>

      {/* Google Drive Connection */}
      <div className="mb-6">
        <GoogleDriveConnection
          connected={settings?.googleDriveConnected || false}
          onConnectionChange={loadSettings}
        />
      </div>

      {/* Scheduled Backup Configuration */}
      <div className="mb-6">
        <ScheduledBackupConfig settings={settings} onSettingsChange={loadSettings} />
      </div>

      {/* Manual Backup Controls */}
      <div className="mb-6">
        <ManualBackupControls onBackupCreated={loadBackups} />
      </div>

      {/* Backup List */}
      <div className="mb-6">
        <BackupList backups={backups} onRestore={handleRestore} onRefresh={loadBackups} />
      </div>

      {/* Restore Dialog */}
      {restoreDialogOpen && selectedBackup && (
        <RestoreDialog
          backup={selectedBackup}
          open={restoreDialogOpen}
          onClose={() => {
            setRestoreDialogOpen(false);
            setSelectedBackup(null);
          }}
          onRestoreComplete={handleRestoreComplete}
        />
      )}
    </div>
  );
}
