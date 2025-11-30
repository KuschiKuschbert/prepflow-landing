'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { Download, Trash2, Activity, Database, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { fetchInParallel } from '@/lib/api/batch-utils';
import { useIsVisible } from '@/hooks/useIsVisible';

interface DataUsage {
  usage: {
    ingredients: { count: number; size_bytes: number };
    recipes: { count: number; size_bytes: number };
    dishes: { count: number; size_bytes: number };
    temperature_logs: { count: number; size_bytes: number };
    cleaning_tasks: { count: number; size_bytes: number };
    compliance_records: { count: number; size_bytes: number };
  };
  total_size_bytes: number;
}

interface AccountActivity {
  id: string;
  action_type: string;
  entity_type: string;
  created_at: string;
}

/**
 * Enhanced privacy controls panel component for settings page.
 * Displays account activity, data usage, and data export/deletion options.
 *
 * @component
 * @returns {JSX.Element} Privacy controls panel
 */
export function PrivacyControlsPanel() {
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [ref, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.1 });
  const [loading, setLoading] = useState(true);
  const [dataUsage, setDataUsage] = useState<DataUsage | null>(null);
  const [recentActivity, setRecentActivity] = useState<AccountActivity[]>([]);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const loadPrivacyData = async () => {
      try {
        // Try to load from cache first for instant display
        const cachedUsage = getCachedData<DataUsage>('privacy_data_usage');
        const cachedActivity = getCachedData<AccountActivity[]>('privacy_recent_activity');

        if (cachedUsage) {
          setDataUsage(cachedUsage);
        }
        if (cachedActivity) {
          setRecentActivity(cachedActivity);
        }

        // Fetch fresh data in parallel
        const [usageResult, activityResult] = await fetchInParallel(
          [
            async () => {
              const response = await fetch('/api/user/data-usage');
              if (!response.ok) throw new Error('Failed to fetch data usage');
              return await response.json();
            },
            async () => {
              const response = await fetch('/api/user/activity?limit=5');
              if (!response.ok) throw new Error('Failed to fetch activity');
              const data = await response.json();
              return data.activity || [];
            },
          ],
          {
            continueOnError: true,
            onError: (error, index) => {
              logger.error(`Failed to fetch privacy data (index ${index}):`, error);
            },
          },
        );

        // Update state with fresh data
        if (usageResult) {
          setDataUsage(usageResult);
          cacheData('privacy_data_usage', usageResult, 5 * 60 * 1000); // 5 minutes
        }
        if (activityResult) {
          setRecentActivity(activityResult);
          cacheData('privacy_recent_activity', activityResult, 2 * 60 * 1000); // 2 minutes
        }
      } catch (error) {
        logger.error('Failed to load privacy data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyData();
  }, [isVisible]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/account/export');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prepflow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSuccess('Data exported successfully');
    } catch (error) {
      logger.error('Failed to export data:', error);
      showError('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete Your Account?',
      message:
        'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted after a 7-day grace period. You can cancel this request anytime before then.',
      variant: 'danger',
      confirmLabel: 'Yes, Delete My Account',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to request deletion');
      }

      setDeletionRequested(true);
      showSuccess(data.message || 'Account deletion requested successfully');
    } catch (error) {
      logger.error('Failed to request deletion:', error);
      showError(error instanceof Error ? error.message : 'Failed to request deletion');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDeletion = async () => {
    const confirmed = await showConfirm({
      title: 'Cancel Account Deletion?',
      message: 'Are you sure you want to cancel the account deletion request? Your account will remain active.',
      variant: 'info',
      confirmLabel: 'Yes, Cancel Deletion',
      cancelLabel: 'Keep Deletion Request',
    });

    if (!confirmed) return;

    try {
      const response = await fetch('/api/account/delete?cancel=true', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to cancel deletion');
      }

      setDeletionRequested(false);
      showSuccess(data.message || 'Account deletion cancelled');
    } catch (error) {
      logger.error('Failed to cancel deletion:', error);
      showError(error instanceof Error ? error.message : 'Failed to cancel deletion');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  if (loading) {
    return (
      <div ref={ref} className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-[#2a2a2a]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#2a2a2a]" />
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div ref={ref} className="mb-6 space-y-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div>
          <h2 className="text-xl font-semibold">Privacy & Data</h2>
          <p className="mt-1 text-sm text-gray-300">
            Manage your data, view activity, and control your privacy settings.
          </p>
        </div>

        {/* Account Activity */}
        <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
          <div className="flex items-center gap-2">
            <Icon icon={Activity} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            <h3 className="text-lg font-medium">Recent Activity</h3>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">
              No recent activity found. Activity will be tracked after database migration is applied.
            </p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activity.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Usage */}
        {dataUsage && (
          <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
            <div className="flex items-center gap-2">
              <Icon icon={Database} size="md" className="text-[#29E7CD]" aria-hidden={true} />
              <h3 className="text-lg font-medium">Data Usage</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2">
              {Object.entries(dataUsage.usage).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-3"
                >
                  <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-lg font-semibold text-white">
                      {value.count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      ({formatFileSize(value.size_bytes)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-3">
              <p className="text-xs text-gray-500">Total Storage</p>
              <p className="text-lg font-semibold text-[#29E7CD]">
                {formatFileSize(dataUsage.total_size_bytes)}
              </p>
            </div>
          </div>
        )}

        {/* Data Export */}
        <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
          <h3 className="text-lg font-medium">Export Your Data</h3>
          <p className="text-sm text-gray-400">
            Download a copy of all your data in JSON format. This includes ingredients, recipes,
            dishes, and all other data associated with your account.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/60 disabled:opacity-50"
          >
            <Icon icon={Download} size="sm" aria-hidden={true} />
            {exporting ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>

        {/* Account Deletion */}
        <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
          <div className="flex items-center gap-2">
            <Icon icon={AlertTriangle} size="md" className="text-red-400" aria-hidden={true} />
            <h3 className="text-lg font-medium text-red-400">Delete Your Account</h3>
          </div>
          {deletionRequested ? (
            <div className="space-y-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
              <p className="text-sm text-yellow-400">
                Account deletion requested. Your account will be permanently deleted after a 7-day
                grace period. You can cancel this request anytime before then.
              </p>
              <button
                onClick={handleCancelDeletion}
                className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400 transition-colors hover:bg-yellow-500/20"
              >
                Cancel Deletion Request
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400">
                Permanently delete your account and all associated data. This action cannot be
                undone. You will have a 7-day grace period to cancel the deletion request.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                <Icon icon={Trash2} size="sm" aria-hidden={true} />
                {deleting ? 'Requesting...' : 'Request Account Deletion'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
