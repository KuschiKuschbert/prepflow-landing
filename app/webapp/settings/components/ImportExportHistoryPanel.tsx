'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Download, Upload, Database, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ImportExportLog {
  id: string;
  operation_type: 'export' | 'import' | 'backup' | 'restore';
  format: string | null;
  source: string | null;
  records_count: number | null;
  file_size_bytes: number | null;
  created_at: string;
}

/**
 * Import/export history panel component for settings page.
 * Displays history of data import/export operations.
 *
 * @component
 * @returns {JSX.Element} Import/export history panel
 */
export function ImportExportHistoryPanel() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ImportExportLog[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/user/import-export-history?limit=10');
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history || []);
        }
      } catch (error) {
        logger.error('Failed to load import/export history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'export':
        return Download;
      case 'import':
        return Upload;
      case 'backup':
        return Database;
      case 'restore':
        return RotateCcw;
      default:
        return Database;
    }
  };

  const getOperationLabel = (type: string) => {
    switch (type) {
      case 'export':
        return 'Data Export';
      case 'import':
        return 'Data Import';
      case 'backup':
        return 'Backup Created';
      case 'restore':
        return 'Data Restored';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-[#2a2a2a]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#2a2a2a]" />
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Import/Export History</h2>
        <p className="mt-1 text-sm text-gray-300">
          Track your data import, export, backup, and restore operations.
        </p>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-400">
          No import/export history found. History will be tracked after database migration is
          applied.
        </p>
      ) : (
        <div className="space-y-2">
          {history.map(log => {
            const IconComponent = getOperationIcon(log.operation_type);
            return (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    icon={IconComponent}
                    size="md"
                    className="text-[#29E7CD]"
                    aria-hidden={true}
                  />
                  <div>
                    <p className="font-medium text-white">
                      {getOperationLabel(log.operation_type)}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
                      {log.format && <span>Format: {log.format.toUpperCase()}</span>}
                      {log.records_count !== null && (
                        <span>{log.records_count.toLocaleString()} records</span>
                      )}
                      {log.file_size_bytes !== null && (
                        <span>{formatFileSize(log.file_size_bytes)}</span>
                      )}
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




