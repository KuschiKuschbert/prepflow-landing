'use client';

import Link from 'next/link';
import { ImportExportHistoryPanel } from '../ImportExportHistoryPanel';

/**
 * Data & Backup section component.
 * Combines backup/restore settings and import/export history.
 *
 * @component
 * @returns {JSX.Element} Data & Backup section
 */
export function DataBackupSection() {
  return (
    <div className="space-y-6">
      {/* Backup & Restore */}
      <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
        <h2 className="text-xl font-semibold">Backup & Restore</h2>
        <p className="text-[var(--foreground-secondary)]">
          Backup your data to Google Drive or download encrypted backup files. Restore from backups
          with full, selective, or merge options.
        </p>
        <Link
          href="/webapp/settings/backup"
          className="inline-block rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg"
        >
          Manage Backups
        </Link>
      </div>

      <ImportExportHistoryPanel />
    </div>
  );
}



