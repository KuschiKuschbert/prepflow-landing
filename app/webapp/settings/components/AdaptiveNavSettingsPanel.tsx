// PrepFlow Adaptive Navigation Optimization - Settings Panel Component

'use client';

import { useAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { useNotification } from '@/contexts/NotificationContext';
import { useWorkflowPreference } from '@/lib/workflow/preferences';
import { useNavigationItems } from '@/app/webapp/components/navigation/nav-items';
import { useMemo } from 'react';

/**
 * Get display name for a category.
 *
 * @param {string} category - Category name
 * @returns {string} Display name
 */
function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    service: 'Service',
    'end-of-day': 'End of Day',
    'morning-prep': 'Morning Prep',
    tools: 'Tools',
    planning: 'Planning',
    operations: 'Operations',
    analysis: 'Analysis',
    menu: 'Menu',
    inventory: 'Inventory',
    overview: 'Overview',
    setup: 'Setup',
    other: 'Other',
  };
  return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function AdaptiveNavSettingsPanel() {
  const { settings, updateSettings } = useAdaptiveNavSettings();
  const { showInfo, showError } = useNotification();
  const { workflow } = useWorkflowPreference();
  const allItems = useNavigationItems(workflow);

  // Get available categories for current workflow
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    allItems.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories).sort();
  }, [allItems]);

  const handleToggleSection = (category: string) => {
    const currentSections = settings.selectedSections || [];
    const newSections = currentSections.includes(category)
      ? currentSections.filter(s => s !== category)
      : [...currentSections, category];

    updateSettings({ selectedSections: newSections });
  };

  const handleSyncToServer = async () => {
    try {
      const response = await fetch('/api/navigation-optimization/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: settings.enabled,
          selectedSections: settings.selectedSections,
        }),
      });

      if (response.ok) {
        showInfo('Preferences synced to server');
      } else {
        showError('Failed to sync preferences');
      }
    } catch (err) {
      showError('Failed to sync preferences');
    }
  };

  const formatLastUpdated = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Adaptive Navigation</h2>
          <p className="mt-1 text-sm text-gray-400">
            Automatically reorder navigation items based on your usage patterns
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={e => updateSettings({ enabled: e.target.checked })}
            className="h-5 w-5 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
          />
          <span className="text-sm text-gray-300">Enable</span>
        </label>
      </div>

      {settings.enabled && (
        <>
          {/* Section Selection */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">Sections to Optimize</h3>
            <p className="mb-4 text-xs text-gray-400">
              Select which navigation sections should be reordered based on your usage patterns.
              Items within selected sections will be reordered by time of day.
            </p>
            <div className="desktop:grid-cols-3 grid grid-cols-2 gap-3">
              {availableCategories.map(category => {
                const isSelected = settings.selectedSections?.includes(category) || false;
                return (
                  <button
                    key={category}
                    onClick={() => handleToggleSection(category)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'border-[#29E7CD] bg-[#29E7CD]/10 text-[#29E7CD]'
                        : 'border-[#2a2a2a] bg-[#2a2a2a]/30 text-gray-300 hover:border-[#2a2a2a]/50'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isSelected
                          ? 'border-[#29E7CD] bg-[#29E7CD]/20'
                          : 'border-[#2a2a2a] bg-[#1f1f1f]'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-[#29E7CD]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span>{getCategoryDisplayName(category)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Info */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-[#29E7CD]">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sections optimized:</span>
                <span className="text-gray-300">
                  {settings.selectedSections?.length || 0} of {availableCategories.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last updated:</span>
                <span className="text-gray-300">{formatLastUpdated(settings.lastUpdated)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-[#2a2a2a] pt-4">
            <button
              onClick={handleSyncToServer}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/50"
            >
              Sync to Server
            </button>
            <button
              onClick={() => {
                updateSettings({ selectedSections: [] });
                showInfo('All sections deselected');
              }}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/50"
            >
              Clear Selection
            </button>
          </div>
        </>
      )}

      {!settings.enabled && (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <p className="text-sm text-gray-400">
            Enable adaptive navigation to automatically optimize your navigation bar based on when
            and how you use different features. The system learns your patterns and reorders items
            to match your workflow.
          </p>
        </div>
      )}
    </div>
  );
}
