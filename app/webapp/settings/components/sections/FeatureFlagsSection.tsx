'use client';
import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { Icon } from '@/components/ui/Icon';
import { Loader2, RefreshCw, AlertCircle, Power } from 'lucide-react';

interface FeatureFlag {
  id: string;
  flag_key: string;
  enabled: boolean;
  user_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function FeatureFlagsSection() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/features');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feature flags');
      }

      setFlags(data.flags || []);
    } catch (error) {
      logger.error('[Feature Flags] Error fetching flags:', {
        error: error instanceof Error ? error.message : String(error),
      });
      showError('Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchFlags is stable and only needed on mount

  const toggleFlag = async (flagKey: string, currentEnabled: boolean, userId: string | null) => {
    // Store original state for rollback
    const originalFlags = [...flags];

    // Optimistically update UI immediately
    setFlags(prevFlags =>
      prevFlags.map(flag =>
        flag.flag_key === flagKey && flag.user_id === userId
          ? { ...flag, enabled: !currentEnabled }
          : flag,
      ),
    );

    try {
      const response = await fetch(`/api/admin/features/${flagKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentEnabled, user_id: userId || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update feature flag');
      showSuccess(`Feature flag "${flagKey}" ${!currentEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      // Rollback on error
      setFlags(originalFlags);
      logger.error('[Feature Flags] Error updating flag:', {
        error: error instanceof Error ? error.message : String(error),
        flagKey,
      });
      showError('Failed to update feature flag');
    }
  };

  const deleteFlag = async (flagKey: string, userId: string | null) => {
    const confirmed = await showConfirm({
      title: 'Delete Feature Flag',
      message: `Delete feature flag "${flagKey}"? This action can't be undone. Last chance to back out.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;

    // Store original state for rollback
    const originalFlags = [...flags];

    // Optimistically remove from UI immediately
    setFlags(prevFlags =>
      prevFlags.filter(flag => !(flag.flag_key === flagKey && flag.user_id === userId)),
    );

    try {
      const response = await fetch(`/api/admin/features/${flagKey}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId || null }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete feature flag');
      }
      showSuccess(`Feature flag "${flagKey}" deleted`);
    } catch (error) {
      // Rollback on error
      setFlags(originalFlags);
      logger.error('[Feature Flags] Error deleting flag:', {
        error: error instanceof Error ? error.message : String(error),
        flagKey,
      });
      showError('Failed to delete feature flag');
    }
  };

  // Group flags by flag_key (global + user-specific)
  const groupedFlags = flags.reduce(
    (acc, flag) => {
      if (!acc[flag.flag_key]) {
        acc[flag.flag_key] = [];
      }
      acc[flag.flag_key].push(flag);
      return acc;
    },
    {} as Record<string, FeatureFlag[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon icon={Loader2} size="lg" className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Feature Flags</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Manage feature flags for the application. Global flags apply to all users, while
          user-specific flags override global settings for individual users.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/admin/features/seed', { method: 'POST' });
              const data = await response.json();
              if (response.ok) {
                showSuccess('Feature flags seeded successfully');
                // Refresh flags in background (non-blocking)
                fetchFlags().catch(err => logger.error('Failed to refresh flags:', err));
              } else {
                showError(data.error || 'Failed to seed feature flags');
              }
            } catch (error) {
              logger.error('[Feature Flags] Error seeding flags:', {
                error: error instanceof Error ? error.message : String(error),
              });
              showError('Failed to seed feature flags');
            }
          }}
          className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
        >
          <Icon icon={RefreshCw} size="sm" />
          Seed Flags
        </button>
        <button
          onClick={fetchFlags}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)] disabled:opacity-50"
        >
          <Icon icon={RefreshCw} size="sm" className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Flags List */}
      {Object.keys(groupedFlags).length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <Icon
            icon={AlertCircle}
            size="lg"
            className="mx-auto mb-4 text-[var(--foreground-muted)]"
          />
          <p className="text-[var(--foreground-muted)]">No feature flags found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedFlags).map(([flagKey, flagGroup]) => (
            <div
              key={flagKey}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{flagKey}</h3>
                  {flagGroup[0]?.description && (
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                      {flagGroup[0].description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {flagGroup.map(flag => (
                  <div
                    key={flag.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--foreground)]">
                          {flag.user_id ? 'User-Specific' : 'Global'}
                        </span>
                        {flag.user_id && (
                          <span className="text-xs text-[var(--foreground-muted)]">
                            ({flag.user_id.slice(0, 8)}...)
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            flag.enabled
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {flag.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span className="text-xs text-[var(--foreground-muted)]">
                          Updated: {new Date(flag.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleFlag(flag.flag_key, flag.enabled, flag.user_id)}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
                        aria-label={`${flag.enabled ? 'Disable' : 'Enable'} ${flag.flag_key}`}
                      >
                        <Icon icon={Power} size="sm" />
                        {flag.enabled ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => deleteFlag(flag.flag_key, flag.user_id)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                        aria-label={`Delete ${flag.flag_key}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Note */}
      <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
        <div className="flex items-start gap-3">
          <Icon icon={AlertCircle} size="sm" className="mt-0.5 text-[var(--primary)]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--foreground)]">Admin Access</p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Your email is in ALLOWED_EMAILS, so you automatically have access to all features
              regardless of flag settings. Feature flags control access for other users.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
