'use client';

import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import type { DiscoveredFlag } from '../types';

interface SuggestedFlagsSectionProps {
  discoveredFlags: { regular: DiscoveredFlag[]; hidden: DiscoveredFlag[] };
  existingRegularKeys: Set<string>;
  existingHiddenKeys: Set<string>;
  onAutoCreate: () => void;
  autoCreating: boolean;
}

/**
 * Suggested flags section component for admin dashboard.
 * Displays discovered feature flags that can be auto-created.
 *
 * @component
 * @param {SuggestedFlagsSectionProps} props - Component props
 * @param {Object} props.discoveredFlags - Discovered flags grouped by type
 * @param {Set<string>} props.existingRegularKeys - Set of existing regular flag keys
 * @param {Set<string>} props.existingHiddenKeys - Set of existing hidden flag keys
 * @param {Function} props.onAutoCreate - Callback to auto-create missing flags
 * @param {boolean} props.autoCreating - Loading state for auto-create operation
 * @returns {JSX.Element} Suggested flags section component
 */
export function SuggestedFlagsSection({
  discoveredFlags,
  existingRegularKeys,
  existingHiddenKeys,
  onAutoCreate,
  autoCreating,
}: SuggestedFlagsSectionProps) {
  const missingRegularFlags = useMemo(
    () => discoveredFlags.regular.filter(f => !existingRegularKeys.has(f.flagKey)),
    [discoveredFlags.regular, existingRegularKeys],
  );
  const missingHiddenFlags = useMemo(
    () => discoveredFlags.hidden.filter(f => !existingHiddenKeys.has(f.flagKey)),
    [discoveredFlags.hidden, existingHiddenKeys],
  );

  const hasMissingFlags = missingRegularFlags.length > 0 || missingHiddenFlags.length > 0;

  if (!hasMissingFlags) return null;

  return (
    <div className="rounded-2xl border border-[#29E7CD]/20 bg-[#1f1f1f] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon={Sparkles} size="md" className="text-[#29E7CD]" />
          <h2 className="text-xl font-bold text-white">Suggested Flags</h2>
          <span className="text-sm text-gray-400">
            ({missingRegularFlags.length + missingHiddenFlags.length} discovered)
          </span>
        </div>
        <button
          onClick={onAutoCreate}
          disabled={autoCreating}
          className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {autoCreating ? 'Creating...' : 'Create All Missing'}
        </button>
      </div>
      <div className="space-y-2">
        {missingRegularFlags.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-gray-400">Regular Flags:</p>
            <div className="space-y-1">
              {missingRegularFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-3"
                >
                  <div>
                    <span className="font-semibold text-white">{flag.flagKey}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({flag.file}:{flag.line})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {missingHiddenFlags.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-gray-400">Hidden Flags:</p>
            <div className="space-y-1">
              {missingHiddenFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-3"
                >
                  <div>
                    <span className="font-semibold text-white">{flag.flagKey}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({flag.file}:{flag.line})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
