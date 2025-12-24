'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Webhook, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSquareStatus } from '../../hooks/useSquareStatus';

export function WebhooksSection() {
  const { status, loading, error } = useSquareStatus();

  // Memoize webhook status to prevent unnecessary re-renders
  const webhookStatus = useMemo(() => {
    if (!status?.config) return null;
    return {
      enabled: status.config.webhook_enabled || false,
      url: status.config.webhook_url || null,
    };
  }, [status]);

  if (loading) {
    return <LoadingSkeleton variant="card" className="h-64" />;
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Webhooks</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Configure webhooks for real-time updates from Square POS
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Webhook Status</h3>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                {webhookStatus?.enabled
                  ? 'Webhooks are enabled and configured'
                  : 'Webhooks are disabled'}
              </p>
            </div>
            {webhookStatus?.enabled ? (
              <Icon icon={CheckCircle2} size="lg" className="text-green-400" />
            ) : (
              <Icon icon={AlertCircle} size="lg" className="text-yellow-400" />
            )}
          </div>

          {webhookStatus?.enabled && webhookStatus?.url && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Webhook URL</p>
              <p className="mt-1 font-mono text-sm text-[var(--foreground)]">{webhookStatus.url}</p>
            </div>
          )}

          <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
            <div className="flex items-start gap-3">
              <Icon icon={AlertCircle} size="sm" className="mt-0.5 text-[var(--primary)]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Webhook Configuration
                </p>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Configure webhooks in the Configuration section. Webhooks allow Square to send
                  real-time updates to PrepFlow when data changes in Square POS.
                </p>
              </div>
            </div>
          </div>

          <a
            href="#configuration"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
          >
            <Icon icon={Webhook} size="sm" />
            Configure Webhooks
          </a>
        </div>
      </div>
    </div>
  );
}
