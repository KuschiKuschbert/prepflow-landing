/**
 * Google Drive Connection Component
 * Manages Google Drive OAuth connection and disconnection.
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { CheckCircle2, Cloud } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GoogleDriveConnectionProps {
  onConnectionChange?: () => void;
}

export function GoogleDriveConnection({ onConnectionChange }: GoogleDriveConnectionProps) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null); // null = checking, true = configured, false = not configured
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Try to list backups - if it works, we're connected
      const res = await fetch('/api/backup/drive/list');
      const data = await res.json();

      // Check if it's a "not configured" or "not connected" message
      if (res.ok && data.message) {
        if (data.message.includes('not configured')) {
          setConnected(false);
          setIsConfigured(false);
          return; // Don't show error for missing config
        }
        if (data.message.includes('not connected')) {
          setConnected(false);
          setIsConfigured(true); // Configured but not connected
          return; // Normal state - not connected
        }
      }

      if (res.ok && !data.message) {
        setConnected(true);
        setIsConfigured(true);
      } else {
        setConnected(false);
        setIsConfigured(true); // Assume configured if we got a different error
      }
    } catch (error) {
      setConnected(false);
      setIsConfigured(null); // Unknown state
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backup/google-auth', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
        // Don't set loading to false - we're redirecting
        return;
      } else {
        // Check if it's a configuration error (400 status)
        if (res.status === 400 || data.message?.includes('not configured')) {
          showError(
            'Google Drive is not configured. To enable Google Drive backups, add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your environment variables. You can still create and download backups without Google Drive.',
          );
        } else {
          showError(data.error || data.message || 'Failed to initiate Google Drive connection');
        }
        setLoading(false);
      }
    } catch (error: any) {
      showError('Failed to connect to Google Drive. Please check your configuration.');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = await showConfirm({
      title: 'Disconnect Google Drive?',
      message:
        "Disconnect Google Drive? You'll need to reconnect if you want to upload backups later. Still want to disconnect?",
      variant: 'warning',
      confirmLabel: 'Disconnect',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/backup/google-auth', { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setConnected(false);
        showSuccess('Google Drive disconnected successfully');
        onConnectionChange?.();
      } else {
        showError(data.error || 'Failed to disconnect Google Drive');
      }
    } catch (error: any) {
      showError('Failed to disconnect Google Drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={Cloud} size="lg" className="text-[#29E7CD]" />
            <div>
              <h2 className="text-xl font-semibold">Google Drive</h2>
              <p className="text-sm text-gray-400">
                {connected
                  ? 'Connected - Backups can be uploaded automatically'
                  : isConfigured === false
                    ? 'Not configured - Optional feature. You can still create backups without Google Drive.'
                    : 'Not connected - Optional feature for cloud backup storage'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {connected ? (
              <>
                <Icon icon={CheckCircle2} size="sm" className="text-green-400" />
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                >
                  {loading ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading || isConfigured === false}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                  isConfigured === false
                    ? 'cursor-not-allowed border border-gray-500/30 bg-gray-500/10 text-gray-400'
                    : 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white hover:shadow-lg'
                }`}
                title={
                  isConfigured === false
                    ? 'Google Drive is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable.'
                    : undefined
                }
              >
                {loading
                  ? 'Connecting...'
                  : isConfigured === false
                    ? 'Not Configured'
                    : 'Connect Google Drive'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
