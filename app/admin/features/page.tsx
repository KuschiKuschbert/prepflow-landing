'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Plus, Search } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';
import { useNotification } from '@/contexts/NotificationContext';
import type { TabType } from './types';
import { useFeatureFlags } from './hooks/useFeatureFlags';
import { useHiddenFeatureFlags } from './hooks/useHiddenFeatureFlags';
import { useHiddenFeatureFlagsMutations } from './hooks/useHiddenFeatureFlagsMutations';
import { useFlagDiscovery } from './hooks/useFlagDiscovery';
import { useFlagAutoCreate } from './hooks/useFlagAutoCreate';
import { FeatureFlagsTable } from './components/FeatureFlagsTable';
import { HiddenFeatureFlagsTable } from './components/HiddenFeatureFlagsTable';
import { AddFlagModal } from './components/AddFlagModal';
import { SuggestedFlagsSection } from './components/SuggestedFlagsSection';

/**
 * Feature flags page component for admin dashboard.
 * Manages regular and hidden feature flags with discovery and auto-create.
 *
 * @component
 * @returns {JSX.Element} Feature flags admin page
 */
export default function FeatureFlagsPage() {
  const { showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabType>('regular');
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    flags,
    loading,
    error,
    fetchFlags,
    toggleFlag,
    deleteFlag: deleteFlagAction,
    createFlag,
  } = useFeatureFlags();

  const { hiddenFlags, hiddenLoading, hiddenError, fetchHiddenFlags } = useHiddenFeatureFlags();
  const { toggleHiddenFlag, deleteHiddenFlag: deleteHiddenFlagAction } =
    useHiddenFeatureFlagsMutations(fetchHiddenFlags);

  const { discovering, discoveredFlags, discoverFlags, setDiscoveredFlags } = useFlagDiscovery();
  const { autoCreating, autoCreateFlags } = useFlagAutoCreate(discoveredFlags);

  useEffect(() => {
    if (activeTab === 'regular') {
      fetchFlags();
    } else {
      fetchHiddenFlags();
    }
  }, [activeTab, fetchFlags, fetchHiddenFlags]);

  const handleDeleteFlag = async (flag: (typeof flags)[0]) => {
    const confirmed = await showConfirm({
      title: 'Delete Feature Flag',
      message: `Are you sure you want to delete the feature flag "${flag.flag_key}"?`,
      variant: 'danger',
    });

    if (!confirmed) return;
    await deleteFlagAction(flag);
  };

  const handleDeleteHiddenFlag = async (flag: (typeof hiddenFlags)[0]) => {
    const confirmed = await showConfirm({
      title: 'Delete Hidden Feature Flag',
      message: `Are you sure you want to delete the hidden feature flag "${flag.feature_key}"?`,
      variant: 'danger',
    });

    if (!confirmed) return;
    await deleteHiddenFlagAction(flag);
  };

  const handleAddFlag = async (flagData: {
    flag_key: string;
    description: string;
    enabled: boolean;
  }) => {
    if (!flagData.flag_key.trim()) {
      showError('Flag key is required');
      return;
    }
    const success = await createFlag(flagData);
    if (success) {
      setShowAddModal(false);
    }
  };

  const handleAutoCreate = async () => {
    await autoCreateFlags(() => {
      setDiscoveredFlags({ regular: [], hidden: [] });
      fetchFlags();
      fetchHiddenFlags();
    });
  };

  // Get existing flag keys for filtering discovered flags
  const existingRegularKeys = new Set(flags.map(f => f.flag_key));
  const existingHiddenKeys = new Set(hiddenFlags.map(f => f.feature_key));

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Feature Flags</h1>
            <p className="mt-2 text-gray-400">Manage feature flags and hidden features</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={discoverFlags}
              disabled={discovering}
              className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon={Search} size="sm" />
              {discovering ? 'Discovering...' : 'Discover Flags'}
            </button>
            {activeTab === 'regular' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
              >
                <Icon icon={Plus} size="sm" />
                Add Flag
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('regular')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'regular'
                ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Regular Flags
          </button>
          <button
            onClick={() => setActiveTab('hidden')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'hidden'
                ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Hidden Flags
          </button>
        </div>

        {/* Suggested Flags Section */}
        <SuggestedFlagsSection
          discoveredFlags={discoveredFlags}
          existingRegularKeys={existingRegularKeys}
          existingHiddenKeys={existingHiddenKeys}
          onAutoCreate={handleAutoCreate}
          autoCreating={autoCreating}
        />

        {/* Regular Flags Tab */}
        {activeTab === 'regular' && (
          <FeatureFlagsTable
            flags={flags}
            loading={loading}
            error={error}
            onToggle={toggleFlag}
            onDelete={handleDeleteFlag}
            onRetry={fetchFlags}
          />
        )}

        {/* Hidden Flags Tab */}
        {activeTab === 'hidden' && (
          <HiddenFeatureFlagsTable
            flags={hiddenFlags}
            loading={hiddenLoading}
            error={hiddenError}
            onToggle={toggleHiddenFlag}
            onDelete={handleDeleteHiddenFlag}
            onRetry={fetchHiddenFlags}
          />
        )}

        {/* Add Flag Modal */}
        <AddFlagModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddFlag}
        />
      </div>
    </>
  );
}
