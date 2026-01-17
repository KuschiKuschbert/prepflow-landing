'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { Heart, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BillingHealthReport } from './components/BillingHealthReport';
import { BillingStatsGrid } from './components/BillingStatsGrid';
import { SubscriptionsTable } from './components/SubscriptionsTable';
import { BILLING_API, COLORS, LABELS, SYNC_CONFIG, UI_MESSAGES } from './constants';

interface BillingData {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  failedPayments: number;
  subscriptions: {
    id: string;
    customer_email: string;
    status: string;
    amount: number;
    created_at: string;
  }[];
}

interface HealthReport {
  usersWithMissingSubscriptions: string[];
  subscriptionsWithMissingUsers: string[];
  mismatchedStatuses: Array<{ email: string; dbStatus: string; stripeStatus: string }>;
  totalUsers: number;
  totalSubscriptions: number;
  healthy: boolean;
}

/**
 * Billing administration page component.
 * Manages subscriptions, revenue tracking, and billing health checks.
 *
 * @component
 * @returns {JSX.Element} Billing admin page with subscription management and health reports
 */
export default function BillingPage() {
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    async function fetchBilling() {
      setLoading(true);
      try {
        const response = await fetch(BILLING_API.OVERVIEW);
        if (response.ok) {
          const data = await response.json();
          setBilling(data);
        }
      } catch (error) {
        logger.error('Failed to fetch billing data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBilling();
  }, []);

  const handleSyncSubscriptions = async () => {
    const confirmed = await showConfirm({
      title: UI_MESSAGES.SYNC_TITLE,
      message: UI_MESSAGES.SYNC_CONFIRM,
      variant: 'info',
      confirmLabel: LABELS.SYNC_ACTION,
      cancelLabel: LABELS.CANCEL,
    });

    if (!confirmed) return;

    setSyncing(true);
    try {
      const response = await fetch(BILLING_API.SYNC_SUBSCRIPTIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: SYNC_CONFIG.BATCH_LIMIT }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || UI_MESSAGES.SYNC_ERROR);
      }

      showSuccess(UI_MESSAGES.SYNC_SUCCESS(data.synced, data.errors));

      // Refresh billing data
      const billingResponse = await fetch(BILLING_API.OVERVIEW);
      if (billingResponse.ok) {
        const billingData = await billingResponse.json();
        setBilling(billingData);
      }
    } catch (error) {
      logger.error('Failed to sync subscriptions:', error);
      showError(error instanceof Error ? error.message : UI_MESSAGES.SYNC_ERROR);
    } finally {
      setSyncing(false);
    }
  };

  const handleCheckHealth = async () => {
    setCheckingHealth(true);
    try {
      const response = await fetch(BILLING_API.HEALTH);

      if (!response.ok) {
        throw new Error(UI_MESSAGES.HEALTH_ERROR);
      }

      const data = await response.json();
      setHealthReport(data.health);

      if (data.health.healthy) {
        showSuccess(UI_MESSAGES.HEALTH_SUCCESS);
      } else {
        const issues = [
          data.health.usersWithMissingSubscriptions.length > 0 &&
            `${data.health.usersWithMissingSubscriptions.length} users with missing subscriptions`,
          data.health.subscriptionsWithMissingUsers.length > 0 &&
            `${data.health.subscriptionsWithMissingUsers.length} subscriptions with missing users`,
          data.health.mismatchedStatuses.length > 0 &&
            `${data.health.mismatchedStatuses.length} status mismatches`,
        ]
          .filter(Boolean)
          .join(', ');

        showError(`${UI_MESSAGES.HEALTH_ISSUES_PREFIX}${issues}`);
      }
    } catch (error) {
      logger.error('Failed to check billing health:', error);
      showError(error instanceof Error ? error.message : UI_MESSAGES.HEALTH_ERROR);
    } finally {
      setCheckingHealth(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className={`mb-4 h-8 w-64 rounded bg-[${COLORS.BORDER_DARK}]`}></div>
          <div
            className={`h-96 rounded-2xl border border-[${COLORS.BORDER_DARK}] bg-[${COLORS.BG_DARK}]`}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Billing Administration</h1>
            <p className="mt-2 text-gray-400">Manage subscriptions and revenue</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCheckHealth}
              disabled={checkingHealth}
              className={`flex items-center gap-2 rounded-2xl border border-[${COLORS.BORDER_DARK}] bg-[${COLORS.BUTTON_BG}] px-4 py-2 transition-colors hover:bg-[${COLORS.HOVER_DARK}] disabled:opacity-50`}
            >
              <Icon
                icon={checkingHealth ? Loader2 : Heart}
                size="sm"
                className={checkingHealth ? 'animate-spin' : ''}
              />
              {checkingHealth ? LABELS.CHECKING : LABELS.CHECK_HEALTH}
            </button>
            <button
              onClick={handleSyncSubscriptions}
              disabled={syncing}
              className={`flex items-center gap-2 rounded-2xl border border-[${COLORS.BORDER_DARK}] bg-[${COLORS.BUTTON_BG}] px-4 py-2 transition-colors hover:bg-[${COLORS.HOVER_DARK}] disabled:opacity-50`}
            >
              <Icon
                icon={syncing ? Loader2 : RefreshCw}
                size="sm"
                className={syncing ? 'animate-spin' : ''}
              />
              {syncing ? LABELS.SYNCING : LABELS.SYNC}
            </button>
          </div>
        </div>

        <BillingHealthReport report={healthReport} />

        <BillingStatsGrid data={billing} />

        <SubscriptionsTable data={billing} />
      </div>
    </>
  );
}
