'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AlertCircle, CheckCircle2, History, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useSquareStatus, type SyncLog } from '../../hooks/useSquareStatus';

// Local interface kept for clarity or updated to match hook one
interface HistorySyncLog {
  id: string;
  operation_type: string;
  direction: string;
  entity_type?: string;
  status: string;
  error_message?: string;
  created_at: string;
}

export function HistorySection() {
  const { status, loading, error } = useSquareStatus();

  // Memoize logs to prevent unnecessary re-renders
  const logs = useMemo(() => {
    if (!status?.recentSyncs) return [];
    return status.recentSyncs.map((log: SyncLog) => ({
      id: log.id || String(Date.now()),
      operation_type: log.operation_type || 'unknown',
      direction: log.direction || 'unknown',
      entity_type: log.entity_type || undefined,
      status: log.status || 'unknown',
      error_message: log.error_message || undefined,
      created_at: log.created_at || new Date().toISOString(),
    })) as HistorySyncLog[];
  }, [status]);

  if (loading) {
    return <LoadingSkeleton variant="table" className="h-64" />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <Icon
          icon={AlertCircle}
          size="lg"
          className="mx-auto mb-4 text-[var(--foreground-muted)]"
        />
        <p className="text-[var(--foreground-muted)]">{error}</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Icon icon={CheckCircle2} size="sm" className="text-green-400" />;
      case 'error':
        return <Icon icon={XCircle} size="sm" className="text-red-400" />;
      default:
        return <Icon icon={AlertCircle} size="sm" className="text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Sync History</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          View sync operation history and error logs
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <Icon icon={History} size="lg" className="mx-auto mb-4 text-[var(--foreground-muted)]" />
          <p className="text-[var(--foreground-muted)]">No sync history found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--border)]/50 to-[var(--border)]/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
                  Operation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
                  Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {logs.map((log: HistorySyncLog) => (
                <tr key={log.id} className="transition-colors hover:bg-[var(--border)]/20">
                  <td className="px-6 py-4 text-sm text-[var(--foreground)] capitalize">
                    {log.operation_type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)] capitalize">
                    {log.direction.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="text-sm text-[var(--foreground-muted)] capitalize">
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-400">{log.error_message || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
