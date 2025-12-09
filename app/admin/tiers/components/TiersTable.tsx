'use client';

import { Icon } from '@/components/ui/Icon';
import { Package } from 'lucide-react';
import type { TierConfiguration } from '../types';
import { TierCard } from './TierCard';

interface TiersTableProps {
  tiers: TierConfiguration[];
  loading: boolean;
  error: string | null;
  editingTier: string | null;
  onEdit: (tierSlug: string) => void;
  onCancel: () => void;
  onSave: (tier: TierConfiguration) => void;
  onDisable: (tierSlug: string) => void;
  onRetry: () => void;
}

/**
 * Tiers table component for admin dashboard.
 * Displays tier configurations with edit and disable actions.
 *
 * @component
 * @param {TiersTableProps} props - Component props
 * @param {TierConfiguration[]} props.tiers - Array of tier configurations
 * @param {boolean} props.loading - Loading state
 * @param {string | null} props.error - Error message if any
 * @param {string | null} props.editingTier - Slug of tier currently being edited
 * @param {Function} props.onEdit - Callback to enter edit mode
 * @param {Function} props.onCancel - Callback to cancel editing
 * @param {Function} props.onSave - Callback to save tier changes
 * @param {Function} props.onDisable - Callback to disable tier
 * @param {Function} props.onRetry - Callback to retry loading tiers
 * @returns {JSX.Element} Tiers table component
 */
export function TiersTable({
  tiers,
  loading,
  error,
  editingTier,
  onEdit,
  onCancel,
  onSave,
  onDisable,
  onRetry,
}: TiersTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded bg-[#2a2a2a]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-[#1f1f1f] p-6">
        <div className="py-12 text-center">
          <Icon icon={Package} size="xl" className="mx-auto mb-4 text-red-400 opacity-50" />
          <p className="mb-2 font-medium text-red-400">Error Loading Tiers</p>
          <p className="mb-4 text-sm text-gray-400">{error}</p>
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

  if (tiers.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="py-12 text-center text-gray-400">
          <Icon icon={Package} size="xl" className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No tiers found</p>
          <p className="text-sm text-gray-500">Run migration to create default tiers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tiers.map(tier => (
        <TierCard
          key={tier.tier_slug}
          tier={tier}
          isEditing={editingTier === tier.tier_slug}
          onEdit={() => onEdit(tier.tier_slug)}
          onCancel={onCancel}
          onSave={onSave}
          onDisable={() => onDisable(tier.tier_slug)}
        />
      ))}
    </div>
  );
}
