'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { RefreshCw } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';
import type { TabType } from './types';
import { useTiers } from './hooks/useTiers';
import { useFeatures } from './hooks/useFeatures';
import { useCacheInvalidation } from './hooks/useCacheInvalidation';
import { TiersTable } from './components/TiersTable';
import { FeaturesTable } from './components/FeaturesTable';

export default function TiersPage() {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabType>('tiers');
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);

  const { tiers, loading, error, fetchTiers, updateTier, disableTier } = useTiers();
  const {
    features,
    loading: featuresLoading,
    error: featuresError,
    fetchFeatures,
    updateFeature,
  } = useFeatures();
  const { invalidating, invalidateCache } = useCacheInvalidation();

  useEffect(() => {
    if (activeTab === 'tiers') {
      fetchTiers();
    } else {
      fetchFeatures();
    }
  }, [activeTab, fetchTiers, fetchFeatures]);

  const handleDisableTier = async (tierSlug: string) => {
    const confirmed = await showConfirm({
      title: 'Disable Tier',
      message: `Are you sure you want to disable the ${tierSlug} tier? Users with this tier will be downgraded.`,
      variant: 'warning',
    });

    if (!confirmed) return;
    await disableTier(tierSlug);
  };

  const handleUpdateTier = async (tier: (typeof tiers)[0]) => {
    const success = await updateTier(tier);
    if (success) {
      setEditingTier(null);
    }
  };

  const handleUpdateFeature = async (feature: (typeof features)[0]) => {
    const success = await updateFeature(feature);
    if (success) {
      setEditingFeature(null);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tiers & Features</h1>
            <p className="mt-2 text-gray-400">Manage subscription tiers and feature mappings</p>
          </div>
          <button
            onClick={invalidateCache}
            disabled={invalidating}
            className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={RefreshCw} size="sm" className={invalidating ? 'animate-spin' : ''} />
            {invalidating ? 'Invalidating...' : 'Invalidate Cache'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'tiers'
                ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tier Configurations
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'features'
                ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Feature Mappings
          </button>
        </div>

        {/* Tiers Tab */}
        {activeTab === 'tiers' && (
          <TiersTable
            tiers={tiers}
            loading={loading}
            error={error}
            editingTier={editingTier}
            onEdit={setEditingTier}
            onCancel={() => setEditingTier(null)}
            onSave={handleUpdateTier}
            onDisable={handleDisableTier}
            onRetry={fetchTiers}
          />
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <FeaturesTable
            features={features}
            loading={featuresLoading}
            error={featuresError}
            editingFeature={editingFeature}
            onEdit={setEditingFeature}
            onCancel={() => setEditingFeature(null)}
            onSave={handleUpdateFeature}
            onRetry={fetchFeatures}
          />
        )}
      </div>
    </>
  );
}
