'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, CheckCircle, Plus, Thermometer } from 'lucide-react';
import Link from 'next/link';
import { useTemperatureStatus } from './hooks/useTemperatureStatus';

export default function TemperatureStatus() {
  const { temperatureChecksToday, activeEquipment, outOfRangeAlerts, lastCheckTime, loading } =
    useTemperatureStatus();

  if (loading) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl glass-surface border border-[var(--border)]/30 p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[var(--muted)]" />
          <div className="tablet:grid-cols-3 grid grid-cols-1 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatLastCheckTime = (timeString?: string) => {
    if (!timeString) return 'Never';
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffHours > 24) {
        return `${Math.floor(diffHours / 24)} days ago`;
      }
      if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      }
      if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      }
      return 'Just now';
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl glass-surface border border-[var(--border)]/30 p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
            Temperature Status
          </h2>
          <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-[var(--foreground-muted)]">
            Food safety compliance tracking
          </p>
        </div>
        <Link
          href="/webapp/temperature"
          className="tablet:rounded-2xl flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-[var(--button-active-text)] transition-all duration-200 hover:shadow-[var(--primary)]/20 hover:shadow-lg active:scale-[0.98]"
        >
          <Icon icon={Plus} size="sm" aria-hidden={true} />
          <span className="text-fluid-xs tablet:inline tablet:text-fluid-sm ml-2 hidden font-medium">
            Log Temperature
          </span>
        </Link>
      </div>

      <div className="tablet:grid-cols-3 tablet:gap-4 grid grid-cols-1 gap-3">
        {/* Food Items Checked Today */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl glass-panel border border-[var(--border)]/30 p-3 shadow-sm transition-all duration-300 hover:border-[var(--primary)]/30">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${
                temperatureChecksToday === 0
                  ? 'from-gray-500/20 to-gray-500/10'
                  : temperatureChecksToday >= 1
                    ? 'from-green-500/20 to-green-500/10'
                    : 'from-yellow-500/20 to-yellow-500/10'
              }`}
            >
              <Icon
                icon={CheckCircle}
                size="sm"
                className={
                  temperatureChecksToday === 0
                    ? 'text-[var(--foreground-muted)]'
                    : temperatureChecksToday >= 1
                      ? 'text-[var(--color-success)]'
                      : 'text-[var(--color-warning)]'
                }
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                Food Checks Today
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  temperatureChecksToday === 0
                    ? 'text-[var(--foreground-muted)]'
                    : temperatureChecksToday >= 1
                      ? 'text-[var(--color-success)]'
                      : 'text-[var(--color-warning)]'
                }`}
              >
                {temperatureChecksToday}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-[var(--foreground-muted)]">
            {temperatureChecksToday === 0
              ? 'No checks recorded today'
              : temperatureChecksToday === 1
                ? '1 check recorded'
                : `${temperatureChecksToday} checks recorded`}
          </p>
        </div>

        {/* Equipment Status */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl glass-panel border border-[var(--border)]/30 p-3 shadow-sm transition-all duration-300 hover:border-[var(--primary)]/30">
          <div className="mb-2 flex items-center gap-2">
            <div className="tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-info)]/20 to-[var(--color-info)]/10">
              <Icon
                icon={Thermometer}
                size="sm"
                className="text-[var(--color-info)]"
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                Active Equipment
              </p>
              <p className="text-fluid-xl tablet:text-fluid-2xl font-bold text-[var(--foreground)]">
                {activeEquipment}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-[var(--foreground-muted)]">
            {activeEquipment === 0
              ? 'No active equipment'
              : activeEquipment === 1
                ? '1 piece of equipment'
                : `${activeEquipment} pieces of equipment`}
          </p>
        </div>

        {/* Out of Range Alerts */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl glass-panel border border-[var(--border)]/30 p-3 shadow-sm transition-all duration-300 hover:border-[var(--primary)]/30">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${
                outOfRangeAlerts > 0
                  ? 'from-red-500/20 to-red-500/10'
                  : 'from-green-500/20 to-green-500/10'
              }`}
            >
              <Icon
                icon={outOfRangeAlerts > 0 ? AlertTriangle : CheckCircle}
                size="sm"
                className={
                  outOfRangeAlerts > 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'
                }
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                Out of Range
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  outOfRangeAlerts > 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'
                }`}
              >
                {outOfRangeAlerts}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-[var(--foreground-muted)]">
            {outOfRangeAlerts === 0
              ? 'All temperatures in range'
              : outOfRangeAlerts === 1
                ? '1 alert - action needed'
                : `${outOfRangeAlerts} alerts - action needed`}
          </p>
        </div>
      </div>

      {lastCheckTime && (
        <div className="tablet:mt-6 tablet:rounded-2xl tablet:p-4 mt-4 rounded-xl glass-panel border border-[var(--border)]/30 p-3">
          <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
            Last check:{' '}
            <span className="text-[var(--foreground)]">{formatLastCheckTime(lastCheckTime)}</span>
          </p>
        </div>
      )}

      <div className="tablet:mt-6 mt-4">
        <Link
          href="/webapp/temperature"
          className="text-fluid-xs tablet:text-fluid-sm block text-center font-medium text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
        >
          View Full Temperature Logs →
        </Link>
      </div>
    </div>
  );
}
