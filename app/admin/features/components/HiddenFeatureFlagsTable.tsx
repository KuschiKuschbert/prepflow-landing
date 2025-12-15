'use client';

import { Icon } from '@/components/ui/Icon';
import { Flag, Lock, ToggleLeft, ToggleRight, Trash2, Unlock } from 'lucide-react';
import type { HiddenFeatureFlag } from '../types';

interface HiddenFeatureFlagsTableProps {
  flags: HiddenFeatureFlag[];
  loading: boolean;
  error: string | null;
  onToggle: (flag: HiddenFeatureFlag, field: 'is_unlocked' | 'is_enabled') => void;
  onDelete: (flag: HiddenFeatureFlag) => void;
  onRetry: () => void;
}

/**
 * Hidden feature flags table component for admin dashboard.
 * Displays hidden feature flags with unlock/enable toggle and delete actions.
 *
 * @component
 * @param {HiddenFeatureFlagsTableProps} props - Component props
 * @param {HiddenFeatureFlag[]} props.flags - Array of hidden feature flags to display
 * @param {boolean} props.loading - Loading state
 * @param {string | null} props.error - Error message if any
 * @param {Function} props.onToggle - Callback when flag is toggled (unlock or enable)
 * @param {Function} props.onDelete - Callback when flag is deleted
 * @param {Function} props.onRetry - Callback to retry loading flags
 * @returns {JSX.Element} Hidden feature flags table component
 */
export function HiddenFeatureFlagsTable({
  flags,
  loading,
  error,
  onToggle,
  onDelete,
  onRetry,
}: HiddenFeatureFlagsTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded bg-[#2a2a2a]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-[#1f1f1f] p-6">
        <div className="py-12 text-center">
          <Icon icon={Flag} size="xl" className="mx-auto mb-4 text-red-400 opacity-50" />
          <p className="mb-2 font-medium text-red-400">Error Loading Hidden Feature Flags</p>
          <p className="mb-4 text-sm text-gray-400">{error}</p>
          {error.includes('table does not exist') ||
          error.includes('TABLE_NOT_FOUND') ||
          error.includes('relation') ? (
            <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="mb-2 text-sm font-medium text-yellow-400">
                Table doesn&apos;t exist. Run migration:
              </p>
              <code className="mt-2 block rounded bg-[#0a0a0a] px-3 py-2 text-xs text-yellow-300">
                migrations/create_hidden_feature_flags_table.sql
              </code>
            </div>
          ) : null}
          <button
            onClick={onRetry}
            className="mt-4 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (flags.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="py-12 text-center text-gray-400">
          <Icon icon={Lock} size="xl" className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No hidden feature flags found</p>
          <p className="text-sm text-gray-500">
            Discover hidden feature flags from the codebase using the &quot;Discover Flags&quot;
            button
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="space-y-3">
        {flags.map(flag => (
          <div
            key={flag.id}
            className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">{flag.feature_key}</span>
              </div>
              {flag.description && <p className="mt-1 text-sm text-gray-400">{flag.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggle(flag, 'is_unlocked')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                  flag.is_unlocked
                    ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                    : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                }`}
              >
                <Icon icon={flag.is_unlocked ? Unlock : Lock} size="sm" />
                <span className="text-sm">{flag.is_unlocked ? 'Unlocked' : 'Locked'}</span>
              </button>
              <button
                onClick={() => onToggle(flag, 'is_enabled')}
                disabled={!flag.is_unlocked}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  flag.is_enabled
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                }`}
              >
                <Icon icon={flag.is_enabled ? ToggleRight : ToggleLeft} size="sm" />
                <span className="text-sm">{flag.is_enabled ? 'Enabled' : 'Disabled'}</span>
              </button>
              <button
                onClick={() => onDelete(flag)}
                className="text-red-400 transition-colors hover:text-red-300"
              >
                <Icon icon={Trash2} size="sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
