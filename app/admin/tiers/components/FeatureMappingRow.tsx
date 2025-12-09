'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Edit, Save, X } from 'lucide-react';
import type { TierSlug } from '@/lib/tier-config';
import type { FeatureMapping } from '../types';

interface FeatureMappingRowProps {
  feature: FeatureMapping;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (feature: FeatureMapping) => void;
}

const tierNames: Record<TierSlug, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

/**
 * Feature mapping row component for admin dashboard.
 * Displays and allows editing of feature-to-tier mappings.
 *
 * @component
 * @param {FeatureMappingRowProps} props - Component props
 * @param {FeatureMapping} props.feature - Feature mapping to display/edit
 * @param {boolean} props.isEditing - Whether feature is in edit mode
 * @param {Function} props.onEdit - Callback to enter edit mode
 * @param {Function} props.onCancel - Callback to cancel editing
 * @param {Function} props.onSave - Callback to save feature mapping changes
 * @returns {JSX.Element} Feature mapping row component
 */
export function FeatureMappingRow({
  feature,
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: FeatureMappingRowProps) {
  const [editedFeature, setEditedFeature] = useState<FeatureMapping>(feature);

  useEffect(() => {
    setEditedFeature(feature);
  }, [feature]);

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">{feature.feature_key}</span>
          {feature.is_premium && (
            <span className="rounded-full bg-[#29E7CD]/10 px-2 py-0.5 text-xs text-[#29E7CD]">
              Premium
            </span>
          )}
        </div>
        {feature.description && <p className="mt-1 text-sm text-gray-400">{feature.description}</p>}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <select
            value={editedFeature.required_tier}
            onChange={e =>
              setEditedFeature({
                ...editedFeature,
                required_tier: e.target.value as TierSlug,
              })
            }
            className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-1.5 text-white focus:border-[#29E7CD] focus:outline-none"
          >
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="business">Business</option>
          </select>
          <button
            onClick={() => onSave(editedFeature)}
            className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
          >
            <Icon icon={Save} size="sm" />
          </button>
          <button onClick={onCancel} className="text-gray-400 transition-colors hover:text-white">
            <Icon icon={X} size="sm" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">
            Requires:{' '}
            <span className="font-semibold text-white">{tierNames[feature.required_tier]}</span>
          </span>
          <button
            onClick={onEdit}
            className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
          >
            <Icon icon={Edit} size="sm" />
          </button>
        </div>
      )}
    </div>
  );
}
