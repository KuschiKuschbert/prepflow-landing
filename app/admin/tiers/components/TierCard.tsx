'use client';

import { useEffect, useState } from 'react';
import type { TierConfiguration } from '../types';
import { TierEditForm } from './TierEditForm';
import { TierHeader } from './TierHeader';
import { TierSummary } from './TierSummary';

interface TierCardProps {
  tier: TierConfiguration;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (tier: TierConfiguration) => void;
  onDisable: () => void;
}

/**
 * Tier card component for admin dashboard.
 * Displays and allows editing of tier configuration (price, features, limits).
 * Refactored to use sub-components for better maintainability.
 */
export function TierCard({ tier, isEditing, onEdit, onCancel, onSave, onDisable }: TierCardProps) {
  const [editedTier, setEditedTier] = useState<TierConfiguration>(tier);

  useEffect(() => {
    setEditedTier(tier);
  }, [tier]);

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <TierHeader
        tier={tier}
        isEditing={isEditing}
        onEdit={onEdit}
        onDisable={onDisable}
      />

      {isEditing ? (
        <TierEditForm
          editedTier={editedTier}
          setEditedTier={setEditedTier}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <TierSummary tier={tier} />
      )}
    </div>
  );
}
