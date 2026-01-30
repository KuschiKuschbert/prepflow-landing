import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { CheckCircle, Cloud, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GoogleDriveConnectionProps {
  connected: boolean;
  onConnectionChange: () => Promise<void>;
}

export function GoogleDriveConnection({
  connected,
  onConnectionChange,
}: GoogleDriveConnectionProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  const handleConnect = async () => {
    setLoading(true);
    try {
      // 1. Get auth URL from backend
      const res = await fetch('/api/backup/google-auth', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to initiate connection');
      }

      // 2. Redirect to Google
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL returned');
      }
    } catch (error: unknown) {
      logger.error('[GoogleDriveConnection] Connect error:', error);
      showError(error instanceof Error ? error.message : 'Failed to connect to Google Drive');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Drive?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/backup/google-auth', {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to disconnect');
      }

      showSuccess('Google Drive disconnected');
      await onConnectionChange(); // Refresh settings/state
    } catch (error: unknown) {
      logger.error('[GoogleDriveConnection] Disconnect error:', error);
      showError(error instanceof Error ? error.message : 'Failed to disconnect Google Drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`rounded-xl p-3 ${connected ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--muted)] text-[var(--foreground-muted)]'}`}
          >
            <Icon icon={Cloud} size="lg" />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
              Google Drive
              {connected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-success)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-success)]">
                  <Icon icon={CheckCircle} size="xs" />
                  Connected
                </span>
              )}
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              {connected
                ? 'Your backups can be automatically uploaded to your Google Drive.'
                : 'Connect your Google Drive to enable automatic cloud backups.'}
            </p>
          </div>
        </div>

        <div>
          {connected ? (
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/20 disabled:opacity-50"
            >
              {loading ? (
                <Icon icon={Loader2} className="animate-spin" size="sm" />
              ) : (
                <Icon icon={LogOut} size="sm" />
              )}
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-[var(--primary)]/20 shadow-lg transition-colors hover:bg-[var(--primary)]/90 disabled:opacity-50"
            >
              {loading ? (
                <Icon icon={Loader2} className="animate-spin" size="sm" />
              ) : (
                <Icon icon={Cloud} size="sm" />
              )}
              Connect Drive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
