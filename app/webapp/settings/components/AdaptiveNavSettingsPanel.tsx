// PrepFlow Adaptive Navigation Optimization - Settings Panel Component
'use client';
import { useNavigationItems } from '@/app/webapp/components/navigation/nav-items';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { Beaker, Download, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { logger } from '@/lib/logger';

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
  const { showInfo, showError, showSuccess } = useNotification();
  const allItems = useNavigationItems();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
    // Store original settings for rollback
    const originalSettings = { ...settings };

    // Optimistically update UI immediately (settings are already updated locally)
    showInfo('Syncing preferences to server...');

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
        showSuccess('Preferences synced to server');
      } else {
        // Error - revert settings (though they were already local-only)
        updateSettings(originalSettings);
        showError('Failed to sync preferences');
      }
    } catch (err) {
      // Error - revert settings
      updateSettings(originalSettings);
      logger.error('[AdaptiveNavSettingsPanel] Error syncing:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError("Couldn't sync your preferences, chef. Give it another go.");
    }
  };
  const handleLoadFromServer = async () => {
    // Store original settings for rollback
    const originalSettings = { ...settings };

    // Optimistically show loading state via notification
    showInfo('Loading preferences from server...');

    try {
      const response = await fetch('/api/navigation-optimization/preferences', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        // Optimistically update UI immediately
        updateSettings({
          enabled: data.enabled || false,
          selectedSections: data.selectedSections || [],
        });
        showSuccess('Preferences loaded from server');
      } else {
        // Error - keep original settings
        showError('Failed to load preferences from server');
      }
    } catch (err) {
      // Error - revert to original settings
      updateSettings(originalSettings);
      logger.error('[AdaptiveNavSettingsPanel] Error loading:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError("Couldn't load preferences from server, chef. Try again.");
    }
  };

  const formatLastUpdated = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };
  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Adaptive Navigation</h2>
            <span
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-warning)]"
              title="This feature is experimental and may change"
            >
              <Icon
                icon={Beaker}
                size="xs"
                className="text-[var(--color-warning)]"
                aria-hidden={true}
              />
              Experimental
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--foreground)]/60">
            Automatically reorder navigation items based on your usage patterns
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={e => updateSettings({ enabled: e.target.checked })}
            className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
          />
          <span className="text-sm text-[var(--foreground)]/80">Enable</span>
        </label>
      </div>

      {mounted && settings.enabled && (
        <>
          {/* Section Selection */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--foreground)]/80">
              Sections to Optimize
            </h3>
            <p className="mb-4 text-xs text-[var(--foreground)]/60">
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
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'border-[var(--border)] bg-[var(--muted)]/30 text-[var(--foreground)]/80 hover:border-[var(--border)]/50'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/20'
                          : 'border-[var(--border)] bg-[var(--surface)]'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-[var(--primary)]"
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
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--foreground)]/60">Status:</span>
                <span className="text-[var(--primary)]">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground)]/60">Sections optimized:</span>
                <span className="text-[var(--foreground)]/80">
                  {settings.selectedSections?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground)]/60">Last updated:</span>
                <span className="text-[var(--foreground)]/80">
                  {formatLastUpdated(settings.lastUpdated)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-4">
            <div className="group relative">
              <button
                onClick={handleSyncToServer}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/30 px-4 py-2 text-sm text-[var(--foreground)]/80 transition-colors hover:bg-[var(--surface)]/50"
                aria-label="Sync to Server - Syncs your local preferences to your account so they persist across devices and browser sessions"
              >
                Sync to Server
                <Icon
                  icon={Info}
                  size="xs"
                  className="text-[var(--foreground)]/60"
                  aria-hidden={true}
                />
              </button>
              <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--foreground)]/80 shadow-lg group-hover:block">
                Syncs your local preferences (enabled state and selected sections) to your account
                so they persist across devices and browser sessions. Currently uses localStorage by
                default; syncing saves preferences to your account.
              </div>
            </div>
            <button
              onClick={handleLoadFromServer}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-sm text-[var(--foreground)]/80 transition-colors hover:bg-[var(--muted)]/50"
            >
              <Icon
                icon={Download}
                size="xs"
                className="text-[var(--foreground)]/80"
                aria-hidden={true}
              />
              Load from Server
            </button>
            <button
              onClick={() => {
                updateSettings({ selectedSections: [] });
                showInfo('All sections deselected');
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-sm text-[var(--foreground)]/80 transition-colors hover:bg-[var(--muted)]/50"
            >
              Clear Selection
            </button>
          </div>
        </>
      )}

      {mounted && !settings.enabled && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <p className="text-sm text-[var(--foreground)]/60">
            Enable adaptive navigation to automatically optimize your navigation bar based on when
            and how you use different features. The system learns your patterns and reorders items
            to match your workflow.
          </p>
        </div>
      )}
    </div>
  );
}
