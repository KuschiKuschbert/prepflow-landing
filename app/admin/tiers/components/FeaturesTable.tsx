/**
 * Features Table Component
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';
import type { FeatureMapping } from '../types';
import { FeatureMappingRow } from './FeatureMappingRow';

interface FeaturesTableProps {
  features: FeatureMapping[];
  loading: boolean;
  error: string | null;
  editingFeature: string | null;
  onEdit: (featureKey: string) => void;
  onCancel: () => void;
  onSave: (feature: FeatureMapping) => void;
  onRetry: () => void;
}

export function FeaturesTable({
  features,
  loading,
  error,
  editingFeature,
  onEdit,
  onCancel,
  onSave,
  onRetry,
}: FeaturesTableProps) {
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
          <Icon icon={Sparkles} size="xl" className="mx-auto mb-4 text-red-400 opacity-50" />
          <p className="mb-2 font-medium text-red-400">Error Loading Feature Mappings</p>
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

  if (features.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="py-12 text-center text-gray-400">
          <Icon icon={Sparkles} size="xl" className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No feature mappings found</p>
          <p className="text-sm text-gray-500">Run migration to create default mappings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="space-y-3">
        {features.map(feature => (
          <FeatureMappingRow
            key={feature.feature_key}
            feature={feature}
            isEditing={editingFeature === feature.feature_key}
            onEdit={() => onEdit(feature.feature_key)}
            onCancel={onCancel}
            onSave={onSave}
          />
        ))}
      </div>
    </div>
  );
}
