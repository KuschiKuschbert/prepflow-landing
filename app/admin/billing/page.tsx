'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Heart,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
        const response = await fetch('/api/admin/billing/overview');
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
      title: 'Sync Subscriptions',
      message:
        'Sync all subscriptions from Stripe? This&apos;ll update subscription statuses and reconcile any mismatches. This may take a few moments.',
      variant: 'info',
      confirmLabel: 'Sync',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    setSyncing(true);
    try {
      const response = await fetch('/api/admin/billing/sync-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to sync subscriptions');
      }

      showSuccess(`Synced ${data.synced} subscriptions with ${data.errors} errors`);

      // Refresh billing data
      const billingResponse = await fetch('/api/admin/billing/overview');
      if (billingResponse.ok) {
        const billingData = await billingResponse.json();
        setBilling(billingData);
      }
    } catch (error) {
      logger.error('Failed to sync subscriptions:', error);
      showError(error instanceof Error ? error.message : 'Failed to sync subscriptions');
    } finally {
      setSyncing(false);
    }
  };

  const handleCheckHealth = async () => {
    setCheckingHealth(true);
    try {
      const response = await fetch('/api/admin/billing/health');

      if (!response.ok) {
        throw new Error('Failed to check billing health');
      }

      const data = await response.json();
      setHealthReport(data.health);

      if (data.health.healthy) {
        showSuccess('Billing health check passed - no issues found');
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

        showError(`Billing health check found issues: ${issues}`);
      }
    } catch (error) {
      logger.error('Failed to check billing health:', error);
      showError(error instanceof Error ? error.message : 'Failed to check billing health');
    } finally {
      setCheckingHealth(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-64 rounded bg-[#2a2a2a]"></div>
          <div className="h-96 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]"></div>
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
              className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-2 transition-colors hover:bg-[#2a2a2a]/60 disabled:opacity-50"
            >
              <Icon
                icon={checkingHealth ? Loader2 : Heart}
                size="sm"
                className={checkingHealth ? 'animate-spin' : ''}
              />
              {checkingHealth ? 'Checking...' : 'Check Health'}
            </button>
            <button
              onClick={handleSyncSubscriptions}
              disabled={syncing}
              className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-2 transition-colors hover:bg-[#2a2a2a]/60 disabled:opacity-50"
            >
              <Icon
                icon={syncing ? Loader2 : RefreshCw}
                size="sm"
                className={syncing ? 'animate-spin' : ''}
              />
              {syncing ? 'Syncing...' : 'Sync Subscriptions'}
            </button>
          </div>
        </div>

        {/* Health Report */}
        {healthReport && (
          <div
            className={`rounded-2xl border p-6 ${
              healthReport.healthy
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-yellow-500/30 bg-yellow-500/10'
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <Icon
                icon={healthReport.healthy ? CheckCircle : AlertCircle}
                size="md"
                className={healthReport.healthy ? 'text-green-400' : 'text-yellow-400'}
              />
              <h2 className="text-xl font-semibold text-white">
                {healthReport.healthy ? 'Billing Health: Good' : 'Billing Health: Issues Found'}
              </h2>
            </div>

            <div className="tablet:grid-cols-3 desktop:grid-cols-4 mb-4 grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{healthReport.totalUsers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Subscriptions</p>
                <p className="text-2xl font-bold text-white">{healthReport.totalSubscriptions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Missing Subscriptions</p>
                <p className="text-2xl font-bold text-white">
                  {healthReport.usersWithMissingSubscriptions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status Mismatches</p>
                <p className="text-2xl font-bold text-white">
                  {healthReport.mismatchedStatuses.length}
                </p>
              </div>
            </div>

            {healthReport.usersWithMissingSubscriptions.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-white">
                  Users with Missing Subscriptions:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
                  {healthReport.usersWithMissingSubscriptions.slice(0, 5).map(email => (
                    <li key={email}>{email}</li>
                  ))}
                  {healthReport.usersWithMissingSubscriptions.length > 5 && (
                    <li className="text-gray-500">
                      ...and {healthReport.usersWithMissingSubscriptions.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {healthReport.mismatchedStatuses.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-white">Status Mismatches:</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="py-2 text-left text-gray-400">Email</th>
                        <th className="py-2 text-left text-gray-400">DB Status</th>
                        <th className="py-2 text-left text-gray-400">Stripe Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthReport.mismatchedStatuses.slice(0, 5).map((mismatch, idx) => (
                        <tr key={idx} className="border-b border-[#2a2a2a]/50">
                          <td className="py-2 text-white">{mismatch.email}</td>
                          <td className="py-2 text-yellow-400">{mismatch.dbStatus}</td>
                          <td className="py-2 text-yellow-400">{mismatch.stripeStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">MRR</h3>
              <Icon icon={DollarSign} size="md" className="text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              ${((billing?.monthlyRecurringRevenue || 0) / 100).toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active</h3>
              <Icon icon={CheckCircle} size="md" className="text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{billing?.activeSubscriptions || 0}</p>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Trials</h3>
              <Icon icon={TrendingUp} size="md" className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{billing?.trialSubscriptions || 0}</p>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Failed</h3>
              <Icon icon={AlertCircle} size="md" className="text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{billing?.failedPayments || 0}</p>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Subscriptions</h2>
          {billing?.subscriptions && billing.subscriptions.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#2a2a2a]">
              <table className="min-w-full divide-y divide-[#2a2a2a]">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
                  {billing.subscriptions.map(sub => (
                    <tr key={sub.id} className="transition-colors hover:bg-[#2a2a2a]/20">
                      <td className="px-6 py-4 text-sm text-white">{sub.customer_email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            sub.status === 'active'
                              ? 'bg-green-500/10 text-green-400'
                              : sub.status === 'trialing'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        ${(sub.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-400">No subscriptions found</p>
          )}
        </div>
      </div>
    </>
  );
}
