'use client';

import { Icon } from '@/components/ui/Icon';
import type { TierSlug } from '@/lib/tier-config';
import { CheckCircle, Edit, Trash2, XCircle } from 'lucide-react';
import type { TierConfiguration } from '../types';

interface TierHeaderProps {
  tier: TierConfiguration;
  isEditing: boolean;
  onEdit: () => void;
  onDisable: () => void;
}

const tierNames: Record<TierSlug, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

export function TierHeader({ tier, isEditing, onEdit, onDisable }: TierHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-xl font-bold text-white">{tierNames[tier.tier_slug]}</h3>
        <p className="mt-1 text-sm text-gray-400">Tier: {tier.tier_slug}</p>
      </div>
      <div className="flex items-center gap-2">
        <TierStatusBadge isActive={tier.is_active} />
        <TierActions
          isActive={tier.is_active}
          isEditing={isEditing}
          onEdit={onEdit}
          onDisable={onDisable}
        />
      </div>
    </div>
  );
}

function TierStatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="flex items-center gap-1 text-sm text-green-400">
        <Icon icon={CheckCircle} size="sm" />
        Active
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-sm text-red-400">
      <Icon icon={XCircle} size="sm" />
      Disabled
    </span>
  );
}

function TierActions({
  isActive,
  isEditing,
  onEdit,
  onDisable,
}: {
  isActive: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDisable: () => void;
}) {
  if (isEditing) return null;

  return (
    <>
      <button
        onClick={onEdit}
        className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
      >
        <Icon icon={Edit} size="sm" />
      </button>
      {isActive && (
        <button
          onClick={onDisable}
          className="text-red-400 transition-colors hover:text-red-300"
        >
          <Icon icon={Trash2} size="sm" />
        </button>
      )}
    </>
  );
}
