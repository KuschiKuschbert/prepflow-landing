/**
 * Feature Flags Table Component
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Flag, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { FeatureFlag } from '../types';

interface FeatureFlagsTableProps {
  flags: FeatureFlag[];
  loading: boolean;
  error: string | null;
  onToggle: (flag: FeatureFlag) => void;
  onDelete: (flag: FeatureFlag) => void;
  onRetry: () => void;
}

export function FeatureFlagsTable({
  flags,
  loading,
  error,
  onToggle,
  onDelete,
  onRetry,
}: FeatureFlagsTableProps) {
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
          <p className="mb-2 font-medium text-red-400">Error Loading Feature Flags</p>
          <p className="mb-4 text-sm text-gray-400">{error}</p>
          {error.includes('table does not exist') ||
          error.includes('TABLE_NOT_FOUND') ||
          error.includes('relation') ? (
            <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="mb-2 text-sm font-medium text-yellow-400">
                Table does not exist. Run migration:
              </p>
              <code className="mt-2 block rounded bg-[#0a0a0a] px-3 py-2 text-xs text-yellow-300">
                migrations/create_admin_tables.sql
              </code>
              <p className="mt-2 text-xs text-yellow-500/80">
                Execute this SQL file in your Supabase SQL Editor to create the feature_flags table.
              </p>
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
          <Icon icon={Flag} size="xl" className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No feature flags found</p>
          <p className="text-sm text-gray-500">
            Create your first feature flag using the &quot;Add Flag&quot; button above or discover
            flags from the codebase
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
                <span className="font-semibold text-white">{flag.flag_key}</span>
                {flag.user_id && <span className="text-xs text-gray-400">(User-specific)</span>}
              </div>
              {flag.description && <p className="mt-1 text-sm text-gray-400">{flag.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggle(flag)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                  flag.enabled
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                }`}
              >
                <Icon icon={flag.enabled ? ToggleRight : ToggleLeft} size="sm" />
                <span className="text-sm">{flag.enabled ? 'Enabled' : 'Disabled'}</span>
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
